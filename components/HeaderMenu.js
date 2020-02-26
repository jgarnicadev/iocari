import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Text, Caption, Avatar} from 'react-native-paper';

class HeaderMenu extends React.Component {
    state = {
        email: '',
        password: '',
        user: null,
      };
    
    async getAccessToken() {
        const data =  await AsyncStorage.getItem('accessToken');
        return data;
    }
    
    
    componentDidMount() {
        this.obtenerDatosUser();
    }

    obtenerDatosUser = () => {
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
              }
            })
          })
          .then((response) => response.json())
          .then((response) => {
            if (response.result == 'OK') {
              this.setState({'user': response.profile_user});
            }
          });
        } catch(e) {
          //accesstoken guardado no es json
        }
      });
    }

    render() {
        if (this.state.user == null) return null;
        return (
            <View style={styles.header}>
                <Avatar.Image size={50} source={{ uri: this.state.user.photo_url }} />
                <Text style={[styles.textWhite,styles.nombreUsuario]}>{this.state.user.username}</Text>
                <Caption style={[styles.textWhite,styles.sloganUsuario]}>{this.state.user.title}</Caption>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    header: {
        paddingTop:40,
        paddingBottom:5,
        paddingHorizontal:10,
        backgroundColor:'#03a9f4',
    },
    textWhite: {
        color:'white',
    },
    nombreUsuario: {
        paddingTop:6,
    },
    sloganUsuario: {
    
    }
});

export default HeaderMenu;