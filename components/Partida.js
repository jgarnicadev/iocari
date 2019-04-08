import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';

import Header from './Header';

class Partida extends React.Component {
    state = {
        id_partida: 0,
        accessToken: '',
        partida: null,
        loading: true,
    }

    async getAccessToken() {
      const data =  await AsyncStorage.getItem('accessToken');
      return data;
    }
  
    componentDidMount() {
        this.props.navigation.addListener(
          'didFocus',
          payload => {
            this.setState({'loading':true});
            const { navigation } = this.props;
            this.getAccessToken().then( value => {
              this.setState({'accessToken':value});
              this.setState({'id_partida': navigation.getParam('id_partida', '')});
              this.loadPartida();
            });
          }
        );
    }

    loadPartida() {
      fetch('http://www.afcserviciosweb.com/iocari-api.php',{
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({op:'getPartida', id: this.state.id_partida, accessToken:this.state.accessToken})
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({'partida':responseJson});
          this.setState({'loading':false});
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
    render() {
        if (this.state.loading) {
          return (
            <View><ActivityIndicator /></View>
          );
        }
        return (
            <View style={styles.container}>
              <Header title={this.state.partida.nombre} />
              <View style={styles.cabeceraPartida}>
                <Image source={{ uri: this.state.partida.image }} style={{ width:'100%', height:200}} />
                <Text>{this.state.partida.fecha}</Text>
                <Text>{this.state.partida.hora}</Text>
                <Text>{this.state.partida.duracion}</Text>
                <Text>{this.state.partida.jugadores_apuntados} / {this.state.partida.players}</Text>
              </View>
              <View style={styles.juegos}>
                <Text>Juegos para la sesión</Text>
                <Text>{this.state.partida.juegos}</Text>
              </View>
              <View style={styles.descripcion}>
                <Text>{this.state.partida.descripcion}</Text>
              </View>
              <View style={styles.personasApuntadas}>
                <Text>Personas apuntadas</Text>
                {this.state.partida.jugadores.map((elem) => 
                  <Text key={elem.id}>{elem.player_name}</Text>
                )}
              </View>
              <View style={styles.lugar}>
                  <Text>{this.state.partida.lugar}</Text>
              </View>
              <View style={styles.comentarios}>
                  <Text>Comentarios</Text>
              </View>
              <Button style={styles.btnApuntarse} mode="contained" dark="true" color="#f50057" onPress={this.apuntarse.bind(this)}>Apuntarse</Button>
            </View>
        );
    }

    apuntarse() {

    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
      backgroundColor:'#f3f1f1',
    },
});

export default Partida;

