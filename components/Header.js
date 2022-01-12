import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Appbar, IconButton, Avatar } from 'react-native-paper';
import TouchHistoryMath from 'react-native/Libraries/Interaction/TouchHistoryMath';
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
        let body = null;
        if (this.props.idUsuario == '') {
          body = {
            token: data.token, 
            user: {
              email: data.email
            }
          };
        } else {
          body = {
            token: data.token, 
            user: {
              email: data.email
            },
            profile_user: {
              id: this.props.idUsuario
            }
          };
        }
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getProfile',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
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
    let solicitud_amistad = null;
    if (this.props.pendingFriends && this.props.pendingFriends > 0) {
      solicitud_amistad = <IconButton icon="email-outline" color="white" size={20} onPress={this.props.onPendingFriends} style={{marginRight:30}} />
    }
      
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
        {//left
        }
        {this.props.hideBack || 
          <Appbar.BackAction onPress={this.back} />
          //<IconButton icon="chevron-left" color="white" size={30} style={styles.icoBtn} onPress={this.back}></IconButton> 
        }
        {!this.props.hideBack || 
          <Appbar.Action icon="menu" onPress={this.menu} />
          //<IconButton icon="menu" color="white" size={30} style={styles.icoBtn} onPress={this.menu}></IconButton> 
        }
        {//middle
        }
        {this.props.search &&
         <View style={styles.buscador}>
         <View style={styles.buscadorInputWrap}>
           <Image source={require('../assets/icon-search.png')} style={styles.buscadorIcon} />
           <TextInput style={styles.buscadorInput} placeholder="¿Qué estás buscando?" onSubmitEditing={this.props.searchCallback}/>
         </View>
        </View>
        }
        {this.props.hideTitle || 
          <Appbar.Content
            title={this.props.title}
          />
        }
        {
          //<Text style={styles.texto}>{this.props.title}</Text>
        }
        {//right
        }
        {!this.props.onCrearPartida || 
          <TouchableOpacity onPress={this.props.onCrearPartida} style={styles.btnPublicar}>
            <View style={styles.btnPublicarWrp}>
            <Text style={styles.btnPublicarTxt}>PUBLICAR</Text>
            <Image source={require('../assets/logo.png')} style={styles.btnPublicarIcon} />
            </View>
          </TouchableOpacity>
        }
        {!this.props.onEditarMiPerfil || (
          <View style={{
            flex:1,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'flex-end',
          }}>
            {solicitud_amistad}
            <IconButton
              icon="border-color"
              color="white"
              size={20}
              onPress={this.props.onEditarMiPerfil}
            />
          </View>
        )}
        {!this.props.onAddAmigo || (
          <TouchableOpacity onPress={this.props.onAddAmigo} >
            <View style={styles.btnPublicarWrp}>
            <Text style={styles.btnPublicarTxt}>Agregar</Text>
            <IconButton
              icon="plus-circle-outline"
              color="white"
              size={20}
            />
            </View>
          </TouchableOpacity>
        )}
        {!this.props.onSharePartida || (
          <TouchableOpacity onPress={this.props.onSharePartida} >
            <View style={styles.btnPublicarWrp}>
            <IconButton
              icon="share-variant"
              color="white"
            />
            </View>
          </TouchableOpacity>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('perfil',{id_usuario: this.props.idUsuario})} ><Avatar.Image size={45} source={{ uri: this.state.user.photo_url  + '?' + new Date() }} /></TouchableOpacity>
          </View>
        )}
        {this.props.onBattleLists && (
          <View style={{
            justifyContent:'flex-end',
          }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('mapa')} >
              <IconButton
                icon="map"
                color="white"
                size={20}
              />
            </TouchableOpacity>
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
  },
  buscador: {
    //backgroundColor:'#03a9f4',
    padding:0,
    flex: 8
  },
  buscadorInputWrap: {
    backgroundColor:'white',
    flexDirection:'row',
    borderRadius:5,
  },
  buscadorIcon: {
    alignSelf:'center',
    marginLeft:15,
    marginRight:5,
  },
  buscadorInput: {
    backgroundColor:'white',
    padding:10,
    fontSize:15,
    borderRadius:5,
  }
});

export default withNavigation(Header);