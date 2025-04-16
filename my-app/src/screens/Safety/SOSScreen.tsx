import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { sendSOSAlert } from '../../services/safety';

export default function SOSScreen({ navigation }) {
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const countdownInterval = useRef(null);

  useEffect(() => {
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          sendAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  const sendAlert = async () => {
    if (location) {
      try {
        await sendSOSAlert({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date().toISOString()
        });
        setAlertSent(true);
      } catch (error) {
        setAlertSent(true);
        console.error('Failed to send alert:', error);
      }
    } else {
      setTimeout(sendAlert, 1000);
    }
  };

  const cancelAlert = () => {
    clearInterval(countdownInterval.current);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency SOS</Text>
      
      {countdown > 0 ? (
        <>
          <Text style={styles.countdownText}>
            Sending alert in {countdown} seconds
          </Text>
          <Text style={styles.description}>
            Your location will be shared with your emergency contacts
          </Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={cancelAlert}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.alertSentText}>
            Alert sent to your emergency contacts
          </Text>
          <Text style={styles.description}>
            Your live location is being shared
          </Text>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => Alert.alert("Calling Emergency Services", "This would call emergency services in a real app.")}
          >
            <Text style={styles.callButtonText}>Call Emergency Services</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.cancelButtonText}>End Alert</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  alertSentText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  callButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  callButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});