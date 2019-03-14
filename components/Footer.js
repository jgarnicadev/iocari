import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

class Footer extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.btnCrearPartida}>
            <Button title="Crear partida" onPress={() => this.props.navigation.navigate('crearPartida')}/>
          </View>
          <View style={styles.footer}>
            <View style={styles.boton}><Text>Home</Text></View>
            <View style={styles.boton}><Text>Biblioteca</Text></View>
            <View style={styles.boton}><Text>Perfil</Text></View>
            <View style={styles.boton}><Text>Alertas</Text></View>
          </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {

    },
    footer: {
      flexDirection:'row',
      justifyContent: 'space-between',
      paddingHorizontal:10,
    },
    btnCrearPartida: {
      paddingHorizontal:15,
      marginVertical:10,
    },
    boton: {
      paddingTop:50,
      paddingHorizontal:15,
      paddingBottom:20,
      alignItems:'center',
      justifyContent:'center',
    }
});

export default withNavigation(Footer);