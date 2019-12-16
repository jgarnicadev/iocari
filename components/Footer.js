import React from 'react';
import { View, StyleSheet, Image, TouchableHighlight, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { IconButton, Text } from 'react-native-paper';

class Footer extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.footer}>
            <TouchableHighlight onPress={this.home}>
              <View style={styles.boton}>
                <IconButton icon="home" color={this.props.activo!='home'?'#bbb':'black'} ></IconButton>
                <Text style={this.props.activo!='home'?{color:'#bbb'}:{color:'black'}}>Home</Text>
              </View>
              </TouchableHighlight>
            <TouchableHighlight onPress={this.biblioteca}>
              <View style={styles.boton}>
                <IconButton icon="view-list" color={this.props.activo!='biblioteca'?'#bbb':'black'}></IconButton>
                <Text style={this.props.activo!='biblioteca'?{color:'#bbb'}:{color:'black'}}>Biblioteca</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.boton}></View>
            <TouchableHighlight onPress={this.perfil}>
              <View style={styles.boton}>
                <IconButton icon="person" color={this.props.activo!='perfil'?'#bbb':'black'}></IconButton>
                <Text style={this.props.activo!='perfil'?{color:'#bbb'}:{color:'black'}}>Perfil</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.alertas}>
              <View style={styles.boton}>
                <IconButton icon="notifications" color={this.props.activo!='alertas'?'#bbb':'black'}></IconButton>
                <Text style={this.props.activo!='alertas'?{color:'#bbb'}:{color:'black'}}>Alertas</Text>
              </View>
            </TouchableHighlight>
          </View>
          <IconButton
            style={styles.btnCrearPartida}
            size={100}
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
      position:"absolute",
      top:-10,
      alignSelf:'center',
      paddingLeft:15,
    },
    footer: {
      flexDirection:'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
    },
    boton: {
      paddingHorizontal:15,
      paddingBottom:10,
      alignItems:'center',
      justifyContent:'flex-start',
    }
});

export default withNavigation(Footer);