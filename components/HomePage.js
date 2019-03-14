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
          <TextInput style={styles.buscadorInput} placeholder="¿Qué estás buscando?"/>
        </View>
        <View style={styles.main}>
          <CarruselPartidas title="Mis Partidas" msgEmpty="No tienes partidas activas, crea una o busca partida para unirte!"/>
        </View>
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
    backgroundColor:'#03a9f4',
    padding:10,
  },
  buscadorInput: {
    backgroundColor:'white',
    padding:10,
    fontSize:15,
    borderRadius:5,
  },
  main: {
    flex:1,
    paddingVertical:20,
    paddingHorizontal:15,
    backgroundColor:'#f3f1f1',
  },
});

export default withNavigation(HomePage);