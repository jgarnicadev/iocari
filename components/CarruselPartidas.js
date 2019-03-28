import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <ScrollView horizontal="true">
            {this.props.partidas.length == 0 ? (
              <Text>{this.props.msgEmpty}</Text>
            ) : (
              this.props.partidas.map((elem) => 
                <CarruselPartida key="{elem.id}" partida={elem} />
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

export default CarruselPartidas;