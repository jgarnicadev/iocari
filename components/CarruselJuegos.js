import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import CarruselJuego from './CarruselJuego';

class CarruselJuegos extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            {this.props.title != '' ? (
              <Text style={styles.title}>{this.props.title}</Text>
            ) : null }
            <ScrollView horizontal>
            {this.props.juegos.length == 0 ? (
              <Text>{this.props.msgEmpty}</Text>
            ) : (
              this.props.juegos.map((elem) => 
                <CarruselJuego key={elem.id} juego={elem} />
              )
            )}
            </ScrollView>
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
    },
});

export default CarruselJuegos;