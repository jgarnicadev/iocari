import React from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput } from 'react-native-paper';

class RegisterPage extends React.Component {
  state = {
    nombre: '',
    email: '',
    password: '',
    password_repeat: '',
  };

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
        this.props.navigation.navigate('register2', {
          nombre_player: this.state.nombre,
          email: this.state.email,
          password: this.state.password
        });
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
        marginTop:60,
        marginBottom:50,
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
  });  

export default withNavigation(RegisterPage);