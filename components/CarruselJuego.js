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
            <Card.Cover source={{uri: this.props.juego.image_url}} style={styles.cover} />
            <Card.Content style={styles.content}>
              <View style={{ flexDirection:'row', justifyContent: 'space-between', marginVertical:5 }}>
                <View style={{ flexDirection:'row', backgroundColor:"#ccc", alignItems:'center', paddingHorizontal:5 }}>
                  <Image source={require('../assets/ico-jugadores-gris.png')} style={{ width: 10, height: 10, margin:0,  marginRight:5 }}/>
                  <Text style={{ fontSize:13 }}>{this.props.juego.min_players}-{this.props.juego.max_players}</Text>
                </View>
                <View style={{ flexDirection:'row', backgroundColor:"#ccc", alignItems:'center', paddingHorizontal:5 }}>
                  <Image source={require('../assets/ico-duracion-gris.png')} style={{ width: 10, height: 10, margin:0,  marginRight:5 }}/>
                  <Text style={{ fontSize:13 }}>{this.props.juego.playing_time}</Text>
                </View>
              </View>
              <Title style={styles.nombreJuego}>{this.props.juego.name}</Title>
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
      marginLeft:0,
      marginTop:5,
      width:110,
      paddingHorizontal:0,
      paddingVertical:0,
      height:180,
      overflow: 'hidden',
    },
    cover: {
      height:120,
    },
    content: {
      paddingHorizontal:5,
      paddingVertical:0,
    },
    nombreJuego: {
      marginTop:0,
      marginVertical:5,
      marginHorizontal:0,
      paddingVertical:0,
      paddingHorizontal:0,
      fontSize:15,
      lineHeight: 15,
      overflow:'hidden'
    }
});

export default withNavigation(CarruselJuego);
