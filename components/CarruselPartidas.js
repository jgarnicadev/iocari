import React from 'react';
import { View, ScrollView } from 'react-native';
import { Title, Text } from 'react-native-paper';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
    render() {
      return (
        <View>
            <Title>{this.props.title}</Title>
            {this.props.partidas.length == 0 ? (
              <Text>{this.props.msgEmpty}</Text>
            ) : (
              <ScrollView horizontal="true">
              {this.props.partidas.map((elem) => 
                <CarruselPartida key={elem.id} partida={elem} />
              )}
              </ScrollView>
            )}
        </View>
      );
    }
}


export default CarruselPartidas;