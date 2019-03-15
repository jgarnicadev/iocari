import React from 'react';
import { StyleSheet, View, Image, Button, TextInput, Text, Switch, ScrollView, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ImagePicker } from 'expo';

import Header from './Header';

class CrearPartidaPage extends React.Component {
  state = {
    image: null,
    nombre: '',
    juegos: '',
    fecha: '',
    hora: '',
    duracion: '',
    tope_apuntarse: '',
    lugar: '',
    players: '',
    descripcion: '',
    privada: true,
    controlar_solicitudes: false,
  };

  publicar() {
    if (
      // !this.state.image ||
      !this.state.nombre ||
      !this.state.juegos ||
      !this.state.fecha ||
      !this.state.hora ||
      !this.state.duracion ||
      !this.state.tope_apuntarse ||
      !this.state.lugar ||
      !this.state.players ||
      !this.state.descripcion
    ) {
      Alert.alert(
        'Debes rellenar todos los campos'
      );
      return;
    }
    // Alert.alert('En desarrollo');
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });
    Alert.alert('Partida Creada');
    this.props.navigation.navigate('home');
  }

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <Header title="Crear Partida" />
        <ScrollView>
          <View  style={styles.fondoNormal}>
            {image &&
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Button
              title="Elige una imagen"
              color="#dcdcdc"
              onPress={this._pickImage}
            />
          </View>
          <View  style={styles.fondoNormal}>
            <TextInput style={styles.inputText} placeholder="Nombre para la partida"
            onChangeText={(text) => this.setState({nombre: text})}
            value={this.state.nombre}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>Juegos</Text>
          </View>
          <View  style={styles.fondoNormal}>
            <TextInput style={styles.inputText} placeholder="¿Qué juegos tendrás en la partida?"
            onChangeText={(text) => this.setState({juegos: text})}
            value={this.state.juegos}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>Elige el día de la partida</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="dd/mm/aaaa"
            onChangeText={(text) => this.setState({fecha: text})}
            value={this.state.fecha}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>¿A qué hora empieza?</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="hh:mm"
            onChangeText={(text) => this.setState({hora: text})}
            value={this.state.hora}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>¿Cuanto durará?</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="1hr"
            onChangeText={(text) => this.setState({duracion: text})}
            value={this.state.duracion}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>Tope para apuntarse</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="hh:mm"
            onChangeText={(text) => this.setState({tope_apuntarse: text})}
            value={this.state.tope_apuntarse}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <TextInput style={styles.inputTextOscuroLargo} placeholder="¿Dónde?"
            onChangeText={(text) => this.setState({lugar: text})}
            value={this.state.lugar}
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>¿Cuantos players?</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="2"
            onChangeText={(text) => this.setState({players: text})}
            value={this.state.players}
            />
          </View>
          <View style={styles.fondoNormal}>
            <TextInput style={styles.inputText} placeholder="Cuénta un poco de qué va a ir el tema"
            onChangeText={(text) => this.setState({descripcion: text})}
            value={this.state.descripcion}
            multiline = {true}
            numberOfLines = {4}
            textAlignVertical = "top"
            />
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>Partida Privada</Text>
            <Switch
			onValueChange={(nuevo) => this.setState({privada: nuevo})}
			value={this.state.privada}
			trackColor={{false:'#999',true:'#f50057'}}
			thumbColor='white'
			/>
          </View>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>Controlar las solicitudes</Text>
            <Switch
			onValueChange={(nuevo) => this.setState({controlar_solicitudes: nuevo})}
			value={this.state.controlar_solicitudes}
			trackColor={{false:'#999',true:'#f50057'}}
			thumbColor='white'
			/>
          </View>
          <View style={styles.fondoNormal}>
            <Button title="Publicar" color="#f50057" onPress={this.publicar.bind(this)}/>
          </View>
        </ScrollView>
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
    flex: 1,
    alignItems: 'stretch',
    justifyContent:'flex-start',
    backgroundColor:'#f3f1f1',
  },
  fondoNormal: {
    paddingVertical:20,
    paddingHorizontal:15,
  },
  inputText: {
    backgroundColor:'white',
    padding:10,
    fontSize:13,
    borderRadius:5,
  },
  fondoOscuro: {
    backgroundColor:'#dcdcdc',
    padding:15,
    paddingLeft:20,
    flexDirection:'row',
    marginBottom:5,
    alignItems:'center',
    justifyContent:'space-between',
  },
  textoOscuro: {
    marginRight:10,
  },
  inputTextOscuro: {
    backgroundColor:'white',
    padding:10,
    fontSize:13,
    borderRadius:5,
    width:100,
    textAlign:'right',
  },
  inputTextOscuroLargo: {
    backgroundColor:'white',
    padding:10,
    fontSize:13,
    borderRadius:5,
    flex:1,
  },
});

export default withNavigation(CrearPartidaPage);