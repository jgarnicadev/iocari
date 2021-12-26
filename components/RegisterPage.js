import React from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput } from 'react-native-paper';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

class RegisterPage extends React.Component {
  state = {
    nombre: '',
    email: '',
    password: '',
    password_repeat: '',
    location: null,
  };

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      this.setState({ location });
    }
  }

  componentDidMount() {
    this.getLocationAsync();
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async guardarAccessToken(token) {
    token = JSON.stringify(token);
    await AsyncStorage.setItem('accessToken', token);
  }

  async submit() {
    if (
      !this.state.nombre ||
      !this.state.email ||
      !this.state.password ||
      !this.state.password_repeat
    ) {
      Alert.alert(
        'Debes rellenar todos los campos'
      );
      return;
    }
    if (!this.validateEmail(this.state.email)) {
      Alert.alert(
        'El email no tiene un formato correcto'
      );
      return;
    }
    if (this.state.password != this.state.password_repeat) {
      Alert.alert(
        'Contraseña y Repetir Contraseña deben ser iguales'
      );
      return;
    }
    /*
    let response = await fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'checkUsernameExists',nombre: this.state.nombre})
    })
    let data = await response.json();
    if (!data.result) {
      Alert.alert(
        'Nombre Player ya cogido'
      );
      return
    }
    response = await fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'checkEmailExists',nombre: this.state.email})
    })
    data = await response.json();
    if (!data.result) {
      Alert.alert(
        'Ya existe otro usuario con ese email'
      );
      return
    }
    */
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/signUp',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email: this.state.email,
          username: this.state.nombre,
          password: this.state.password
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
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
            this.props.navigation.navigate('onboarding');  
          }
        })
      } else {
        Alert.alert(
          'Usuario ya existente, introduzca otros datos'
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
                    label="Nombre de Player" style={styles.input}
                    underlineColor="#4db6ac"
                    dense={true}
                    onChangeText={(text) => this.setState({nombre: text})}
                    value={this.state.nombre}
                    />
              <TextInput 
                    label="E-mail" style={styles.input}
                    underlineColor="#4db6ac"
                    dense={true}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    />
              <TextInput 
                    label="Contraseña" style={styles.input}
                    underlineColor="#4db6ac"
                    dense={true}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    />
              <TextInput 
                    label="Repetir contraseña" style={styles.input}
                    underlineColor="#4db6ac"
                    dense={true}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password_repeat: text})}
                    value={this.state.password_repeat}
                    />
              <Button style={[styles.button,styles.btnWrapper]} mode="contained" dark="true" color="#f50057" onPress={this.submit.bind(this)}>Siguiente</Button>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
        <View style={[styles.footer, styles.hPad]}>
          <Button style={[styles.button, styles.btnRegistro]} mode="contained" dark="true" color="#0277bd" onPress={() => this.props.navigation.navigate('login')}>¿Ya tienes una cuenta?</Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    hPad: {
      paddingHorizontal:20,
    },
    logo: {
        alignSelf:'center',
        marginTop:25,
        marginBottom:0,
    },
    input: {
      marginVertical: 10,
    },
    btnWrapper: {
        marginTop:20,
        marginBottom:10,
    },
    button: {
        paddingVertical:10,
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

export default withNavigation(RegisterPage);