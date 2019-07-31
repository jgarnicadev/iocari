import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Card, Title, IconButton } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class CarruselPartida extends React.Component {

    showPartida() {
      this.props.navigation.navigate('partida', {
        id_partida: this.props.partida.id
      });
    }

    render() {
      return (
        <TouchableHighlight onPress={this.showPartida.bind(this)}>
        <Card style={styles.container} elevation={5}>
            <Card.Cover source={{uri: this.props.partida.image_url}} />
            <Card.Content>
              <Title>{this.props.partida.name}</Title>
              <Text>Fecha: {this.props.partida.init_date}</Text>
            </Card.Content>
            <View style={styles.txtJugadores}>
              <IconButton icon="wc" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
              <Text style={{ color: 'white' }}>{this.props.partida.current_players} / {this.props.partida.num_players}</Text>
            </View>
        </Card>
        </TouchableHighlight>
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

export default withNavigation(CarruselPartida);
