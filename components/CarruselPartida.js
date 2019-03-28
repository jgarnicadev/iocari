import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card, Title } from 'react-native-paper';

class CarruselPartida extends React.Component {
    render() {
      return (
        <Card style={styles.container} elevation={5}>
            {this.props.partida.image != '' &&
              <Card.Cover source={{uri: this.props.partida.image}} /> }
            <Card.Content>
              <Title>{this.props.partida.nombre}</Title>
              <Text>Fecha: {this.props.partida.fecha} {this.props.partida.hora}</Text>
              <Text>Jugadores: {this.props.partida.players}</Text>
            </Card.Content>
        </Card>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      marginRight:15,
      marginBottom:20,
      marginLeft:10,
      marginTop:5,
      width:250,
    },
});

export default CarruselPartida;