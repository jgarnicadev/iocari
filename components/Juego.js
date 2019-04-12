import React from 'react';
import { View, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';

import Header from './Header';

class Juego extends React.Component {
  state = {
    juego:
    {
      id: 1,
      image: 'http://www.afcserviciosweb.com/iocari-images/alchemists.png',
      nombre: 'Alchemists',
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={this.state.juego.nombre} />
        <View style={styles.container}>
          <ImageBackground style={styles.cabecera} source={{ uri: this.state.juego.image }} imageStyle={{ resizeMode: 'cover', opacity: 0.3 }} >
          </ImageBackground>
          <View style={styles.main}>
            <ScrollView style={styles.mainWrap}>
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
    paddingHorizontal: 15,
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