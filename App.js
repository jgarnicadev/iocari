import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import RegisterPage2 from './components/RegisterPage2';
import HomePage from './components/HomePage';
import CrearPartidaPage from './components/CrearPartidaPage';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginPage></LoginPage>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'stretch',
    justifyContent: 'center',
  },
});

const AppNavigator = createStackNavigator(
  {
    login: App,
    register: RegisterPage,
    register2: RegisterPage2,
    home: HomePage,
    crearPartida: CrearPartidaPage
  },
  {
    initialRouteName: "login",
    headerMode:'none'
  }
);

export default createAppContainer(AppNavigator);