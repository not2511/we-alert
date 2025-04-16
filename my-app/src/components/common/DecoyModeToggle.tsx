import React from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';
import { useDecoyMode } from '../../hooks/useDecoyMode';

const DecoyModeToggle = () => {
  const { decoyModeActive, toggleDecoyMode } = useDecoyMode();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Decoy Mode</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={decoyModeActive ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleDecoyMode}
        value={decoyModeActive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default DecoyModeToggle;