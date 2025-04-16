import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useRouter } from 'expo-router';

const LoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useContext(AuthContext);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const success = await sendOTP(formattedNumber);
      
      if (success) {
        router.push({
            pathname: '/otp',
            params: { phoneNumber: formattedNumber }
          });
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to We Alert</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>
      
      <CustomInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number (with country code)"
        keyboardType="phone-pad"
      />
      
      <CustomButton
        title="Send OTP"
        onPress={handleSendOTP}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
});

export default LoginScreen;