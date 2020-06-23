import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Image } from 'react-native';
import { Card, Title, IconButton, Avatar, ThemeProvider } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class CarruselPartida extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        accessToken: {
          token: '',
          email: '',
          username: '',
        },
        datosUser: null,
        datosBattle: null,
        partidaTerminada: false,
      }
    }

    async getAccessToken() {
      const data =  await AsyncStorage.getItem('accessToken');
      return data;
    }

    componentDidMount() {
      this.getAccessToken().then( value => {
        this.setState(
          {'accessToken':JSON.parse(value)},
          this.loadData
        );
      });
    }

    loadData = () => {
      this.getDataUser();
      this.getDataPartida();
    }

    getDataUser = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getProfile',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.state.accessToken.token,  
          user: {
            email: this.state.accessToken.email,
          },
          profile_user: {
            id: this.props.partida.id_user
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
          this.setState({'datosUser':response.profile_user});
        }
      });
    }

    getDataPartida = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getBattle',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.state.accessToken.token,  
          user: {
            email: this.state.accessToken.email,
          },
          battle: {
            id: this.props.partida.id
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
          response.battle.jugadores = response.users;
          let terminada = false;
          let end_date = new Date(response.battle.end_date);
          if (end_date.getTime() < Date.now()) {
            terminada = true;
          }
          this.setState({
            'datosBattle':response.battle,
            'partidaTerminada': terminada,
          });
        }
      });
    }

    showPartida() {
      this.props.navigation.navigate('partida', {
        id_partida: this.props.partida.id
      });
    }


    render() {
      console.log(this.state.datosBattle);
      const init_date = new Date(this.props.partida.init_date.substr(0,19));
      const strDate = init_date.getDate().toString().padStart(2, '0')+'/'+(init_date.getMonth()+1).toString().padStart(2, '0')+'/'+init_date.getFullYear()+' '+init_date.getHours().toString().padStart(2, '0')+':'+init_date.getMinutes().toString().padStart(2, '0');
      return (
        <TouchableHighlight onPress={this.showPartida.bind(this)}>
        <Card style={styles.container} elevation={5}>
            <Card.Cover style={styles.cover} source={{uri: this.props.partida.image_url?this.props.partida.image_url:'https://images-na.ssl-images-amazon.com/images/I/A1uDIngqMDL._SX466_.jpg'}} />
            <Card.Content>
              <Text>{this.props.partida.name}</Text>
              <Text>{strDate}</Text>
            </Card.Content>
            <View style={styles.txtJugadores}>
              <IconButton icon="human-male-female" color="white" size={20} style={{ margin:0, padding: 0 }}></IconButton>
              <Text style={{ color: 'white' }}>{this.props.partida.current_players} / {this.props.partida.num_players}</Text>
            </View>
            {this.state.datosUser != null && <Avatar.Image size={35} source={{ uri: this.state.datosUser.photo_url + '?' + new Date() }} style={styles.avatarUser} />}
            {this.state.partidaTerminada == true && this.state.datosBattle.jugadores[0].username == this.state.accessToken.username && this.state.datosBattle.rating != null && this.state.datosBattle.rating != 0 && (
              <View style={styles.rating}>
                <IconButton
                  icon="star"
                  color="#f50057"
                  size={20}
                  style={styles.ratingIcon}
                />
                <Text style={styles.ratingText}>{this.state.datosBattle.rating}</Text>
              </View>
            )}
            {this.state.partidaTerminada == true && this.state.datosBattle.jugadores[0].username != this.state.accessToken.username && this.state.datosBattle.my_rating != null && this.state.datosBattle.my_rating != 0 && (
              <View style={styles.rating}>
                <IconButton
                  icon="star"
                  color="#f50057"
                  size={20}
                  style={styles.ratingIcon}
                />
                <Text style={styles.ratingText}>{this.state.datosBattle.my_rating}</Text>
              </View>
            )}
            {this.state.datosBattle != null && this.state.datosBattle.private == 1 && 
              <View style={styles.private}>
                <Image source={require('../assets/admin_panel_settings-24px.png')} />
              </View>
            }
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
    avatarUser: {
      position:"absolute",
      left:10,
      top:10,
    },
    rating: {
      position:"absolute",
      right:10,
      top:10,
      backgroundColor:"white",
      borderRadius:5,
      flexDirection:'row'
    },
    ratingText: {
      color:"#f50057",
      marginRight:3,
      marginTop:5,
    },
    ratingIcon: {
      margin:0,
      padding:0,
    },
    private: {
      position:"absolute",
      right:3,
      bottom:0,
    }
});

export default withNavigation(CarruselPartida);
