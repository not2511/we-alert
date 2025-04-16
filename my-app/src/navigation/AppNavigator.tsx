// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { ActivityIndicator, View } from 'react-native';
// import { AuthContext } from '../context/AuthContext';
// import AuthNavigator from './AuthNavigator';
// import MainNavigator from './MainNavigator';

// const AppNavigator = () => {
//   const { isAuthenticated, isLoading } = useContext(AuthContext);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;