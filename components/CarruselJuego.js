import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native';
import { Card, Title, IconButton } from 'react-native-paper';
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
