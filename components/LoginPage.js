import React from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput, Subheading } from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

class LoginPage extends React.Component {
  state = {
    email: '',
    password: '',
    location: null,
  };

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      this.setState({ location });
    }
  }

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.getLocationAsync();
    Linking.addEventListener('url', data => {
      let { path, queryParams } = Linking.parse(data.url);
      switch(path) {
        case 'estanteria':
          this.props.navigation.navigate('estanteria', {
            id_usuario: queryParams.uid
          });  
          break;
        case 'partida':
          this.props.navigation.navigate('partida', {
            id_partida: queryParams.pid
          });  
          break;
        }
    });
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          try {
            let data = JSON.parse(value);
            let body = {
              token: data.token, 
              user: {
                email: data.email
              }
            };
            if (this.state.location != null) {
              body.location = {
                lat: this.state.location.coords.latitude,
                lng: this.state.location.coords.longitude
              };
            }
            let version = 'iOcari '+ Device.osName + ' app v' + Constants.nativeAppVersion;
            let device = Device.deviceName + ' ' + Device.osName + ' ' + Device.osVersion;
            body.origin = {
              device: device,
              version: version
            };
            //validate accessToken is valid
            fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/logIn',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((response) => {
              if (response.result == 'OK') {
                Linking.getInitialURL().then(url => {
                  let { path, queryParams } = Linking.parse(url);
                  if (path == "") {
                    this.props.navigation.navigate('home');  
                  } else {
                    switch(path) {
                      case 'estanteria':
                        this.props.navigation.navigate('estanteria', {
                          id_usuario: queryParams.uid
                        });  
                        break;
                      case 'partida':
                        this.props.navigation.navigate('partida', {
                          id_partida: queryParams.pid
                        });  
                        break;
                    }
                  }
                })
              }
            });
          } catch(e) {
            //accesstoken guardado no es json
          }
        });
      }
    );
  }


  async guardarAccessToken(token) {
    token = JSON.stringify(token);
    await AsyncStorage.setItem('accessToken', token);
  }

  login() {
    let body = {
      user: {
        email: this.state.email,
        password: this.state.password
      }
    };
    if (this.state.location != null) {
      body.location = {
        lat: this.state.location.coords.latitude,
        lng: this.state.location.coords.longitude
      };
    }
    let version = 'iOcari '+ Device.osName + ' app v' + Constants.nativeAppVersion;
    let device = Device.deviceName + ' ' + Device.osName + ' ' + Device.osVersion;
    body.origin = {
      device: device,
      version: version
    };
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/logIn',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        let data = {
          token: response.token,
          email: response.user.email,
          username: response.user.username,
        }
        this.guardarAccessToken(data);
        this.props.navigation.navigate('home');  
      } else {
        Alert.alert(
          'Login incorrecto'
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <LinearGradient style={styles.container} colors={['#1d253d','#0b7e8a']}>
            <ScrollView style={styles.hPad}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <TextInput 
                label="E-mail" style={styles.input}
                underlineColor="#4db6ac"
                dense={true}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                style={{
                  paddingLeft:35,
                }}
                />
              <Image source={require('../assets/baseline_email_black_18dp.png')} style={{
                marginTop:-35,
                marginLeft:10,
                marginBottom:35,
                width:25,
                height:25
              }} />
              <TextInput
                label="Contraseña" style={styles.input}
                underlineColor="#4db6ac"
                dense={true}
                secureTextEntry={true}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                style={{
                  paddingLeft:35,
                }}
              />
              <Image source={require('../assets/baseline_lock_black_18dp.png')} style={{
                marginTop:-35,
                marginLeft:10,
                marginBottom:30,
                width:25,
                height:25
              }} />
              <Button style={[styles.button, styles.btnAcceder]} mode="contained" dark="true" color="#f50057" onPress={this.login.bind(this)}>Acceder</Button>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
        <View style={[styles.footer, styles.hPad]}>
            <Subheading style={styles.textoFooter}>¿No tienes una cuenta?</Subheading>
            <Button style={[styles.button, styles.btnRegistro]} mode="contained" dark="true" color="#0277bd" onPress={() => this.props.navigation.navigate('register')}>Crea una cuenta ahora</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  hPad: {
    paddingHorizontal:20,
  },
  logo: {
    alignSelf:'center',
    marginTop:60,
    marginBottom:50,
  },
  input: {
    marginVertical: 10,
  },
  btnAcceder: {
    marginTop:20,
    marginBottom:10,
  },
  footer: {
    backgroundColor: '#f3f3f3',
    paddingVertical:10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  textoFooter: {
    alignSelf:'center',
  },
  button: {
    paddingVertical:10,
  },
  btnRegistro: {
    marginVertical:10,
  }
});

export default withNavigation(LoginPage);