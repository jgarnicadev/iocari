import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, AsyncStorage, Image, BackHandler, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Title, IconButton, Text} from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { Chevron } from 'react-native-shapes'
import DatePicker from 'react-native-datepicker';
import * as Location from 'expo-location';

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
    location: null,
    partidas_cerca: [],
    busquedaText: '',
    busquedaResultados: [],
    realizandoBusqueda: false
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
          // this.cargarPartidasCerca();
          this.getLocationAsync();
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

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      // location = {
      //   latitude:40.4161629,
      //   longitude:-3.6822606
      // }
      this.setState({ location }, this.cargarPartidasCerca);
    }
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
          email: this.state.accessToken.email,
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
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

  cargarPartidasCerca = () => {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getCloseBattles',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
          email: this.state.accessToken.email,
          location: {
            lat: this.state.location.coords.latitude,
            lng: this.state.location.coords.longitude,
          }
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        this.setState({'partidas_cerca':response.battles});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  submitSearch = (event) => {
    const busqueda = event.nativeEvent.text;
    this.setState({'busquedaText':busqueda});
    this.setState({'realizandoBusqueda':true})
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattles',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
          email: this.state.accessToken.email
        },
        filter: {
          keywords: busqueda
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        this.setState({'busquedaResultados':response.battles}, this.setState({'realizandoBusqueda':false}));
      } else {
        this.setState({'realizandoBusqueda':false})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fechaSelect = (fechasel) => {
    // this.setState({fecha: fechasel, fechaCalendar: fechasel});
    const busqueda = fechasel;
    const partes_fecha = fechasel.split('/');
    this.setState({'busquedaText':busqueda});
    this.setState({'realizandoBusqueda':true})
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattles',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: this.state.accessToken.token, 
        user: {
          email: this.state.accessToken.email
        },
        filter: {
          init_date: partes_fecha[2]+'-'+partes_fecha[1]+partes_fecha[0]+'T00:00:00.000Z'
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        this.setState({'busquedaResultados':response.battles}, this.setState({'realizandoBusqueda':false}));
      } else {
        this.setState({'realizandoBusqueda':false})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    let stylePicker = {
      inputAndroid: {
        paddingHorizontal:10,
        paddingVertical:2,
        fontSize:14,
        color:'white',
        fontWeight:'300',
        borderRadius: 4,
        backgroundColor: '#0277bd',
      },
      inputIOS: {
        paddingHorizontal:10,
        paddingVertical:2,
        fontSize:14,
        color:'white',
        fontWeight:'300',
        borderRadius: 4,
        backgroundColor: '#0277bd',
      },
      placeholder: {
        color:'white',
        fontSize:14,
        fontWeight:'300',
      },
      iconContainer: {
        top: 12,
        right: 15,
      },
    };
    return (
      <View style={styles.container}>
        <Header title="iOcari" hideBack={true} search = {true} searchCallback = {this.submitSearch} hideTitle = {true} onBattleLists = {true}/>
        <View style={styles.main}>
          <ScrollView>
            {this.state.busquedaText != '' &&
              this.state.realizandoBusqueda == true && <View style={[styles.container,styles.mainWrap,{justifyContent:'center', marginTop:20}]}><ActivityIndicator  /></View>
            }
            {this.state.busquedaText != '' && this.state.realizandoBusqueda == false && 
              <View style={{marginVertical:20}}>
                <CarruselPartidas title="Resultado de búsqueda" collapsed = {false} msgEmpty="Nos se han encontrado partidas" partidas={this.state.busquedaResultados} />
              </View>
            }
            <CarruselPartidas title="Partidas hoy" collapsed = {false} msgEmpty="No se han encontrado partidas para hoy" partidas={this.state.partidas_hoy} />
            <CarruselPartidas title="Mis Partidas" collapsed = {true} msgEmpty="No tienes partidas activas, crea una o busca partida para unirte!" partidas={this.state.mis_partidas} />            
          </ScrollView>
        </View>
        <Footer activo="home" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    paddingTop: "5%",
    // paddingVertical:20,
  },
  mainWrap: {
    paddingHorizontal:15,
    marginTop:20,
    marginBottom:10,
    flexDirection:'row'
  }
});

export default withNavigation(HomePage);