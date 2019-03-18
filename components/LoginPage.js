import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Button, TextInput } from 'react-native-paper';

class LoginPage extends React.Component {
  state = {
    email: '',
    password: '',
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={['#1d253d','#0b7e8a']}
          style={styles.top}>
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
            />
            <View style={styles.btnAcceder}>
              <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={() => this.props.navigation.navigate('home')}>Acceder</Button>
            </View>
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
    paddingHorizontal:40,
    flex:7,
  },
  logo: {
    alignSelf:'center',
    marginTop:200,
    marginBottom:50,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding:10,
  },
  btnAcceder: {
    marginTop:30,
  },
  footer: {
    flex:1,
    backgroundColor: '#f3f3f3',
    alignItems: 'stretch',
    justifyContent:'center',
    paddingHorizontal:40,
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