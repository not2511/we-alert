import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  type = 'primary',
}) => {
  const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = type === 'primary' ? styles.primaryText : styles.secondaryText;
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        buttonStyle,
        (disabled || loading) ? styles.disabledButton : null
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' ? '#fff' : '#1e88e5'} 
          size="small"
        />
      ) : (
        <Text style={[
          styles.text, 
          textStyle, 
          disabled ? styles.disabledText : null
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#1e88e5',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1e88e5',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    borderColor: '#bbbbbb',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1e88e5',
  },
  disabledText: {
    color: '#999999',
  },
});

export default CustomButton;