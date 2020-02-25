import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator, createAppContainer } from "react-navigation";

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
import HeaderMenu from './HeaderMenu';

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
        <HeaderMenu />
        <Menu />
      </View>
    )
  }
);

export default createAppContainer(AppNavigator);