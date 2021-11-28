import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, AsyncStorage , Image, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import MapView, {Marker, Callout} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { IconButton, Avatar } from 'react-native-paper';

import Header from './Header';

class Mapa extends React.Component {
  state = {
    accessToken: {
      token: '',
      email: ''
    },
    location: null,
    partidas_cerca: [],
  };

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          this.setState({'accessToken':JSON.parse(value)}, this.getLocationAsync);
        });
      }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Partidas disponibles" />
        <MapView style={styles.container}
          ref={ref => { this.map = ref } }
          initialRegion={{
            latitude: (this.state.location == null ? 42.5927244 : this.state.location.coords.latitude),
            longitude: (this.state.location == null ? -5.5640962 : this.state.location.coords.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={this.setZoomMapa}
          showsUserLocation={true}
        >
          {this.state.partidas_cerca.map(partida => {
            const init_date = new Date(partida.init_date.substr(0,19));
            const strDate = init_date.getDate().toString().padStart(2, '0')+'/'+(init_date.getMonth()+1).toString().padStart(2, '0')+'/'+init_date.getFullYear()+' '+init_date.getHours().toString().padStart(2, '0')+':'+init_date.getMinutes().toString().padStart(2, '0');
            return <Marker
              key={partida.id}
              coordinate={{
                latitude: partida.location.lat,
                longitude: partida.location.lng
              }}
              title={partida.name}
              description={partida.description}
            >
              <Callout style={{
                padding:0,
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onPress={() => this.showPartida(partida.id)}
              >
                <View style={{width:190}}>
                  <WebView
                    source={{
                      html: `<style>*{margin:0;padding:0;}</style><img src="${partida.image_url}" style="width: 190; height: 150;"/>`,
                    }}
                    style={{
                      padding: 0,
                      margin: 0,
                      width: 190,
                      height: 150
                    }}
                  />
                  {/* <Text><Image style={{ height:150, width:190 }} source={{ uri: partida.image_url }}  resizeMode="cover" /></Text> */}
                  <Text>{partida.name}</Text>
                  <Text>{strDate}</Text>
                  <View style={styles.txtJugadores}>
                    <IconButton icon="human-male-female" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
                    <Text style={{ color: 'white' }}>{partida.current_players} / {partida.num_players}</Text>
                  </View>
                  {/* {this.state.datosUser != null && <Avatar.Image size={35} source={{ uri: this.state.datosUser.photo_url  + '?' + new Date() }} style={styles.avatarUser} />} */}
                </View>
              </Callout>
            </Marker>
          })}
        </MapView>
      </View>
    );
  }

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      this.setState({ location }, this.cargarPartidasCerca);
    }
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
        this.setState({'partidas_cerca':response.battles}, this.setZoomMapa);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  setZoomMapa = () => {
    this.map.fitToElements(true);
  }

  showPartida = (idPartida) => {
    this.props.navigation.navigate('partida', {
      id_partida: idPartida
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCard: {
    margin:0,
    width:190,
    padding:0,
  },
  cover: {
    height:150,
  },
  txtJugadores: {
    position:"absolute",
    left:10,
    top:115,
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    flexDirection:'row',
    alignItems:'center',
  },
  avatarUser: {
    position:"absolute",
    left:10,
    top:10,
  }
});

export default withNavigation(Mapa);