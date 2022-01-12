import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert  } from 'react-native';
import { withNavigation } from 'react-navigation';
import { IconButton, Text } from 'react-native-paper';

class Footer extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.footer}>
            <TouchableOpacity onPress={this.home} style={styles.boton}>
                <IconButton icon="home" color={this.props.activo!='home'?'#bbb':'black'} style={styles.buttonIcon}></IconButton>
                <Text style={this.props.activo!='home'?{color:'#bbb'}:{color:'black'}} style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={this.biblioteca} style={styles.boton}>
                <IconButton icon="view-list" color={this.props.activo!='biblioteca'?'#bbb':'black'} style={styles.buttonIcon}></IconButton>
                <Text style={this.props.activo!='biblioteca'?{color:'#bbb'}:{color:'black'}} style={styles.buttonText}>Biblioteca</Text>
            </TouchableOpacity >
            <View style={styles.middle}></View>
            <TouchableOpacity onPress={this.perfil} style={styles.boton}>
                <IconButton icon="account" color={this.props.activo!='perfil'?'#bbb':'black'} style={styles.buttonIcon}></IconButton>
                <Text style={this.props.activo!='perfil'?{color:'#bbb'}:{color:'black'}} style={styles.buttonText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.alertas} style={styles.boton}>
                <IconButton icon="bell" color={this.props.activo!='alertas'?'#bbb':'black'} style={styles.buttonIcon}></IconButton>
                <Text style={this.props.activo!='alertas'?{color:'#bbb'}:{color:'black'}} style={styles.buttonText}>Alertas</Text>
            </TouchableOpacity>
          </View>
          <IconButton
            style={styles.btnCrearPartida}
            size={80}
            icon={({ size }) => (
              <Image
                source={require('../assets/btnCrearPartida.png')}
                style={{ width: size, height: size }}
              />
            )}
            onPress={this.crearPartida}
          />
        </View>
    );
  }

  crearPartida = () => {
    this.props.navigation.navigate('crearPartida')
  }

  home = () => {
    this.props.navigation.navigate('home');
  }

  biblioteca = () => {
    this.props.navigation.navigate('biblioteca');
  }

  perfil = () => {
    this.props.navigation.navigate('perfil');
  }

  alertas = () => {
    Alert.alert(
      'En desarrollo...'
    );
    //TODO    
  }

}
const styles = StyleSheet.create({
    container: {
      backgroundColor:'#f3f1f1',
    },
    btnCrearPartida: {
      alignSelf:'center',
      width:80,
      height:80,
      position:'absolute',
      top:-40,
    },
    footer: {
      flexDirection:'row',
      backgroundColor: 'white',
    },
    middle: {
      flex: 0.1,
      paddingHorizontal:15,
      paddingBottom:5,
      alignItems:'center',
      justifyContent:'flex-start',
    },
    boton: {
      flex: 1,
      paddingHorizontal:15,
      paddingBottom:5,
      alignItems:'center',
      justifyContent:'flex-start'
    },
    buttonIcon: {
      padding: 0,
      margin: 0,
      fontSize: 3
    },
    buttonText: {
      fontSize: 11
    }
});

export default withNavigation(Footer);