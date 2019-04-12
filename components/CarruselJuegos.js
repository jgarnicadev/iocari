import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import CarruselJuego from './CarruselJuego';

class CarruselJuegos extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <ScrollView horizontal="true">
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