import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, Image, Text, ImageBackground, Alert, ScrollView } from 'react-native';
import { Button, IconButton, Avatar } from 'react-native-paper';
import openMap from 'react-native-open-maps';

import Header from './Header';
import CarruselJuegos from './CarruselJuegos';

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
        method: 'POST',
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
          // response.games.forEach(juego => {
          //   juegos.push(juego.name);
          // });
          // response.battle.juegos = juegos.join(', ');
          response.battle.juegos = response.games;
          response.battle.jugadores = response.users;
          this.setState({'partida':response.battle});
          this.setState({'loading':false});
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
    getParteFecha = (strDate) => {
      let result = strDate.substring(0,10);
      let partes_fecha = result.split('-');
      return partes_fecha[2]+'/'+partes_fecha[1]+'/'+partes_fecha[0];
    }

    getParteHora = (strDate) => {
      let result = strDate.substring(11,16);
      return result;
    }
    getParteDuracion = (strDateIni, strDateEnd) => {
      let init_date = new Date(strDateIni);
      let end_date = new Date(strDateEnd);

      let date1_ms = init_date.getTime();
      let date2_ms = end_date.getTime();

      let difference_ms = date2_ms - date1_ms;
      difference_ms = difference_ms/1000;
      var seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60; 
      var minutes = Math.floor(difference_ms % 60);
      difference_ms = difference_ms/60; 
      var hours = Math.floor(difference_ms % 24);  
      var days = Math.floor(difference_ms/24);      

      return hours+'h';
    }

    render() {
        if (this.state.loading) {
          return (
            <View style={[styles.container,{justifyContent:'center'}]}><ActivityIndicator size="large" /></View>
          );
        }
        return (
            <View style={styles.container}>
              <Header title={this.state.partida.name} />
              <ScrollView>
              <ImageBackground style={styles.cabeceraPartida} source={{ uri: this.state.partida.image_url }} imageStyle={{ resizeMode: 'cover', opacity:0.3 }} >
                <Avatar.Image style={styles.avatarCreador} size={48} source={{ uri: this.state.partida.jugadores[0].photo_url }} />
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-fecha.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.getParteFecha(this.state.partida.init_date)}</Text>
                </View>
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-hora.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.getParteHora(this.state.partida.init_date)}</Text>
                </View>
                <View style={styles.cabeceraWarpTxt}>
                  <IconButton icon={require('../assets/ico-duracion.png')} color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.getParteDuracion(this.state.partida.init_date,this.state.partida.end_date)}</Text>
                </View>
                <View style={styles.txtJugadores}>
                  <IconButton icon="human-male-male" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={styles.txtBlanco}>{this.state.partida.current_players} / {this.state.partida.num_players}</Text>
                </View>
              </ImageBackground>
              <View style={styles.contenedor}>
                <View style={[styles.cabeceraWarpTxt, { marginBottom:10 }]}>
                  <IconButton icon="view-list" color="#7C7C7C" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                  <Text style={[styles.txtGris, styles.txtTitulo]}>Juegos para la sesión</Text>
                </View>
                {/* <Text style={styles.txtGris}>{this.state.partida.juegos}</Text> */}
                <CarruselJuegos title="" msgEmpty="" juegos={this.state.partida.juegos} />
              </View>
              <View style={[styles.contenedor, styles.bordeContenedor]}>
                <Text style={styles.txtGris}>{this.state.partida.description}</Text>
              </View>
              <View style={styles.contenedor}>
                <Text style={[styles.txtGris, styles.txtTitulo, { marginBottom:10 }]}>Personas apuntadas</Text>
                {this.state.partida.jugadores.map((elem) => 
                  // <Text style={styles.txtGris} key={elem.username}>{elem.username}</Text>
                  <Avatar.Image key={elem.username} style={styles.avatarJugador} size={40} source={{ uri: elem.photo_url }} />
                )}
              </View>
              <ImageBackground style={styles.contenedorLugar} source={require('../assets/mapa.jpg')} imageStyle={{ resizeMode: 'cover', opacity:0.3 }} >
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.address}</Text>
                  <IconButton icon="map-marker" color="white" size={20} style={styles.markerLugar}></IconButton>
                  <View style={{marginTop:15}}>
                    <Button onPress={this.abrirMapa} color="white" uppercase={true} style={{marginLeft:'auto' }} >Abrir mapa</Button>
                  </View>
              </ImageBackground>
              <View style={styles.contenedor}>
                  <Text style={[styles.txtGris, styles.txtTitulo, { marginBottom:10 }]}>Comentarios</Text>
              </View>
              <View style={styles.contenedor}>
                <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={this.apuntarse}>Apuntarse</Button>
              </View>
              </ScrollView>
            </View>
        );
    }

    apuntarse = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/joinBattle',{
        method: 'POST',
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
         Alert.alert('Solicitud enviada!');
        } else {
          Alert.alert('Error: Solicitud no procesada!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    abrirMapa = () => {
      openMap({query: this.state.partida.address});
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
    avatarCreador: {
      borderWidth:4,
      borderColor:'white',
      position:"absolute",
      right:20,
      bottom:60,
    },
    avatarJugador: {
      borderWidth:4,
      borderColor:'white',
    },
  });

export default Partida;

