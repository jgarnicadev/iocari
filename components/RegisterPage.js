import React from 'react';
import { StyleSheet, View, Image, TextInput, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

class RegisterPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TextInput  placeholder="Nombre de Player" style={styles.input}/>
        <TextInput  placeholder="E-mail" style={styles.input}/>
        <TextInput  placeholder="Contraseña" style={styles.input}/>
        <TextInput  placeholder="Repetir contraseña" style={styles.input}/>
        <View style={styles.btnWrapper}>
            <Button title="Siguiente" color="#f50057" onPress={() => this.props.navigation.navigate('register2')} />
        </View>
      </View>
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
        marginTop: 10,
        marginBottom: 10,
        padding:10,
    },
    btnWrapper: {
        marginTop:30,
      },
});  

export default withNavigation(RegisterPage);