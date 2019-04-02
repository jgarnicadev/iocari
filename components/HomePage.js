import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';

import CarruselPartidas from './CarruselPartidas';

class HomePage extends React.Component {
  state = {
    mis_partidas: [],
  };

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.cargarMisPartidas();
      }
    );
  }

  cargarMisPartidas() {
    this.getAccessToken().then( response => console.log(response) );
    fetch('http://www.afcserviciosweb.com/iocari-api.php')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({'mis_partidas':responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Header title="Home" />
        <View style={styles.buscador}>
          <TextInput style={styles.buscadorInput} placeholder="¿Qué estás buscando?"/>
        </View>
        <View style={styles.main}>
          <ScrollView style={styles.mainWrap}>
          <CarruselPartidas title="Mis Partidas" msgEmpty="No tienes partidas activas, crea una o busca partida para unirte!" partidas={this.state.mis_partidas} />
          </ScrollView>
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
    backgroundColor:'#f3f1f1',
    paddingVertical:20,
  },
  mainWrap: {
    paddingHorizontal:15,

  }
});

export default withNavigation(HomePage);