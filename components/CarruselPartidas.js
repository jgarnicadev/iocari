import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text } from 'react-native-paper';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
    render() {
      return (
        <View style={styles.container} >
            <Title style={{
              paddingHorizontal:15,
            }}>{this.props.title}</Title>
            {this.props.partidas.length == 0 ? (
              <Text style={{
                paddingHorizontal:15,
              }}>{this.props.msgEmpty}</Text>
            ) : (
              <ScrollView horizontal>
              {this.props.partidas.map((elem) => 
                <CarruselPartida key={elem.id} partida={elem} />
              )}
              </ScrollView>
            )}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
  },
});

export default CarruselPartidas;