import React from 'react';
import { StyleSheet, View, Image, Text, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Button, TextInput } from 'react-native-paper';

class RegisterPage2 extends React.Component {
  state = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    direccion: '',
    pais: '',
    ciudad: '',
    codigo_postal: '',
  };

  submit() {
    Alert.alert(
      'En desarrollo...'
    );
    //TODO
  }

  render() {
    return (
      <LinearGradient 
        colors={['#1d253d','#0b7e8a']} style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.texto}>Sólo tu país y ciudad serán visibles en tu perfil.</Text>
        <TextInput 
              label="Nombre" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({nombre: text})}
              value={this.state.nombre}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="Apellido" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({apellido: text})}
              value={this.state.apellido}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="Fecha de nacimiento" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({fecha_nacimiento: text})}
              value={this.state.fecha_nacimiento}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <TextInput 
              label="Dirección" style={styles.input}
              underlineColor="#4db6ac"
              selectionColor="#4db6ac"
              onChangeText={(text) => this.setState({direccion: text})}
              value={this.state.direccion}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              />
        <View style={styles.twoColsWarp}>
          <TextInput 
                label="Ciudad" style={[styles.input, styles.twoCols]}
                underlineColor="#4db6ac"
                selectionColor="#4db6ac"
                onChangeText={(text) => this.setState({ciudad: text})}
                value={this.state.ciudad}
                theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
                />
          <TextInput 
                label="Código Postal" style={[styles.input, styles.twoCols]}
                underlineColor="#4db6ac"
                selectionColor="#4db6ac"
                onChangeText={(text) => this.setState({codigo_postal: text})}
                value={this.state.codigo_postal}
                theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
                />
          </View>
        <View style={[styles.btnWrapper, styles.twoColsWarp]}>
            <Button style={[styles.button, styles.twoCols]} mode="outlined" color="white" theme={{ dark: true, colors: {primary: 'white'} }} onPress={() => this.props.navigation.goBack()}>Atrás</Button>
            <Button style={[styles.button, styles.twoCols]} mode="contained" dark="true" color="#f50057" onPress={this.submit.bind(this)}>¡Listo!</Button>
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
    texto: {
      color:'white',
      fontStyle: 'italic',
    },
    button: {
      paddingVertical:10,
    },
    twoColsWarp: {
      flexDirection:'row',
      justifyContent: 'space-between',
    },
    twoCols: {
      flex:0.48,
    },
});  

export default withNavigation(RegisterPage2);