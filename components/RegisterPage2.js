import React from 'react';
import { StyleSheet, View, Image, Text, Alert, ScrollView, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';

class RegisterPage2 extends React.Component {
  state = {
    op: 'register',
    nombre_player: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
  };

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        const { navigation } = this.props;
        this.setState({
          nombre_player: navigation.getParam('nombre_player', ''),
          email: navigation.getParam('email', ''),
          password: navigation.getParam('password', '')
        });
      }
    );
  }

  async guardarAccessToken(token) {
    await AsyncStorage.setItem('accessToken', token);
  }

  submit() {
    if (
      !this.state.nombre ||
      !this.state.apellido ||
      !this.state.fecha_nacimiento ||
      !this.state.direccion ||
      !this.state.ciudad ||
      !this.state.codigo_postal
    ) {
      Alert.alert(
        'Debes rellenar todos los campos'
      );
      return;
    }
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
      console.log(response);
      if (response.result) {
        this.guardarAccessToken(response.token);
        this.props.navigation.navigate('home');  
      } else {
        Alert.alert(
          'No se ha podido registrar el usuario, intentela de nuevo'
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <LinearGradient 
        colors={['#1d253d','#0b7e8a']} style={styles.container}>
        <ScrollView style={styles.containerWrap}>
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
              value={this.state.fecha_nacimiento}
              theme={{ colors: {primary: '#4db6ac', placeholder: '#4db6ac'} }}
              onTouchStart={this.openCalendar.bind(this)}
              editable={false}
              />
        <DatePicker
          style={{width: 0, height: 0}}
          showIcon={false}
          ref="datepicker"
          date={this.state.fecha_nacimiento}
          mode="date"
          format="DD/MM/YYYY"
          onDateChange={this.fechaSelect.bind(this)}
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
            <Button style={[styles.button, styles.twoCols]} mode="outlined" color="white" theme={{ dark: true, colors: {primary: 'white'} }} onPress={() => this.props.navigation.navigate('register')}>Atrás</Button>
            <Button style={[styles.button, styles.twoCols]} mode="contained" dark="true" color="#f50057" onPress={this.submit.bind(this)}>¡Listo!</Button>
        </View>
        </ScrollView>
      </LinearGradient>
    )
  }

  openCalendar() {
    this.refs.datepicker.onPressDate()
  }
  fechaSelect(fecha) {
    this.setState({fecha_nacimiento: fecha});
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
      backgroundColor: '#1e253d',
    },
    containerWrap: {
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
    btnWrapper: {
        marginTop:20,
        marginBottom:10,
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