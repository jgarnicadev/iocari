import React from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Button, TextInput } from 'react-native-paper';

class LoginPage extends React.Component {
  state = {
    op:'login',
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
          //validate accessToken is valid
          fetch('http://www.afcserviciosweb.com/iocari-api.php',{
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({op:'validateAccessToken', accessToken:value})
          })
          .then((response) => response.json())
          .then((response) => {
            if (response.result) {
              this.props.navigation.navigate('home');  
            }
          });
        });
      }
    );
  }

  async guardarAccessToken(token) {
    await AsyncStorage.setItem('accessToken', token);
  }

  login() {
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result) {
        this.guardarAccessToken(response.token);
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
        <LinearGradient 
          colors={['#1d253d','#0b7e8a']}
          style={styles.top}>
          <ScrollView style={styles.topWrap}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <TextInput 
              label="E-mail" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.email}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
            <TextInput  label="Contraseña" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              secureTextEntry={true}
            />
            <View style={styles.btnAcceder}>
              <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={this.login.bind(this)}>Acceder</Button>
            </View>
            </ScrollView>
        </LinearGradient>
        <View style={styles.footer}>
            <Text style={styles.textoFooter}>¿No tienes una cuenta?</Text>
            <Button style={styles.button} mode="contained" dark="true" color="#0277bd" onPress={() => this.props.navigation.navigate('register')}>Crea una cuenta ahora</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent:'flex-start',
  },
  top: {
    backgroundColor: '#1e253d',
    alignItems: 'stretch',
    justifyContent:'flex-start',
    flex:7,
  },
  topWrap: {
    paddingHorizontal:40,
  },
  logo: {
    alignSelf:'center',
    marginTop:'15%',
    marginBottom:50,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding:10,
  },
  btnAcceder: {
    marginTop:20,
    marginBottom:10,
  },
  footer: {
    flex:1,
    backgroundColor: '#f3f3f3',
    alignItems: 'stretch',
    justifyContent:'center',
    paddingHorizontal:40,
    paddingVertical:20,
  },
  textoFooter: {
    alignSelf:'center',
    marginBottom:10,
    fontSize:20,
  },
  button: {
    paddingVertical:10,
  },
});

export default withNavigation(LoginPage);