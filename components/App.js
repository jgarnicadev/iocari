import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from 'react-navigation-stack';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import RegisterPage2 from './RegisterPage2';
import RegisterCompany from './RegisterCompany';
import HomePage from './HomePage';
import CrearPartidaPage from './CrearPartidaPage';
import Partida from './Partida';
import Biblioteca from './Biblioteca';
import Juego from './Juego';
import Perfil from './Perfil';
import Mapa from './Mapa';
import Menu from './Menu';
import HeaderMenu from './HeaderMenu';
import Estanteria from './Estanteria';
import MisPartidas from './MisPartidas';
import Amigos from './Amigos';
import InvitarAmigos from './InvitarAmigos';
import Onboarding from './Onboarding';

const StackNavigator = createStackNavigator(
  {
    login: LoginPage,
    register: RegisterPage,
    register2: RegisterPage2,
    registerCompany: RegisterCompany,
    home: HomePage,
    crearPartida: CrearPartidaPage,
    partida: Partida,
    biblioteca: Biblioteca,
    juego: Juego,
    perfil: Perfil,
    mapa: Mapa,
    estanteria: Estanteria,
    misPartidas: MisPartidas,
    amigos: Amigos,
    invitarAmigos: InvitarAmigos,
    onboarding: Onboarding,
  },
  {
    initialRouteName: "login",
    headerMode: "none",
  }
);

const AppNavigator = createDrawerNavigator(
  {
    Home: StackNavigator,
  },
  {
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