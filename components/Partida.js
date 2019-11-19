import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, Image, Text, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

import Header from './Header';

class Partida extends React.Component {
    state = {
      accessToken: {
        token: '',
        email: ''
      },
      id_partida: 0,
      partida: null,
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
              this.setState({'accessToken':JSON.parse(value)});
              this.setState({'id_partida': navigation.getParam('id_partida', '')});
              this.loadPartida();
            });
          }
        );
    }

    loadPartida() {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattle',{
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
              email: this.state.accessToken.email
          },
          battle: {
            id: this.state.id_partida, 
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
          let juegos = [];
          response.games.forEach(juego => {
            juegos.push(juego.name);
          });
          response.battle.juegos = juegos.join(', ');
          response.battle.jugadores = response.users;
          this.setState({'partida':response.battle});
          this.setState({'loading':false});
        }
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
              <Header title={this.state.partida.name} />
              <ImageBackground style={styles.cabeceraPartida} source={{ uri: this.state.partida.image_url }} imageStyle={{ resizeMode: 'cover', opacity:0.3 }} >
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-fecha.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.init_date}</Text>
                </View>
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-hora.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.init_date}</Text>
                </View>
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-duracion.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.end_date}</Text>
                </View>
                <View style={styles.txtJugadores}>
                  <IconButton icon="wc" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={styles.txtBlanco}>{this.state.partida.current_players} / {this.state.partida.num_players}</Text>
                </View>
              </ImageBackground>
              <View style={styles.contenedor}>
                <View style={[styles.cabeceraWarpTxt, { marginBottom:10 }]}>
                  <IconButton icon="view-list" color="#7C7C7C" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtGris, styles.txtTitulo]}>Juegos para la sesión</Text>
                </View>
                <Text style={styles.txtGris}>{this.state.partida.juegos}</Text>
              </View>
              <View style={[styles.contenedor, styles.bordeContenedor]}>
                <Text style={styles.txtGris}>{this.state.partida.description}</Text>
              </View>
              <View style={styles.contenedor}>
                <Text style={[styles.txtGris, styles.txtTitulo, { marginBottom:10 }]}>Personas apuntadas</Text>
                {this.state.partida.jugadores.map((elem) => 
                  <Text style={styles.txtGris} key={elem.username}>{elem.username}</Text>
                )}
              </View>
              <ImageBackground style={styles.contenedorLugar} source={require('../assets/mapa.jpg')} imageStyle={{ resizeMode: 'cover', opacity:0.3 }} >
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.address}</Text>
                  <IconButton icon="place" color="white" size={20} style={styles.markerLugar}></IconButton>
              </ImageBackground>
              <View style={styles.contenedor}>
                  <Text style={[styles.txtGris, styles.txtTitulo, { marginBottom:10 }]}>Comentarios</Text>
              </View>
              <View style={[styles.contenedor, { display:'none'}]}>
                <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={this.apuntarse.bind(this)}>Apuntarse</Button>
              </View>
            </View>
        );
    }

    apuntarse() {

    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
      backgroundColor:'#f3f1f1',
    },
    cabeceraPartida: {
      backgroundColor:'#0277bd',
      paddingHorizontal:20,
      paddingBottom:10,
      paddingTop:40,
    },
    txtBlanco: {
      color: 'white',
    },
    txtJugadores: {
      position:"absolute",
      right:20,
      bottom:10,
      backgroundColor:"rgba(0, 0, 0, 0.5)",
      flexDirection:'row',
      alignItems:'center',
      paddingRight:10,
    },
    txtCabecera: {
      paddingVertical:10,
      paddingLeft:5,
    },
    contenedor: {
      paddingVertical:20,
      paddingHorizontal:20,
    },
    button: {
      paddingVertical:10,
    },
    txtGris: {
      color:'#7C7C7C',
    },
    txtTitulo: {
      fontSize:15,
    },
    bordeContenedor: {
      borderWidth: 1,
      borderColor: '#7C7C7C',
    },
    contenedorLugar: {
      backgroundColor:'#0277bd',
      paddingHorizontal:20,
      paddingBottom:10,
      paddingTop:10,
    },
    cabeceraWarpTxt: {
      flexDirection:'row',
      alignItems:'center',
    },
    markerLugar: {
      margin:0,
      padding:0,
      position:'absolute',
      top:10,
      right:20,
    },
  });

export default Partida;

