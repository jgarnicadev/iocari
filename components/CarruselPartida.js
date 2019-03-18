import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

class CarruselPartida extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            {this.props.partida.image != '' &&
              <Image style={styles.imagen_partida} source={{uri: this.props.partida.image}} /> }
            <Text>{this.props.partida.nombre}</Text>
            <Text>Fecha: {this.props.partida.fecha} {this.props.partida.hora}</Text>
            <Text>Jugadores: {this.props.partida.fecha} {this.props.partida.players}</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    imagen_partida: {
      width:80,
      height:60,
    }
});

export default CarruselPartida;