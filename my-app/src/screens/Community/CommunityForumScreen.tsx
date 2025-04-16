import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getForums } from '../../services/community';

export default function CommunityForumsScreen({ navigation }) {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForums = async () => {
      try {
        // In a hackathon, we might use mock data initially
        const forumsData = await getForums();
        setForums(forumsData);
      } catch (error) {
        // Fallback to mock data
        setForums([
          { id: 1, name: 'General Discussion', description: 'Talk about anything related to women\'s safety' },
          { id: 2, name: 'Share Experiences', description: 'A safe space to share your experiences' },
          { id: 3, name: 'Mental Health Support', description: 'Support for mental health concerns' },
          { id: 4, name: 'Legal Advice', description: 'Questions about legal rights and protections' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadForums();
  }, []);

  const renderForumItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.forumCard}
      onPress={() => navigation.navigate('ForumDetailScreen', { forumId: item.id, forumName: item.name })}
    >
      <Text style={styles.forumName}>{item.name}</Text>
      <Text style={styles.forumDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Forums</Text>
      
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading forums...</Text>
        </View>
      ) : (
        <FlatList
          data={forums}
          renderItem={renderForumItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  forumCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  forumName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  forumDescription: {
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});