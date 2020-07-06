import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, Image, Text, ImageBackground, Alert, ScrollView } from 'react-native';
import { Button, IconButton, Avatar, Dialog, Portal, TextInput  } from 'react-native-paper';
import openMap from 'react-native-open-maps';
import { AirbnbRating } from 'react-native-ratings';

import Header from './Header';
import CarruselJuegos from './CarruselJuegos';
import { TouchableHighlight } from 'react-native-gesture-handler';

class Partida extends React.Component {
    state = {
      accessToken: {
        token: '',
        email: '',
        username: '',
      },
      id_partida: 0,
      partida: null,
      loading: true,
      comentarios: [],
      respuestas: [],
      apuntadoPartida: false,
      apuntadoPartidaRole: null,
      partidaTerminada: false,
      valoracionPartida: 0,
      valorarPartidaVisible: false,
      showPopupConfirmar: false,
      userPopupConfirmar: null,
      showPopupAbondonar: false,
      showPopupExpulsar: false,
      userPopupExpulsar: null,
      showPopupExpulsarConfirm: false,
    }

    async getAccessToken() {
      const data =  await AsyncStorage.getItem('accessToken');
      return data;
    }
  
    componentDidMount() {
        this.props.navigation.addListener(
          'didFocus',
          payload => {
            this.setState({
              'loading':true,
              'apuntadoPartida': false,
              'apuntadoPartidaRole': null,
              'showPopupConfirmar': false,
              'userPopupConfirmar': null,
              'showPopupAbondonar': false,
              'showPopupExpulsar': false,
              'userPopupExpulsar': null,
              'showPopupExpulsarConfirm': false,
            });
            const { navigation } = this.props;
            this.getAccessToken().then( value => {
              this.setState({'accessToken':JSON.parse(value)});
              this.setState({'id_partida': navigation.getParam('id_partida', '')});
              this.loadPartida();
              this.loadCommentsPartida();
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
          response.battle.juegos = response.games;
          response.battle.jugadores = response.users;
          let apuntado = false;
          let apuntado_role = null;
          let terminada = false;
          let end_date = new Date(response.battle.end_date);
          if (end_date.getTime() < Date.now()) {
            terminada = true;
          }
          response.users.forEach(elem => {
            if (elem.username == this.state.accessToken.username) {
              apuntado = true;
              apuntado_role = elem.battle_role;
            }
          });
          let mostrarValoracion = false;
          if (apuntado && (apuntado_role == 1 || apuntado_role == 2) && terminada && (response.battle.my_rating == null || response.battle.my_rating == 0)) {
            mostrarValoracion = true;
          }
          this.setState({
            'apuntadoPartida': apuntado,
            'apuntadoPartidaRole': apuntado_role,
            'partidaTerminada': terminada,
            'partida': response.battle,
            'loading': false,
            'valorarPartidaVisible': mostrarValoracion,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
    loadCommentsPartida() {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattleComments',{
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
          let comentarios = [];
          let respuestas = [];

          response.comments.forEach(comment => {
            if (comment.id_response_to == null) {
              comentarios.push(comment);
              respuestas[comment.id] = [];
            } else {
              respuestas[comment.id_response_to].push(comment);
            }
          });
          this.setState({
            'comentarios':comentarios,
            'respuestas':respuestas
          });
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

    verPerfil = (uid) => {
      this.props.navigation.navigate('perfil', {
        id_usuario: uid
      });
    }

    handleTapJugador = (user) => {
      //si no se es admin, mostrar simplemente perfil usuario
      if (this.state.apuntadoPartidaRole != 2) {
        this.verPerfil(user.id);
        return;
      }
      //si se es admin, proceso expulsar de partida
      //si jugador es admin no se le puede expulsar!
      if (user.battle_role == 2) {
        this.verPerfil(user.id);
        return;
      }
      //mostrar popup de expulsar
      this.setState({
        'showPopupExpulsar': true,
        'userPopupExpulsar': user
      });
    }

    showPopupConfirmarUsuario = (user) => {
      this.setState({
        'showPopupConfirmar': true,
        'userPopupConfirmar': user
      });
    }

    confirmarUsuario = (uid) => {
      this.setState({
        'loading':true,
        'showPopupConfirmar': false,
        'userPopupConfirmar': null
      });
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
          },
          join_user: {
            id: uid
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        this.loadPartida();
      })
      .catch((error) => {
        console.log(error);
      });
    }

    expulsarJugador = () => {
      let uid = this.state.userPopupExpulsar.id;
      this.setState({
        'loading':true,
        'showPopupExpulsar': false,
        'userPopupExpulsar': null,
        'showPopupExpulsarConfirm': false,
      });
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/unjoinBattle',{
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
          },
          unjoin_user: {
            id: uid
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        this.loadPartida();
      })
      .catch((error) => {
        console.log(error);
      });
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
                <View  style={styles.avatarCreador}>
                <TouchableHighlight onPress={() => this.verPerfil(this.state.partida.jugadores[0].id)}>
                  <Avatar.Image size={48} source={{ uri: this.state.partida.jugadores[0].photo_url  + '?' + new Date() }} style={{borderWidth:4,borderColor:'white'}} />
                </TouchableHighlight>
                </View>
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
                {this.state.partida.jugadores.map((elem) => {
                  if (elem.battle_role == 1 || elem.battle_role == 2) {
                    return (
                      <TouchableHighlight key={elem.username}  onPress={() => this.handleTapJugador(elem)}>
                        <Avatar.Image style={styles.avatarJugador} size={40} source={{ uri: elem.photo_url  + '?' + new Date() }} />
                      </TouchableHighlight>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
              {this.state.partidaTerminada == false && this.state.partida.private == 1 && this.state.apuntadoPartidaRole == 2 &&
                <View style={styles.contenedor}>
                  <Text style={[styles.txtGris, styles.txtTitulo, { marginBottom:10 }]}>Pendientes</Text>
                  {this.state.partida.jugadores.map((elem) => {
                    if (elem.battle_role == 0) {
                      return (
                        <TouchableHighlight key={elem.username}  onPress={() => this.showPopupConfirmarUsuario(elem)}>
                          <Avatar.Image style={styles.avatarJugador} size={40} source={{ uri: elem.photo_url  + '?' + new Date() }} />
                        </TouchableHighlight>
                      );
                    } else {
                      return null;
                    }
                  })}
                </View>
              }
              <ImageBackground style={styles.contenedorLugar} source={require('../assets/mapa.jpg')} imageStyle={{ resizeMode: 'cover', opacity:0.3 }} >
                  <Text style={[styles.txtBlanco, styles.txtCabecera]}>{this.state.partida.address}</Text>
                  <IconButton icon="map-marker" color="white" size={20} style={styles.markerLugar}></IconButton>
                  <View style={{marginTop:15}}>
                    <Button onPress={this.abrirMapa} color="white" uppercase={true} style={{marginLeft:'auto' }} >Abrir mapa</Button>
                  </View>
              </ImageBackground>
              {this.state.apuntadoPartida == true && 
                    (this.state.apuntadoPartidaRole == 1 || this.state.apuntadoPartidaRole == 2) && 
              (
                <View style={styles.contenedor}>
                  <View style={{
                    marginBottom:10,
                    flexDirection:'row',
                    justifyContent:'space-between',
                  }}>
                    <Text style={[styles.txtGris, styles.txtTitulo]}>Comentarios</Text>
                    <IconButton
                      icon="comment-processing"
                      color="#f50057"
                      size={20}
                      onPress={() => this.anadirComentario()}
                    />
                  </View>
                  {this.state.comentarios.map((elem) => (
                    <View style={[styles.contenedor,styles.contenedorComentario]} key={elem.id}>
                      <TouchableHighlight key={elem.username}  onPress={() => this.verPerfil(elem.id)}>
                        <Avatar.Image size={40} source={{ uri: elem.photo_url  + '?' + new Date() }} style={styles.avatarComentario} />
                      </TouchableHighlight>
                      <View style={styles.contenidoComentario}>
                        <Text style={styles.usernameComentario}>{elem.username}</Text>
                        <Text style={styles.fechaComentario}>{elem.timestamp}</Text>
                        <Text style={styles.textoComentario}>{elem.comment}</Text>
                        <Button style={styles.btnResponderComentario} color="#7C7C7C" onPress={() => this.responderComentario(elem.id)}>Responder</Button>
                        
                        {this.state.respuestas[elem.id].map((elem) => (
                          <View style={[styles.contenedor,styles.contenedorComentario]} key={elem.id}>
                            <TouchableHighlight key={elem.username}  onPress={() => this.verPerfil(elem.id)}>
                              <Avatar.Image size={40} source={{ uri: elem.photo_url  + '?' + new Date() }} style={styles.avatarComentario} />
                            </TouchableHighlight>
                            <View style={styles.contenidoComentario}>
                              <Text style={styles.usernameComentario}>{elem.username}</Text>
                              <Text style={styles.fechaComentario}>{elem.timestamp}</Text>
                              <Text style={styles.textoComentario}>{elem.comment}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {(this.state.partidaTerminada == false && this.state.apuntadoPartida == false) ? (
                <View style={styles.contenedor}>
                  <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={this.apuntarse}>Apuntarse</Button>
                </View>
              ) : null} 
              {(this.state.partidaTerminada == false && this.state.apuntadoPartida == true && this.state.apuntadoPartidaRole < 2 ) ? (
                <View style={styles.contenedor}>
                  <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={this.abandonar}>Abandonar</Button>
                </View>
              ) : null} 
              {this.state.partidaTerminada == false && this.state.apuntadoPartidaRole == 2 && (
                <View style={styles.contenedor}>
                  <Button style={[styles.button,{borderColor:'#f50057'}]} mode="outlined" dark="true" color="#f50057" onPress={this.cancelarPartida}>Cancelar partida</Button>
                </View>
              )}
              {(this.state.partidaTerminada && 
                this.state.apuntadoPartida && 
                (this.state.apuntadoPartidaRole == 1 || this.state.apuntadoPartidaRole == 2) &&
                (this.state.partida.my_rating == null || this.state.partida.my_rating == 0)) ? (
                <View style={styles.contenedor}>
                  <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={()=> this.setState({'valorarPartidaVisible': true})}>Valorar</Button>
                </View>
              ) : null} 
              </ScrollView>
              <Portal>
                <Dialog visible={this.state.newCommentVisible} onDismiss={()=> this.setState({'newCommentVisible': false})}>
                  <Dialog.Content>
                    <TextInput
                      label="Escribe un comentario" style={{backgroundColor:"#FBFBFB"}}
                      underlineColor="#7C7C7C"
                      selectionColor="#7C7C7C"
                      onChangeText={(text) => this.setState({'comentario_nuevo':text})}
                      theme={{ colors: {primary: '#7C7C7C', placeholder: '#7C7C7C'} }}
                      maxLength={144}
                      onSubmitEditing={this.newComment}
                    />
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.cancelarPartidaVisible} onDismiss={()=> this.setState({'cancelarPartidaVisible': false})}>
                  <Dialog.Content>
                    <Text style={[styles.txtGris,{
                      textAlign:'center',
                      fontSize:20
                    }]}>¿Seguro que deseas cancelar la partida?</Text>
                    <View style={[styles.contenedor,{flexDirection:'row',justifyContent:'space-between'}]}>
                      <Button style={[styles.button,{
                        flex:1,
                        marginRight:3,
                        borderColor:'#f50057',
                        fontSize:20
                      }]} mode="outlined" dark="true" color="#f50057" onPress={this.cancelarPartidaConfirm}>SÍ</Button>
                      <Button style={[styles.button,{
                        flex:1,
                        marginLeft:3,
                        fontSize:20
                      }]} mode="contained" dark="true" color="#f50057" onPress={()=> this.setState({'cancelarPartidaVisible': false})}>NO</Button>
                    </View>
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.valorarPartidaVisible} onDismiss={()=> this.setState({'valorarPartidaVisible': false})}>
                  <Dialog.Content>
                    <Text style={[styles.txtGris,{
                      textAlign:'center',
                      fontSize:24,
                      fontWeight:'bold',
                      marginBottom:25,
                      color:'black',
                    }]}>Valora tu partida</Text>
                    <Text style={[styles.txtGris,{
                      textAlign:'center',
                      fontSize:16,
                      paddingHorizontal:20,
                    }]}>¿Como ha ido todo? ¿Ha sido divertido? ¿Te has sentido cómoda/o con tu anfitrión? Ayuda a crear una cominidad sana.</Text>
                    <AirbnbRating
                      showRating={false}
                      selectedColor="#f50057"
                      defaultRating={this.state.partida.my_rating}
                      onFinishRating={(rating) => this.setState({'valoracionPartida':rating})}
                    />
                    <View style={[styles.contenedor,{flexDirection:'row',justifyContent:'space-between'}]}>
                      <Button style={[styles.button,{
                        flex:1,
                        marginRight:3,
                        borderColor:'#f50057',
                        fontSize:20
                      }]} mode="outlined" dark="true" color="#f50057" onPress={() => this.setState({'valorarPartidaVisible': false})}>Ahora no</Button>
                      <Button style={[styles.button,{
                        flex:1,
                        marginLeft:3,
                        fontSize:20
                      }]} mode="contained" dark="true" color="#f50057" onPress={this.valorarPartida}>Valora</Button>
                    </View>
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.showPopupConfirmar} onDismiss={()=> this.setState({'showPopupConfirmar':false})} style={{width:350, alignSelf:'center'}}>
                  <Dialog.Content>
                    {this.state.userPopupConfirmar != null &&
                      <View style={{
                          alignItems:'center',
                          width:300
                      }}>
                          <Text style={{
                              fontSize:16,
                              marginBottom:10
                          }}>{this.state.userPopupConfirmar.username}</Text>
                          <TouchableHighlight onPress={() => this.verPerfil(this.state.userPopupConfirmar.id)}>
                              <Avatar.Image size={100} source={{ uri: this.state.userPopupConfirmar.photo_url + '?' + new Date() }} />
                          </TouchableHighlight>
                          <View style={{
                              flexDirection:'row',
                              justifyContent:'space-evenly',
                              marginTop:30,
                              alignSelf:'stretch'
                          }}>
                              <TouchableHighlight onPress={() => this.setState({'showPopupConfirmar':false})}>
                                  <View style={[styles.btn, styles.btnInactive]}>
                                      <Text style={styles.txtBtnInactive}>Ahora no</Text>
                                  </View>
                              </TouchableHighlight>
                              <TouchableHighlight onPress={() => this.confirmarUsuario(this.state.userPopupConfirmar.id)}>
                                  <View style={[styles.btn, styles.btnActive]}>
                                      <Text style={styles.txtBtnActive}>Añadir</Text>
                                  </View>
                              </TouchableHighlight>
                          </View>
                      </View>
                    }
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.showPopupAbondonar} onDismiss={()=> this.setState({'showPopupAbondonar':false})} style={{width:350, alignSelf:'center'}}>
                  <Dialog.Content>
                    <View style={{
                        alignItems:'center',
                        width:300
                    }}>
                        <Text style={{
                            fontSize:16,
                        }}>¿Realmente deseas abandonar la partida?</Text>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-evenly',
                            marginTop:30,
                            alignSelf:'stretch'
                        }}>
                            <TouchableHighlight onPress={() => this.setState({'showPopupAbondonar':false})}>
                                <View style={[styles.btn, styles.btnInactive]}>
                                    <Text style={styles.txtBtnInactive}>Ahora no</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={this.abandonarConfirm}>
                                <View style={[styles.btn, styles.btnActive]}>
                                    <Text style={styles.txtBtnActive}>Abandonar</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.showPopupExpulsar} onDismiss={()=> this.setState({'showPopupExpulsar':false})} style={{width:350, alignSelf:'center'}}>
                  <Dialog.Content>
                    {this.state.userPopupExpulsar != null &&
                      <View style={{
                          alignItems:'center',
                          width:300
                      }}>
                          <Text style={{
                              fontSize:16,
                              marginBottom:10
                          }}>{this.state.userPopupExpulsar.username}</Text>
                          <TouchableHighlight onPress={() => this.verPerfil(this.state.userPopupExpulsar.id)}>
                              <Avatar.Image size={100} source={{ uri: this.state.userPopupExpulsar.photo_url + '?' + new Date() }} />
                          </TouchableHighlight>
                          <View style={{
                              flexDirection:'row',
                              justifyContent:'space-evenly',
                              marginTop:30,
                              alignSelf:'stretch'
                          }}>
                              <TouchableHighlight onPress={() => this.setState({'showPopupExpulsar':false})}>
                                  <View style={[styles.btn, styles.btnInactive]}>
                                      <Text style={styles.txtBtnInactive}>Ahora no</Text>
                                  </View>
                              </TouchableHighlight>
                              <TouchableHighlight onPress={() => this.setState({'showPopupExpulsarConfirm':true})}>
                                  <View style={[styles.btn, styles.btnActive]}>
                                      <Text style={styles.txtBtnActive}>Expulsar</Text>
                                  </View>
                              </TouchableHighlight>
                          </View>
                      </View>
                    }
                  </Dialog.Content>
                </Dialog>
                <Dialog visible={this.state.showPopupExpulsarConfirm} onDismiss={()=> this.setState({'showPopupExpulsarConfirm':false})} style={{width:350, alignSelf:'center'}}>
                  <Dialog.Content>
                    {this.state.userPopupExpulsar != null &&
                      <View style={{
                          alignItems:'center',
                          width:300
                      }}>
                          <Text style={{
                              fontSize:16,
                              marginBottom:10
                          }}>¿Está seguro de expulsar al jugador?</Text>
                          <View style={{
                              flexDirection:'row',
                              justifyContent:'space-evenly',
                              marginTop:30,
                              alignSelf:'stretch'
                          }}>
                              <TouchableHighlight onPress={() => this.setState({'showPopupExpulsarConfirm':false})}>
                                  <View style={[styles.btn, styles.btnInactive]}>
                                      <Text style={styles.txtBtnInactive}>Cancelar</Text>
                                  </View>
                              </TouchableHighlight>
                              <TouchableHighlight onPress={() => this.expulsarJugador()}>
                                  <View style={[styles.btn, styles.btnActive]}>
                                      <Text style={styles.txtBtnActive}>Confirmar</Text>
                                  </View>
                              </TouchableHighlight>
                          </View>
                      </View>
                    }
                  </Dialog.Content>
                </Dialog>
              </Portal>
            </View>
        );
    }

    valorarPartida = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/rateBattle',{
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
            my_rating: this.state.valoracionPartida
          },
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
        }
        this.setState({'valorarPartidaVisible': false});
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
    anadirComentario = () => {
      if (this.state.apuntadoPartida == false)  {
        Alert.alert('Debes unirte a la partida para poder comentar!');
        return;
      }
      this.setState({
        'idComentarioRespuesta':null,
        'newCommentVisible': true
      })
    }

    responderComentario = (idComment) => {
      if (this.state.apuntadoPartida == false)  {
        Alert.alert('Debes unirte a la partida para poder comentar!');
        return;
      }
      this.setState({
        'idComentarioRespuesta':idComment,
        'newCommentVisible': true
      })
    }

    newComment = () => {
      let dataComment = {
        string: this.state.comentario_nuevo
      };
      if (this.state.idComentarioRespuesta != null) {
        dataComment.id_response_to = this.state.idComentarioRespuesta;
      }
      // let test = JSON.stringify({
      //   token: this.state.accessToken.token, 
      //   user: {
      //       email: this.state.accessToken.email
      //   },
      //   battle: {
      //     id: this.state.id_partida, 
      //   },
      //   comment: dataComment
      // });
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/newBattleComment',{
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
          },
          comment: dataComment
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
         this.loadCommentsPartida();
         this.setState({'newCommentVisible': false});
         Alert.alert('Comentario enviado!');
        } else if (response.result == 'NOT_ALLOWED') {
          this.setState({'newCommentVisible': false});
          Alert.alert('Debes unirte a la partida para poder comentar!');
         } else {
          Alert.alert('Error: Comentario no procesado!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          this.setState({'apuntadoPartida': true});
          Alert.alert('Solicitud enviada!');
        } else {
          Alert.alert('Error: Solicitud no procesada!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    abandonar = () => {
      this.setState({'showPopupAbondonar':true})
    }
    abandonarConfirm = () => {
      this.setState({
        'loading':true,
        'showPopupAbondonar': false
      });
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/unjoinBattle',{
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
        this.loadPartida();
      })
      .catch((error) => {
        console.log(error);
      });
    }

    abrirMapa = () => {
      openMap({query: this.state.partida.address});
    }

    cancelarPartida = () => {
      this.setState({
        'cancelarPartidaVisible': true
      })
    }

    cancelarPartidaConfirm = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/cancelBattle',{
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
          Alert.alert('Partida cancelada!');
        } else {
          Alert.alert('Error: Solicitud no procesada!');
        }
        this.setState({
          'cancelarPartidaVisible': false
        })
      })
      .catch((error) => {
        console.log(error);
      });
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
      position:"absolute",
      right:20,
      bottom:60,
      width:56,
      height:56,
    },
    avatarJugador: {
      borderWidth:4,
      borderColor:'white',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor:'#f50057',
    },
    contenedorComentario: {
      flexDirection:"row",
      justifyContent:"flex-start"
    },
    avatarComentario: {
      width:40
    },
    contenidoComentario: {
      flex:1,
      paddingLeft:10,
    },
    usernameComentario: {
      fontSize:12,
      fontWeight:'500',
      color:'#474747',
      marginBottom:6,
    },
    fechaComentario: {
      fontSize:10,
      color:'#CCCCCC',
      marginBottom:3,
    },
    textoComentario: {
      padding:10,
      backgroundColor:'#C6E8F7',
      borderRadius:4,
    },
    btnResponderComentario: {
      fontWeight:'500',
      alignSelf:'flex-start',
      textTransform:'none',
      padding:0,
    },
    btn: {
      borderWidth:2,
      borderColor:'#ef5865',
      borderRadius:5,
      flexDirection:'row',
      paddingVertical:15,
      paddingHorizontal:0,
      alignItems:'center',
      justifyContent:'center',
      width:125,
      // flex:1,
    },
    btnInactive: {
        backgroundColor:'transparent',
    },
    btnActive: {
        backgroundColor:'#ef5865',
    },
    txtBtnActive: {
        fontSize:12,
        color:'white',
    },
    txtBtnInactive: {
        fontSize:12,
        color:'#ef5865',
    },
  });

export default Partida;

