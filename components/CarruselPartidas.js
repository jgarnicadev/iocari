import React from 'react';
import { View, ScrollView } from 'react-native';
import { Title, Text } from 'react-native-paper';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
    render() {
      return (
        <View>
            <Title style={{
              paddingHorizontal:15,
            }}>{this.props.title}</Title>
            {this.props.partidas.length == 0 ? (
              <Text style={{
                paddingHorizontal:15,
              }}>{this.props.msgEmpty}</Text>
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