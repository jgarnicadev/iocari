import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, AsyncStorage, Image, Alert, BackHandler } from 'react-native';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';

import CarruselPartidas from './CarruselPartidas';

class HomePage extends React.Component {
  state = {
    accessToken: {
      token: '',
      email: ''
    },
    mis_partidas: [],
    partidas_hoy: [],
  };

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.getAccessToken().then( value => {
          this.setState({'accessToken':JSON.parse(value)});
          this.cargarMisPartidas();
          this.cargarPartidasHoy();
        });
      }
    );
    this.props.navigation.addListener(
      'didBlur',
      payload => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
    );
  }

  handleBackPress = () => {
    BackHandler.exitApp();
  }  

  cargarMisPartidas() {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyBattles',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
          email: this.state.accessToken.email
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        console.log(response);
        this.setState({'mis_partidas':response.battles});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  cargarPartidasHoy() {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattles',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
          email: this.state.accessToken.email
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        this.setState({'partidas_hoy':response.battles});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  submitSearch() {
    Alert.alert(
      'En desarrollo...'
    );
    //TODO
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Header title="Home" hideBack={true} />
        <View style={styles.buscador}>
          <View style={styles.buscadorInputWrap}>
            <Image source={require('../assets/icon-search.png')} style={styles.buscadorIcon} />
            <TextInput style={styles.buscadorInput} placeholder="¿Qué estás buscando?" onSubmitEditing={this.submitSearch}/>
          </View>
        </View>
        <View style={styles.main}>
          <ScrollView style={styles.mainWrap}>
            <CarruselPartidas title="Mis Partidas" msgEmpty="No tienes partidas activas, crea una o busca partida para unirte!" partidas={this.state.mis_partidas} />
            <CarruselPartidas title="Hoy" msgEmpty="No se han encontrado partidas para hoy" partidas={this.state.partidas_hoy} />
          </ScrollView>
        </View>
        <Footer activo="home" />
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
  buscadorInputWrap: {
    backgroundColor:'white',
    flexDirection:'row',
    borderRadius:5,
  },
  buscadorIcon: {
    alignSelf:'center',
    marginLeft:15,
    marginRight:5,
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