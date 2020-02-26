import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage } from 'react-native';
import { Card, Title, IconButton, Avatar } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class CarruselPartida extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        datosUser: null
      }
    }

    componentDidMount() {
      this.getDataUser();
    }

    showPartida() {
      this.props.navigation.navigate('partida', {
        id_partida: this.props.partida.id
      });
    }

    async getAccessToken() {
      const data =  await AsyncStorage.getItem('accessToken');
      return data;
    }


    getDataUser() {
      this.getAccessToken().then( value => {
        try {
          let data = JSON.parse(value);
          //validate accessToken is valid
          fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getProfile',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: data.token, 
              user: {
                email: data.email
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
        } catch(e) {
          //accesstoken guardado no es json
        }
      });
    }

    render() {
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
            {this.state.datosUser != null && <Avatar.Image size={35} source={{ uri: this.state.datosUser.photo_url }} style={styles.avatarUser} />}
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
    }
});

export default withNavigation(CarruselPartida);
