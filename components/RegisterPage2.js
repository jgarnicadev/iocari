import React from 'react';
import { StyleSheet, View, Image, Alert, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput, Text } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';

class RegisterPage2 extends React.Component {
  state = {
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
    token = JSON.stringify(token);
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
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/signUp',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email: this.state.email,
          username: this.state.nombre_player,
          password: this.state.password,
          name: this.state.nombre,
          last_name: this.state.apellido,
          born_date: this.state.fecha_nacimiento,
          address: this.state.direccion,
          city: this.state.ciudad,
          postal_code: this.state.codigo_postal
        }
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
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
          }
        })
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
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <LinearGradient  style={styles.container} colors={['#1d253d','#0b7e8a']}>
          <ScrollView style={styles.hPad}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.texto}>Sólo tu país y ciudad serán visibles en tu perfil.</Text>
            <TextInput 
                  label="Nombre" style={styles.input}
                  underlineColor="#4db6ac"
                  dense={true}
                  onChangeText={(text) => this.setState({nombre: text})}
                  value={this.state.nombre}
                  />
            <TextInput 
                  label="Apellido" style={styles.input}
                  underlineColor="#4db6ac"
                  dense={true}
                  onChangeText={(text) => this.setState({apellido: text})}
                  value={this.state.apellido}
                  />
            <TextInput 
                  label="Fecha de nacimiento" style={styles.input}
                  underlineColor="#4db6ac"
                  dense={true}
                  value={this.state.fecha_nacimiento}
                  onTouchStart={this.openCalendar}
                  // editable={false}
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
                  dense={true}
                  onChangeText={(text) => this.setState({direccion: text})}
                  value={this.state.direccion}
                  />
            <View style={styles.twoColsWarp}>
              <TextInput 
                    label="Ciudad" style={[styles.input, styles.twoCols]}
                    underlineColor="#4db6ac"
                    dense={true}
                    onChangeText={(text) => this.setState({ciudad: text})}
                    value={this.state.ciudad}
                    />
              <TextInput 
                    label="Código Postal" style={[styles.input, styles.twoCols]}
                    underlineColor="#4db6ac"
                    dense={true}
                    onChangeText={(text) => this.setState({codigo_postal: text})}
                    value={this.state.codigo_postal}
                    />
              </View>
            <View style={[styles.btnWrapper, styles.twoColsWarp]}>
                <Button style={[styles.button, styles.twoCols]} mode="outlined" color="white" theme={{ dark: true, colors: {primary: 'white'} }} onPress={() => this.props.navigation.navigate('register')}>Atrás</Button>
                <Button style={[styles.button, styles.twoCols]} mode="contained" dark="true" color="#f50057" onPress={this.submit.bind(this)}>¡Listo!</Button>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    )
  }

  openCalendar = () => {
    this.refs.datepicker.onPressDate();
  }
  fechaSelect(fecha) {
    this.setState({fecha_nacimiento: fecha});
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