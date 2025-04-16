import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEmergencyContacts, deleteEmergencyContact } from '../../services/safety';

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
    
    // Refresh when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadContacts();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadContacts = async () => {
    try {
      const data = await getEmergencyContacts();
      setContacts(data);
    } catch (error) {
      // Use mock data for hackathon demo
      setContacts([
        { id: '1', name: 'Mom', phone: '123-456-7890', relationship: 'Family' },
        { id: '2', name: 'Sister', phone: '987-654-3210', relationship: 'Family' },
        { id: '3', name: 'Best Friend', phone: '555-123-4567', relationship: 'Friend' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEmergencyContact(contactId);
              setContacts(contacts.filter(c => c.id !== contactId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact');
            }
          } 
        },
      ]
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactRelationship}>{item.relationship}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency Contacts</Text>
      <Text style={styles.subheader}>
        These contacts will be notified in case of emergency
      </Text>
      
      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading contacts...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>No emergency contacts added yet</Text>
            }
          />
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddContactScreen')}
          >
            <Text style={styles.addButtonText}>Add New Contact</Text>
          </TouchableOpacity>
        </>
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
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  listContainer: {
    flexGrow: 1,
  },
  contactCard: {
    flexDirection: 'row',
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactPhone: {
    color: '#666',
    marginBottom: 4,
  },
  contactRelationship: {
    fontSize: 14,
    color: '#999',
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 16,
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
});