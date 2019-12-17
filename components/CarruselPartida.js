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
            <Card.Cover style={styles.cover} source={{uri: this.props.partida.image_url?this.props.partida.image_url:'https://images-na.ssl-images-amazon.com/images/I/A1uDIngqMDL._SX466_.jpg'}} />
            <Card.Content>
              <Text>{this.props.partida.name}</Text>
              <Text>Fecha: {this.props.partida.init_date}</Text>
            </Card.Content>
            <View style={styles.txtJugadores}>
              <IconButton icon="human-male-female" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
              <Text style={{ color: 'white' }}>{this.props.partida.current_players} / {this.props.partida.num_players}</Text>
            </View>
        </Card>
        </TouchableHighlight>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      marginRight:5,
      marginBottom:20,
      marginLeft:10,
      marginTop:5,
      width:190,
      paddingBottom:5,
    },
    cover: {
      height:150,
    },
    txtJugadores: {
      position:"absolute",
      left:10,
      top:115,
      backgroundColor:"rgba(0, 0, 0, 0.5)",
      flexDirection:'row',
      alignItems:'center',
    },
});

export default withNavigation(CarruselPartida);
