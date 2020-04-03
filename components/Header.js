import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, AsyncStorage } from 'react-native';
import { Appbar, IconButton, Avatar } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';

class Header extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    if (this.props.headerPerfil) {
      this.obtenerDatosUser();
    }
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

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  back = () => {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
      this.props.navigation.goBack();
    }
  }

  menu = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer())
  }

  render() {
    let bgColor = this.props.bgcolor ? this.props.bgcolor : '#0277bd';
    return (
      <Appbar.Header
        dark={true}
        style={{
          backgroundColor: bgColor,
        }}
        theme={{
          dark: true,
          mode: 'exact',
          colors: {
            text: "white",
          },
        }}
      >
        {this.props.hideBack || 
          <Appbar.BackAction onPress={this.back} />
          //<IconButton icon="chevron-left" color="white" size={30} style={styles.icoBtn} onPress={this.back}></IconButton> 
        }
        {!this.props.hideBack || 
          <Appbar.Action icon="menu" onPress={this.menu} />
          //<IconButton icon="menu" color="white" size={30} style={styles.icoBtn} onPress={this.menu}></IconButton> 
        }
        {this.props.hideTitle || 
          <Appbar.Content
            title={this.props.title}
          />
        }
        {
          //<Text style={styles.texto}>{this.props.title}</Text>
        }
        {!this.props.onCrearPartida || 
          <TouchableHighlight onPress={this.props.onCrearPartida} style={styles.btnPublicar}>
            <View style={styles.btnPublicarWrp}>
            <Text style={styles.btnPublicarTxt}>PUBLICAR</Text>
            <Image source={require('../assets/logo.png')} style={styles.btnPublicarIcon} />
            </View>
          </TouchableHighlight>
        }
        {!this.props.onEditarMiPerfil || 
          <IconButton
            icon="border-color"
            color="white"
            size={20}
            onPress={this.props.onEditarMiPerfil}
          />
        }
        {!this.props.onAddAmigo || (
          <TouchableHighlight onPress={this.props.onAddAmigo} >
            <View style={styles.btnPublicarWrp}>
            <Text style={styles.btnPublicarTxt}>Agregar</Text>
            <IconButton
              icon="plus-circle-outline"
              color="white"
              size={20}
            />
            </View>
          </TouchableHighlight>
        )}
        {this.props.headerPerfil && this.state.user != null && (
          <View style={{
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'flex-end',
          }}>
            <Text style={{
              marginRight:10,
              color:'white',
              fontSize:22,
              fontWeight:"400",
            }}>{this.state.user.username}</Text>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('perfil')} ><Avatar.Image size={45} source={{ uri: this.state.user.photo_url  + '?' + new Date() }} /></TouchableHighlight>
          </View>
        )}
      </Appbar.Header>
    );
  }
}

const styles = StyleSheet.create({
  texto: {
    color:'white',
    fontSize:20,
  },
  icoBtn: {
    margin:0,
    padding:0,
    marginRight:10,
  },
  btnPublicar: {
    marginLeft:'auto',
  },
  btnPublicarWrp: {
    flexDirection:'row',
    alignItems:'center',
  },
  btnPublicarTxt: {
    color:'white',
  },
  btnPublicarIcon: {
    width:25,
    height:25,
    marginLeft:10
  }
});

export default withNavigation(Header);