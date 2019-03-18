import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.partidas.length == 0 ? (
              <Text>{this.props.msgEmpty}</Text>
            ) : (
              this.props.partidas.map((elem) => 
                <CarruselPartida key="{elem.id}" partida={elem} />
              )
            )}
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
      fontSize:20,
      marginBottom:10,
    }
});

export default CarruselPartidas;