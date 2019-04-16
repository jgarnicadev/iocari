import React from 'react';
import { View, StyleSheet, ImageBackground, Image, ScrollView, AsyncStorage, ActivityIndicator, Text, TouchableHighlight, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';

import Header from './Header';

class Juego extends React.Component {
  state = {
    id_juego: 0,
    accessToken: '',
    juego: null,
    loading: true,
  }

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
      this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.setState({'loading':true});
          const { navigation } = this.props;
          this.getAccessToken().then( value => {
            this.setState({'accessToken':value});
            this.setState({'id_juego': navigation.getParam('id_juego', '')});
            this.loadJuego();
          });
        }
      );
  }

  loadJuego() {
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'getJuego', id: this.state.id_juego, accessToken:this.state.accessToken})
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({'juego':responseJson});
        this.setState({'loading':false});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View><ActivityIndicator /></View>
      );
    }
    return (
      <View style={styles.container}>
        <Header title={this.state.juego.nombre} />
        <View style={styles.container}>
          <ImageBackground style={styles.cabecera} source={{ uri: this.state.juego.image }} imageStyle={{ resizeMode: 'cover', opacity: 0.3 }} >
            <View style={{ flexDirection:'row', justifyContent: 'flex-end', marginTop:30, marginRight:20 }}>
              <View style={{ flexDirection:'row', alignItems:'center', marginRight:20 }}>
                <Image source={require('../assets/ico-jugadores-blanco.png')} style={{ width: 13, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.jugadores_min}-{this.state.juego.jugadores_max}</Text>
              </View>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Image source={require('../assets/ico-duracion-blanco.png')} style={{ width: 9, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.duraccion_min}-{this.state.juego.duraccion_max}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.main}>
            <ScrollView style={styles.mainWrap}>
              <View style={{ flexDirection:'row', justifyContent: 'space-between', marginTop:30}}>
                <TouchableHighlight onPress={this.enDesarrollo}>
                  <View style={{ borderWidth:2, borderColor:'#0277bd', borderRadius:5, flexDirection:'row', padding:15, alignItems:'center', width:150 }}>
                    <Image source={require('../assets/ico-btn-loquiero.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={{ color:'#0277bd' }}>¡Lo quiero!</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
                  <View style={{ borderWidth:2, borderColor:'#0277bd', borderRadius:5, flexDirection:'row', padding:15, alignItems:'center', width:150 }}>
                    <Image source={require('../assets/ico-btn-quierojugar.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={{ color:'#0277bd' }}>Quiero jugar</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
                  <View style={{ borderWidth:2, borderColor:'#0277bd', borderRadius:5, flexDirection:'row', padding:15, alignItems:'center', width:150 }}>
                    <Image source={require('../assets/ico-btn-anadir.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={{ color:'#0277bd' }}>Añadir</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
          <Image style={styles.imageJuego}  source={{ uri: this.state.juego.image }} />
          <IconButton
              size={100}
              icon={({ size }) => (
                <Image
                  source={require('../assets/btnCrearPartida.png')}
                  style={{ width: size, height: size }}
                />
              )}
              onPress={this.crearPartida}
              style={styles.btnCrearPartida}
            />
        </View>
      </View>
    );
  }

  crearPartida = () => {
    this.props.navigation.navigate('crearPartida')
  }

  enDesarrollo = () => {
    Alert.alert('En desarrollo...');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  main: {
    flex: 1,
    backgroundColor: '#f3f1f1',
    paddingVertical: 20,
  },
  mainWrap: {
    paddingHorizontal: 20,
  },
  cabecera: {
    backgroundColor:'#0277bd',
    height:150,
  },
  imageJuego: {
    width:150,
    height:150,
    position:'absolute',
    top:30,
    left:20,
  },
  btnCrearPartida: {
    width:100,
    height:100,
    position:'absolute',
    top:90,
    right:0,
  }
});

export default Juego;