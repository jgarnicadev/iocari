import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import RegisterPage2 from './RegisterPage2';
import HomePage from './HomePage';
import CrearPartidaPage from './CrearPartidaPage';
import Partida from './Partida';

// class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <LoginPage></LoginPage>        
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems:'stretch',
//     justifyContent: 'center',
//   },
// });

const AppNavigator = createStackNavigator(
  {
    login: LoginPage,
    register: RegisterPage,
    register2: RegisterPage2,
    home: HomePage,
    crearPartida: CrearPartidaPage,
    partida: Partida,
  },
  {
    initialRouteName: "login",
    headerMode:'none'
  }
);

export default createAppContainer(AppNavigator);