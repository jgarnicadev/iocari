import React from 'react';
import { View, StyleSheet, ImageBackground, Image, ScrollView, AsyncStorage, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';

import Header from './Header';
import CarruselJuegos from './CarruselJuegos';
import CarruselPartidas from './CarruselPartidas';

class Juego extends React.Component {
  state = {
    accessToken: {
      token: '',
      email: ''
    },
    id_juego: 0,
    juego: null,
    loading: true,
    loQuiero: false,
    quieroJugar: false,
    enBiblioteca: false,
    textShown: false,
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
            this.setState({'id_juego': navigation.getParam('id_juego', '')});
            this.loadJuego();
          });
        }
      );
  }

  toggleNumberOfLines  = () => { //To toggle the show text or hide it
    this.setState({'textShown':!this.state.textShown});
  }

  loadJuego() {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGame',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
            email: this.state.accessToken.email
        },
        game: {
          id: this.state.id_juego, 
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        response.game.mecanicas = response.mechanics ? response.mechanics : [];
        response.game.categorias = response.categories ? response.categories : [];
        response.game.designers = response.designers ? response.designers : [];
        response.game.publishers = response.publishers ? response.publishers : [];
        response.game.artists = response.artists ? response.artists : [];
        response.game.expansiones = response.expansions ? response.expansions : [];
        response.game.partidas = response.battles ? response.battles : [];
        response.game.premios = response.awards ? response.awards : [];
        this.setState({'juego':response.game});
        let quieroJugar = (response.game.owned == 1);
        let loQuiero = (response.game.owned == 2);
        let enBiblioteca = (response.game.owned >= 3);
        this.setState({'loQuiero':loQuiero});
        this.setState({'quieroJugar':quieroJugar});
        this.setState({'enBiblioteca':enBiblioteca});
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
        <View style={[styles.container,{justifyContent:'center'}]}><ActivityIndicator size="large" /></View>
      );
    }

    return (
      <View style={styles.container}>
        <Header title={this.state.juego.name} />
        <View style={styles.container}>
          <ImageBackground style={styles.cabecera} source={{ uri: this.state.juego.image_url }} imageStyle={{ resizeMode: 'cover', opacity: 0.3 }} >
            <View style={{ flexDirection:'row', justifyContent: 'flex-end', marginTop:30, marginRight:20 }}>
              <View style={{ flexDirection:'row', alignItems:'center', marginRight:20 }}>
                <Image source={require('../assets/ico-jugadores-blanco.png')} style={{ width: 13, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.min_players}-{this.state.juego.max_players}</Text>
              </View>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Image source={require('../assets/ico-duracion-blanco.png')} style={{ width: 9, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.playing_time}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.main}>
            <ScrollView style={styles.mainWrap}>
              <View style={{ flexDirection:'row', justifyContent: 'space-between', marginTop:30}}>
                <TouchableOpacity onPress={this.loQuiero}>
                  <View style={this.state.loQuiero ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-loquiero.png')} style={{ width: 20, height: 20, margin:0,  marginRight:5 }}/>
                    <Text style={this.state.loQuiero ? styles.txtBtnActive : styles.txtBtnInactive}>¡Lo quiero!</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.quieroJugar}>
                  <View style={this.state.quieroJugar ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-quierojugar.png')} style={{ width: 20, height: 20, margin:0,  marginRight:5 }}/>
                    <Text style={this.state.quieroJugar ? styles.txtBtnActive : styles.txtBtnInactive}>Quiero jugar</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.enBiblioteca}>
                  <View style={this.state.enBiblioteca ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-anadir.png')} style={{ width: 20, height: 20, margin:0,  marginRight:5 }}/>
                    <Text style={this.state.enBiblioteca ? styles.txtBtnActive : styles.txtBtnInactive}>Añadir</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* <Text style={styles.descripcion}>{this.state.juego.description}</Text> */}
              <Text style={styles.descripcion} numberOfLines={this.state.textShown ? undefined : 3}>{this.state.juego.description}</Text>
              <Text onPress={this.toggleNumberOfLines} style={{ marginTop: 3 }}>{this.state.textShown ? 'Menos...' : 'Más...'}</Text>
              <View style={styles.creditos}>
                  {this.state.juego.designers.length > 0 &&
                  <View style={styles.credito}>
                    <Text style={styles.creditoTitle}>Diseñador/es</Text>
                    {this.state.juego.designers.map((elem) => 
                      <Text key={elem.id} style={styles.creditoValue}>{elem.name}</Text>
                    )}
                    </View>
                  }
                  {this.state.juego.artists.length > 0 &&
                  <View style={styles.credito}>
                    <Text style={styles.creditoTitle}>Arte</Text>
                    {this.state.juego.artists.map((elem) => 
                      <Text key={elem.id} style={styles.creditoValue}>{elem.name}</Text>
                    )}
                    </View>
                  }
                  {this.state.juego.publishers.length > 0 &&
                  <View style={styles.credito}>
                    <Text style={styles.creditoTitle}>Editor/es</Text>
                    {this.state.juego.publishers.map((elem) => 
                      <Text key={elem.id} style={styles.creditoValue}>{elem.name}</Text>
                    )}
                    </View>
                  }
              </View>
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Mecánicas</Text>
                <View style={styles.seccionDataContainer}>
                {this.state.juego.mecanicas.map((mecanica) => 
                  <Text key={mecanica.id} style={styles.seccionData}>{mecanica.name}</Text>
                )}
                </View>
              </View>
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Categorías</Text>
                <View style={styles.seccionDataContainer}>
                {this.state.juego.categorias.map((categoria) => 
                  <Text key={categoria.id} style={styles.seccionData}>{categoria.name}</Text>
                )}
                </View>
              </View>
              <CarruselJuegos title="Expansiones" msgEmpty="Este juego no tiene expansiones" juegos={this.state.juego.expansiones} />
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Premios</Text>
                <View style={styles.seccionDataContainer}>
                {this.state.juego.premios.map((premio) => 
                  <Text key={premio.id} style={styles.seccionData}>{premio.year} - {premio.title}</Text>
                )}
                </View>
              </View>
              <CarruselPartidas title="Partidas abiertas" msgEmpty="No hay partidas actualmente para este juego" partidas={this.state.juego.partidas} />
            </ScrollView>
          </View>
          <Image style={styles.imageJuego}  source={{ uri: this.state.juego.image_url }} />
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
    this.props.navigation.navigate('crearPartida', {
      desde_juego: {key: this.state.id_juego, nombre: this.state.juego.name}
    })
  }

  enDesarrollo = () => {
    Alert.alert('En desarrollo...');
  }

  loQuiero = () => {
    // this.enDesarrollo(); return;
    if (this.state.loQuiero) return;
    this.setState({
      'loQuiero':1,
      'quieroJugar':0,
      'enBiblioteca':0
    });
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/wishGame',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
            email: this.state.accessToken.email
        },
        game: {
          id: this.state.id_juego, 
        }
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  quieroJugar = () => {
    // this.enDesarrollo(); return;
    if (this.state.quieroJugar) return;
    this.setState({
      'loQuiero':0,
      'quieroJugar':1,
      'enBiblioteca':0
    });
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/wantPlayGame',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
            email: this.state.accessToken.email
        },
        game: {
          id: this.state.id_juego, 
        }
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  enBiblioteca = () => {
    // this.enDesarrollo(); return;
    if (this.state.enBiblioteca) return;
    this.setState({
      'loQuiero':0,
      'quieroJugar':0,
      'enBiblioteca':1
    });
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/gotGame',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
            email: this.state.accessToken.email
        },
        game: {
          id: this.state.id_juego, 
        }
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
  , 
  btn: {
    borderWidth:2,
    borderColor:'#0277bd',
    borderRadius:5,
    flexDirection:'row',
    paddingVertical:15,
    paddingHorizontal:0,
    alignItems:'center',
    justifyContent:'center',
    width:100,
  },
  btnInactive: {
    backgroundColor:'transparent',
  },
  btnActive: {
    backgroundColor:'#0277bd',
  },
  txtBtnActive: {
    fontSize:11,
    color:'white',
  },
  txtBtnInactive: {
    fontSize:11,
    color:'#0277bd',
  },
  descripcion: {
    marginTop:30,
  },
  creditos: {
    marginTop:30,
  },
  credito: {
    marginBottom:5,
  },
  creditoTitle: {
    fontSize:14,
  },
  creditoValue: {
    fontSize:12,
  },
  seccion: {
    marginTop:20,
  },
  seccionTitle: {
    fontSize:18,
    marginBottom:7,
  },
  seccionDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  seccionData: {
    fontSize:12,
    width:'50%',
    marginBottom:5,
  },
});

export default Juego;