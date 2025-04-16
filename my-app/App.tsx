import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { SafetyProvider } from './src/context/SafetyContext';
import { DecoyModeProvider } from './src/context/DecoyModeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafetyProvider>
          <DecoyModeProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </DecoyModeProvider>
        </SafetyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}