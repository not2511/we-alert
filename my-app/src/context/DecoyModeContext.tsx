import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DecoyModeContext = createContext({
  decoyModeActive: false,
  toggleDecoyMode: () => {},
  exitDecoyMode: () => {},
});

export const DecoyModeProvider = ({ children }) => {
  const [decoyModeActive, setDecoyModeActive] = useState(false);

  // Check saved decoy mode setting on mount
  useEffect(() => {
    const checkDecoyMode = async () => {
      const savedMode = await AsyncStorage.getItem('decoyModeActive');
      if (savedMode === 'true') {
        setDecoyModeActive(true);
      }
    };
    
    checkDecoyMode();
  }, []);

  // Save setting when changed
  useEffect(() => {
    const saveDecoyMode = async () => {
      await AsyncStorage.setItem('decoyModeActive', decoyModeActive.toString());
    };
    
    saveDecoyMode();
  }, [decoyModeActive]);

  const toggleDecoyMode = () => {
    setDecoyModeActive(prev => !prev);
  };

  const exitDecoyMode = () => {
    setDecoyModeActive(false);
  };

  return (
    <DecoyModeContext.Provider value={{ 
      decoyModeActive, 
      toggleDecoyMode,
      exitDecoyMode
    }}>
      {children}
    </DecoyModeContext.Provider>
  );
};