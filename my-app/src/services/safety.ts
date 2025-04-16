import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';


export const getSafetyData = async (latitude: any, longitude: any, radius = 2) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/safety/areas/`, {
      params: { latitude, longitude, radius },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    return response.data;
  } catch (error) {
    console.log('Using mock safety data for hackathon demo');    
    return generateMockSafetyPoints(latitude, longitude);
  }
};

export const calculateSafeRoute = async (startLat: any, startLng: any, endLat: any, endLng: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/safety/route/`, {
      params: { 
        start_lat: startLat, 
        start_lng: startLng,
        end_lat: endLat,
        end_lng: endLng
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    return response.data;
  } catch (error) {
    console.log('Using mock route data for hackathon demo');
    return generateMockRoute(startLat, startLng, endLat, endLng);
  }
};
export const sendSOSAlert = async (locationData: { latitude: any; longitude: any; timestamp: string; }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.post(`${API_URL}/emergency/sos/`, locationData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.log('Using mock SOS response for hackathon demo');
    return { success: true, message: 'SOS alert sent (simulated)' };
  }
};

export const getEmergencyContacts = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.get(API_URL.EMERGENCY_CONTACTS, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.log('Using mock contacts for hackathon demo');
    return [
      { id: '1', name: 'Mom', phone: '123-456-7890', relationship: 'Family' },
      { id: '2', name: 'Sister', phone: '987-654-3210', relationship: 'Family' },
      { id: '3', name: 'Best Friend', phone: '555-123-4567', relationship: 'Friend' },
    ];
  }
};
export const deleteEmergencyContact = async (contactId: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    await axios.delete(`${API_URL}/emergency/contacts/${contactId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return { success: true };
  } catch (error) {
    console.log('Using mock delete response for hackathon demo');
    return { success: true };
  }
};

const generateMockSafetyPoints = (latitude: number, longitude: number) => {
  const points = [];
  
  for (let i = 0; i < 50; i++) {
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    const weight = Math.random() * 100;
    
    points.push({
      latitude: latitude + latOffset,
      longitude: longitude + lngOffset,
      weight: weight,
    });
  }
  
  return points;
};
const generateMockRoute = (startLat: number, startLng: number, endLat: number, endLng: number) => {
  const points = [];
  points.push({ latitude: startLat, longitude: startLng });
  
  for (let i = 1; i <= 5; i++) {
    const ratio = i / 6;
    const lat = startLat + (endLat - startLat) * ratio;
    const lng = startLng + (endLng - startLng) * ratio;
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
    
    points.push({ 
      latitude: lat + latOffset, 
      longitude: lng + lngOffset 
    });
  }
  
  points.push({ latitude: endLat, longitude: endLng });
  
  return {
    route: points,
    distance: calculateDistance(startLat, startLng, endLat, endLng),
    duration: Math.floor(calculateDistance(startLat, startLng, endLat, endLng) * 12)  
  };
};


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180);
};