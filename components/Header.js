import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class Header extends React.Component {

  back = () => {
    this.props.navigation.goBack();
  }

  menu = () => {
    Alert.alert(
      'En desarrollo...'
    );
    //TODO    
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.hideBack || 
          <IconButton icon="chevron-left" color="white" size={30} style={styles.icoBtn} onPress={this.back}></IconButton> 
        }
        {!this.props.hideBack || 
          <IconButton icon="menu" color="white" size={30} style={styles.icoBtn} onPress={this.menu}></IconButton> 
        }
        <Text style={styles.texto}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#0277bd',
    paddingHorizontal:20,
    paddingTop:40,
    paddingBottom:15,
    flexDirection:'row',
    alignItems:'center',
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
});

export default withNavigation(Header);