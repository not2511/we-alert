import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SOSButton from '../components/common/SOSButton';
import DecoyModeToggle from '../components/common/DecoyModeToggle';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  const featuredSections = [
    {
      id: 'map',
      title: 'Safety Map',
      icon: 'map-outline',
      color: '#4CAF50',
      screen: 'MapScreen',
      description: 'View safety heatmap and find safe routes',
    },
    {
      id: 'community',
      title: 'Community',
      icon: 'people-outline',
      color: '#2196F3',
      screen: 'CommunityForumsScreen',
      description: 'Connect with other women in the community',
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      icon: 'call-outline',
      color: '#FF9800',
      screen: 'ContactsScreen',
      description: 'Manage your emergency contacts',
    },
    {
      id: 'settings',
      title: 'Safety Settings',
      icon: 'shield-outline',
      color: '#9C27B0',
      screen: 'SafetySettingsScreen',
      description: 'Configure your safety preferences',
    },
  ];

  const renderFeatureCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.featureCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'there'}!</Text>
          <Text style={styles.tagline}>Stay safe, stay connected</Text>
        </View>

        <DecoyModeToggle />
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          {featuredSections.map(renderFeatureCard)}
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Stay Aware of Surroundings</Text>
            <Text style={styles.tipContent}>
              Keep your head up and avoid distractions like texting while walking in unfamiliar areas.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <SOSButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  tipsContainer: {
    padding: 16,
    paddingBottom: 80, // Space for SOS button
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});