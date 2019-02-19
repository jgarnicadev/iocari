import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';

import CarruselPartidas from './CarruselPartidas';

class HomePage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Home" />
        <View style={styles.buscador}>
          <TextInput placeholder="¿Qué estás buscando?"/>
        </View>
        <CarruselPartidas title="Mis Partidas" msgEmpty="No tienes partidas activas, crea una o busca partida para unirte!"/>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent:'flex-start',
  },
  buscador: {
    
  },
});

export default withNavigation(HomePage);