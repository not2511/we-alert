import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const SOSButton = () => {
  const navigation = useNavigation();
  const [pressing, setPressing] = React.useState(false);
  const timerRef = React.useRef(null);
  
  const handlePressIn = () => {
    setPressing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    timerRef.current = setTimeout(() => {
      // Trigger SOS after holding for 3 seconds
      setPressing(false);
      navigation.navigate('SOSScreen');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3000);
  };
  
  const handlePressOut = () => {
    setPressing(false);
    clearTimeout(timerRef.current);
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, pressing && styles.pressing]}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>SOS</Text>
      {pressing && <View style={styles.progressIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pressing: {
    backgroundColor: '#8B0000',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressIndicator: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: 'white',
    bottom: 0,
  }
});

export default SOSButton;