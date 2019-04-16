import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class CarruselJuego extends React.Component {

    showJuego = () => {
      this.props.navigation.navigate('juego', {
        id_juego: this.props.juego.id
      });
    }

    render() {
      return (
        <TouchableHighlight onPress={this.showJuego}>
        <Card style={styles.container} elevation={5}>
            <Card.Cover source={{uri: this.props.juego.image}} />
            <Card.Content>
              <View style={{ flexDirection:'row', justifyContent: 'space-between', marginVertical:5 }}>
                <View style={{ flexDirection:'row', backgroundColor:"#ccc", alignItems:'center', paddingHorizontal:5 }}>
                  <Image source={require('../assets/ico-jugadores-gris.png')} style={{ width: 10, height: 10, margin:0,  marginRight:5 }}/>
                  <Text style={{ fontSize:13 }}>{this.props.juego.jugadores_min}-{this.props.juego.jugadores_max}</Text>
                </View>
                <View style={{ flexDirection:'row', backgroundColor:"#ccc", alignItems:'center', paddingHorizontal:5 }}>
                  <Image source={require('../assets/ico-duracion-gris.png')} style={{ width: 10, height: 10, margin:0,  marginRight:5 }}/>
                  <Text style={{ fontSize:13 }}>{this.props.juego.duraccion_min}-{this.props.juego.duraccion_max}</Text>
                </View>
              </View>
              <Title>{this.props.juego.nombre}</Title>
            </Card.Content>
        </Card>
        </TouchableHighlight>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      marginRight:10,
      marginBottom:20,
      marginLeft:10,
      marginTop:5,
      width:150,
      paddingBottom:5,
    },
});

export default withNavigation(CarruselJuego);
