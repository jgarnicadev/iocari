import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Avatar } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class ListadoUsuario extends React.Component {

    showUsuario = () => {
      this.props.navigation.navigate('perfil', {
        id_usuario: this.props.usuario.id
      });
    }

    render() {
      return (
        <TouchableOpacity onPress={this.showUsuario}>
        <Card style={styles.container} elevation={5}>
            <Card.Content style={styles.content}>
              <Avatar.Image size={110} source={{uri: this.props.usuario.photo_url}} />
              <Title style={styles.nombreJuego}>{this.props.usuario.username}</Title>
            </Card.Content>
        </Card>
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      marginRight:10,
      marginBottom:20,
      marginLeft:0,
      marginTop:5,
      paddingHorizontal:0,
      paddingVertical:0,
      width:130,
      height:180,
      overflow: 'hidden',
    },
    content: {
      paddingHorizontal:5,
      paddingVertical:10,
      alignItems:'center'
    },
    nombreJuego: {
      marginTop:10,
      fontSize:15,
      lineHeight: 15,
    }
});

export default withNavigation(ListadoUsuario);
