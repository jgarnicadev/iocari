import React from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput, Subheading } from 'react-native-paper';

class LoginPage extends React.Component {
  state = {
    email: '',
    password: '',
  };

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          try {
            let data = JSON.parse(value);
            //validate accessToken is valid
            fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/logIn',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token: data.token, 
                user: {
                  email: data.email
                }
              })
            })
            .then((response) => response.json())
            .then((response) => {
              if (response.result == 'OK') {
                this.props.navigation.navigate('home');  
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
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/logIn',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email: this.state.email,
          password: this.state.password
        }
      })
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
                />
              <TextInput  label="Contraseña" style={styles.input}
                underlineColor="#4db6ac"
                dense={true}
                secureTextEntry={true}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
              />
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