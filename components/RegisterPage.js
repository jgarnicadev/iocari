import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Button, TextInput } from 'react-native-paper';

class RegisterPage extends React.Component {
  state = {
    nombre: '',
    email: '',
    password: '',
    password_repeat: '',
  };

  render() {
    return (
      <LinearGradient 
        colors={['#1d253d','#0b7e8a']} style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TextInput 
              label="Nombre de Player" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({nombre: text})}
              value={this.state.nombre}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="E-mail" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.email}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="Contraseña" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="Repetir contraseña" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({password_repeat: text})}
              value={this.state.password_repeat}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <View style={styles.btnWrapper}>
            <Button style={styles.button} mode="contained" dark="true" color="#f50057" onPress={() => this.props.navigation.navigate('register2')}>Siguiente</Button>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
      backgroundColor: '#1e253d',
      paddingHorizontal:40,
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
    btnWrapper: {
        marginTop:30,
    },
    button: {
        paddingVertical:10,
    },
  });  

export default withNavigation(RegisterPage);