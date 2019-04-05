import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { IconButton } from 'react-native-paper';

class Footer extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.btnCrearPartida}>
            <IconButton
              size={150}
              icon={({ size }) => (
                <Image
                  source={require('../assets/btnCrearPartida.png')}
                  style={{ width: size, height: size }}
                />
              )}
              onPress={() => this.props.navigation.navigate('crearPartida')}
            />
          </View>
          <View style={styles.footer}>
            <View style={styles.boton}>
              <IconButton icon="home"></IconButton>
              <Text>Home</Text>
            </View>
            <View style={styles.boton}>
              <IconButton icon="view-list" color="#bbb"></IconButton>
              <Text style={{ color: '#bbb'}}>Biblioteca</Text>
            </View>
            <View style={styles.boton}>
              <IconButton icon="person" color="#bbb"></IconButton>
              <Text style={{ color: '#bbb'}}>Perfil</Text>
            </View>
            <View style={styles.boton}>
              <IconButton icon="notifications" color="#bbb"></IconButton>
              <Text style={{ color: '#bbb'}}>Alertas</Text>
            </View>
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
      alignItems:"center",
    },
    boton: {
      paddingHorizontal:15,
      paddingBottom:20,
      alignItems:'center',
      justifyContent:'center',
    }
});

export default withNavigation(Footer);