import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OTPScreen = () => {
    const router = useRouter(); // Use Expo Router
    const params = useLocalSearchParams(); // Get params from URL
    const phoneNumber = params.phoneNumber as string; // Extract phone number
    
    const [otpCode, setOtpCode] = useState('');
    const [countdown, setCountdown] = useState(240); // 4 minutes
    const [isVerifying, setIsVerifying] = useState(false);
    const { verifyOTP, sendOTP } = useContext(AuthContext);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    try {
      const success = await verifyOTP(phoneNumber, otpCode);
      
      if (success) {
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
      setCountdown(240); // Reset countdown
      Alert.alert('Success', 'OTP sent again to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to {phoneNumber}
      </Text>
      
      <CustomInput
        value={otpCode}
        onChangeText={setOtpCode}
        placeholder="6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <CustomButton
        title="Verify OTP"
        onPress={handleVerifyOTP}
        loading={isVerifying}
      />
      
      {countdown > 0 ? (
        <Text style={styles.countdownText}>
          Resend OTP in {formatTime(countdown)}
        </Text>
      ) : (
        <CustomButton
          title="Resend OTP"
          onPress={handleResendOTP}
          type="secondary"
        />
      )}
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
  countdownText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});

export default OTPScreen;