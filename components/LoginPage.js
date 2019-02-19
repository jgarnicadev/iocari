import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

class LoginPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <TextInput  placeholder="E-mail" style={styles.input}/>
            <TextInput  placeholder="Contraseña" style={styles.input}/>
            <View style={styles.btnAcceder}>
              <Button title="Acceder" color="#f50057" onPress={() => this.props.navigation.navigate('home')}/>
            </View>
        </View>
        <View style={styles.footer}>
            <Text style={styles.textoFooter}>¿No tienes una cuenta?</Text>
            <Button title="Crea una cuenta ahora" onPress={() => this.props.navigation.navigate('register')}/>
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
    marginTop: 10,
    marginBottom: 10,
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
});

export default withNavigation(LoginPage);