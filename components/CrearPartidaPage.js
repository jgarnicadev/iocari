import React from 'react';
import { StyleSheet, View, Image, Button, TextInput, Text, Switch } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ImagePicker } from 'expo';

import Header from './Header';

class CrearPartidaPage extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <Header title="Crear Partida" />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button
          title="Elige una imagen"
          onPress={this._pickImage}
        />
        <TextInput placeholder="Nombre para la partida"/>
        <View style={styles.fondoOscuro}>
          <Text>Juegos</Text>
        </View>
        <TextInput placeholder="¿Qué juegos tendrás en la partida?"/>
        <View style={styles.fondoOscuro}>
          <Text>Elige el día de la partida</Text>
        </View>
        <TextInput placeholder="dd/mm/aaaa"/>
        <View style={styles.fondoOscuro}>
          <Text>¿A qué hora empieza?</Text>
          <TextInput placeholder="hh:mm"/>
        </View>
        <View style={styles.fondoOscuro}>
          <Text>¿Cuanto durará?</Text>
          <TextInput placeholder="1hr"/>
        </View>
        <View style={styles.fondoOscuro}>
          <Text>Tope para apuntarse</Text>
          <TextInput placeholder="hh:mm"/>
        </View>
        <View style={styles.fondoOscuro}>
          <TextInput placeholder="¿Dónde?"/>
        </View>
        <View style={styles.fondoOscuro}>
          <Text>¿Cuantos players?</Text>
          <TextInput placeholder="2"/>
        </View>
        <TextInput placeholder="Cuénta un poco de qué va a ir el tema"/>
        <View style={styles.fondoOscuro}>
          <Text>Partida Privada</Text>
          <Switch/>
        </View>
        <View style={styles.fondoOscuro}>
          <Text>Controlar las solicitudes</Text>
          <Switch/>
        </View>
        <Button title="Publicar" onPress={() => this.props.navigation.navigate('home')}/>
      </View>
    );
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}

const styles = StyleSheet.create({
  container: {
  },
  fondoOscuro: {

  }
});

export default withNavigation(CrearPartidaPage);