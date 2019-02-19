import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { withNavigation } from 'react-navigation';

class Footer extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <Button title="Crear partida" onPress={() => this.props.navigation.navigate('crearPartida')}/>
          <View style={styles.footer}>
            <Text>Home</Text>
            <Text>Biblioteca</Text>
            <Text>Perfil</Text>
            <Text>Alertas</Text>
          </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {

    },
    footer: {

    }
});

export default withNavigation(Footer);