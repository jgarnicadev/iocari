import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';

class Header extends React.Component {
  state = {
    visible: false,
  };

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
    return (
      <Appbar.Header style={styles.container}>
        {this.props.hideBack || 
          <Appbar.BackAction onPress={this.back} />
          //<IconButton icon="chevron-left" color="white" size={30} style={styles.icoBtn} onPress={this.back}></IconButton> 
        }
        {!this.props.hideBack || 
          <Appbar.Action icon="menu" onPress={this.menu} />
          //<IconButton icon="menu" color="white" size={30} style={styles.icoBtn} onPress={this.menu}></IconButton> 
        }
        <Appbar.Content
          title={this.props.title}
        />
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
      </Appbar.Header>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#0277bd',
  },
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