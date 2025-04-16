import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDecoyMode } from '../../hooks/useDecoyMode';
import { useState } from 'react';
// Fake utility app (calculator for example)
export default function DecoyAppScreen() {
  const { exitDecoyMode } = useDecoyMode();
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetInput, setResetInput] = useState(true);
  
  // Secret gesture to exit decoy mode - triple tap on result
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const handleSecretTap = () => {
    const now = new Date().getTime();
    
    if (now - lastTapTime < 500) {
      setSecretTapCount(prev => prev + 1);
    } else {
      setSecretTapCount(1);
    }
    
    setLastTapTime(now);
    
    if (secretTapCount === 2) {
      // Triple tap detected
      exitDecoyMode();
      setSecretTapCount(0);
    }
  };

  const handleNumberPress = (num) => {
    if (resetInput) {
      setDisplayValue(num);
      setResetInput(false);
    } else {
      setDisplayValue(displayValue === '0' ? num : displayValue + num);
    }
  };

  const handleOperationPress = (op) => {
    setPreviousValue(parseFloat(displayValue));
    setOperation(op);
    setResetInput(true);
  };

  const handleCalculate = () => {
    if (!previousValue || !operation) return;
    
    const current = parseFloat(displayValue);
    let result;
    
    switch(operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '*':
        result = previousValue * current;
        break;
      case '/':
        result = previousValue / current;
        break;
      default:
        return;
    }
    
    setDisplayValue(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setResetInput(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setResetInput(true);
  };

  const calculatorButtons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', 'C', '=', '+']
  ];

  const renderButton = (button) => {
    const isOperation = ['+', '-', '*', '/', '=', 'C'].includes(button);
    
    const handlePress = () => {
      if (button === 'C') {
        handleClear();
      } else if (button === '=') {
        handleCalculate();
      } else if (isOperation) {
        handleOperationPress(button);
      } else {
        handleNumberPress(button);
      }
    };
    
    return (
      <TouchableOpacity
        style={[styles.button, isOperation && styles.operationButton]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, isOperation && styles.operationText]}>
          {button}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Calculator</Text>
      
      <TouchableOpacity 
        style={styles.display}
        onPress={handleSecretTap}
        activeOpacity={1}
      >
        <Text style={styles.displayText}>{displayValue}</Text>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        {calculatorButtons.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((button) => (
              <View key={button} style={styles.buttonWrapper}>
                {renderButton(button)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  display: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 36,
    fontWeight: '500',
  },
  buttonContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    padding: 5,
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  operationText: {
    color: 'white',
  }
});