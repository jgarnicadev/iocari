import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Title, IconButton } from 'react-native-paper';

class CarruselPartida extends React.Component {
    render() {
      return (
        <Card style={styles.container} elevation={5}>
            <Card.Cover source={{uri: this.props.partida.image}} />
            <Card.Content>
              <Title>{this.props.partida.nombre}</Title>
              <Text>Fecha: {this.props.partida.fecha} {this.props.partida.hora}</Text>
            </Card.Content>
            <View style={styles.txtJugadores}>
              <IconButton icon="wc" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
              <Text style={{ color: 'white' }}>{this.props.partida.jugadores_apuntados} / {this.props.partida.players}</Text>
            </View>
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
      paddingBottom:5,
    },
    txtJugadores: {
      position:"absolute",
      left:10,
      top:155,
      backgroundColor:"rgba(0, 0, 0, 0.5)",
      flexDirection:'row',
      alignItems:'center',
    },
});

export default CarruselPartida;