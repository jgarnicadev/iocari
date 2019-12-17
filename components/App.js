import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import { Text, Caption} from 'react-native-paper';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import RegisterPage2 from './RegisterPage2';
import HomePage from './HomePage';
import CrearPartidaPage from './CrearPartidaPage';
import Partida from './Partida';
import Biblioteca from './Biblioteca';
import Juego from './Juego';
import Perfil from './Perfil';
import Menu from './Menu';

const AppNavigator = createDrawerNavigator(
  {
    login: LoginPage,
    register: RegisterPage,
    register2: RegisterPage2,
    home: HomePage,
    crearPartida: CrearPartidaPage,
    partida: Partida,
    biblioteca: Biblioteca,
    juego: Juego,
    perfil: Perfil,
  },
  {
    initialRouteName: "login",
    drawerBackgroundColor: '#004c8b',
    contentComponent: props => (
      <View>
        <View style={styles.header}>
          <Image source={require('../assets/miniavatar-user.png')} style={styles.avatar} />
          <Text style={[styles.textWhite,styles.nombreUsuario]}>Sideshow Bob</Text>
          <Caption style={[styles.textWhite,styles.sloganUsuario]}>App Pioneer</Caption>
        </View>
        <Menu />
      </View>
    )
  }
);

const styles = StyleSheet.create({
  header: {
    paddingTop:40,
    paddingBottom:5,
    paddingHorizontal:10,
    backgroundColor:'#03a9f4',
  },
  textWhite: {
    color:'white',
  },
  avatar: {
    width:50,
    height:50,
  },
  nombreUsuario: {
    paddingTop:6,
  },
  sloganUsuario: {

  }
});

export default createAppContainer(AppNavigator);