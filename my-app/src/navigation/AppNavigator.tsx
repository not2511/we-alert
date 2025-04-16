import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import DecoyNavigator from './DecoyNavigator';
import { useAuth } from '../hooks/useAuth';
import { useDecoyMode } from '../hooks/useDecoyMode';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const { decoyModeActive } = useDecoyMode();
  
  return (
    <Stack.Navigator headerMode="none">
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : decoyModeActive ? (
        <Stack.Screen name="Decoy" component={DecoyNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
}