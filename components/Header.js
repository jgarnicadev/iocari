import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Header extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
  },
  texto: {
    color:'white',
    fontSize:20,
  }
});

export default Header;