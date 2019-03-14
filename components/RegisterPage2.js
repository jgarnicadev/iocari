import React from 'react';
import { StyleSheet, View, Image, TextInput, Button, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

class RegisterPage2 extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.texto}>Sólo tu país y ciudad serán visibles en tu perfil.</Text>
        <TextInput  placeholder="Nombre" style={styles.input}/>
        <TextInput  placeholder="Apellido" style={styles.input}/>
        <TextInput  placeholder="Fecha de nacimiento" style={styles.input}/>
        <TextInput  placeholder="Dirección" style={styles.input}/>
        <TextInput  placeholder="Ciudad" style={styles.input}/>
        <TextInput  placeholder="CP" style={styles.input}/>
        <View style={styles.btnWrapper}>
            <Button title="Atrás" color="#1e253d" onPress={() => this.props.navigation.goBack()} />
            <Button title="¡Listo!" color="#f50057" onPress={() => this.props.navigation.navigate('home')} />
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
        flexDirection:'row',
        justifyContent: 'space-between',
      },
    texto: {
      color:'white',
      fontStyle: 'italic',
    },
});  

export default withNavigation(RegisterPage2);