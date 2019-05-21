import React from 'react';
import { View, StyleSheet, ImageBackground, Image, ScrollView, AsyncStorage, ActivityIndicator, Text, TouchableHighlight, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';

import Header from './Header';
import CarruselJuegos from './CarruselJuegos';

class Juego extends React.Component {
  state = {
    id_juego: 0,
    accessToken: '',
    juego: null,
    loading: true,
    loQuiero: false,
    quieroJugar: false,
    enBiblioteca: false,
  }

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
      this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.setState({'loading':true});
          const { navigation } = this.props;
          this.getAccessToken().then( value => {
            this.setState({'accessToken':value});
            this.setState({'id_juego': navigation.getParam('id_juego', '')});
            this.loadJuego();
          });
        }
      );
  }

  loadJuego() {
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'getJuego', id: this.state.id_juego, accessToken:this.state.accessToken})
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({'juego':responseJson});
        let loQuiero = (responseJson.loQuiero == 1);
        let quieroJugar = (responseJson.quieroJugar == 1);
        let enBiblioteca = (responseJson.enBiblioteca == 1);
        this.setState({'loQuiero':loQuiero});
        this.setState({'quieroJugar':quieroJugar});
        this.setState({'enBiblioteca':enBiblioteca});
        this.setState({'loading':false});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View><ActivityIndicator /></View>
      );
    }


    let creditosObj = JSON.parse(this.state.juego.creditos);
    let creditos = Object.keys(creditosObj).map(key => 
      (<View key={key} style={styles.credito}>
        <Text style={styles.creditoTitle}>{key}</Text>
        <Text style={styles.creditoValue}>{creditosObj[key]}</Text>
      </View>)
    );

    return (
      <View style={styles.container}>
        <Header title={this.state.juego.nombre} />
        <View style={styles.container}>
          <ImageBackground style={styles.cabecera} source={{ uri: this.state.juego.image }} imageStyle={{ resizeMode: 'cover', opacity: 0.3 }} >
            <View style={{ flexDirection:'row', justifyContent: 'flex-end', marginTop:30, marginRight:20 }}>
              <View style={{ flexDirection:'row', alignItems:'center', marginRight:20 }}>
                <Image source={require('../assets/ico-jugadores-blanco.png')} style={{ width: 13, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.jugadores_min}-{this.state.juego.jugadores_max}</Text>
              </View>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Image source={require('../assets/ico-duracion-blanco.png')} style={{ width: 9, height: 11, margin:0,  marginRight:5 }}/>
                <Text style={{ fontSize:15, color:'white' }}>{this.state.juego.duraccion_min}-{this.state.juego.duraccion_max}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.main}>
            <ScrollView style={styles.mainWrap}>
              <View style={{ flexDirection:'row', justifyContent: 'space-between', marginTop:30}}>
                <TouchableHighlight onPress={this.loQuiero}>
                  <View style={this.state.loQuiero ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-loquiero.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={this.state.loQuiero ? styles.txtBtnActive : styles.txtBtnInactive}>¡Lo quiero!</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.quieroJugar}>
                  <View style={this.state.quieroJugar ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-quierojugar.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={this.state.quieroJugar ? styles.txtBtnActive : styles.txtBtnInactive}>Quiero jugar</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enBiblioteca}>
                  <View style={this.state.enBiblioteca ? [styles.btn, styles.btnActive] : [styles.btn, styles.btnInactive]}>
                    <Image source={require('../assets/ico-btn-anadir.png')} style={{ width: 25, height: 25, margin:0,  marginRight:10 }}/>
                    <Text style={this.state.enBiblioteca ? styles.txtBtnActive : styles.txtBtnInactive}>Añadir</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <Text style={styles.descripcion}>{this.state.juego.descripcion}</Text>
              <View style={styles.creditos}>{creditos}</View>
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Mecánicas</Text>
                <View style={styles.seccionDataContainer}>
                {this.state.juego.mecanicas.map((mecanica, index) => 
                  <Text key={index} style={styles.seccionData}>{mecanica}</Text>
                )}
                </View>
              </View>
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Categorías</Text>
                <View style={styles.seccionDataContainer}>
                {this.state.juego.categorias.map((categoria, index) => 
                  <Text key={index} style={styles.seccionData}>{categoria}</Text>
                )}
                </View>
              </View>
              <CarruselJuegos title="Expansiones" msgEmpty="Este juego no tiene expansiones" juegos={this.state.juego.expansiones} />
              <View style={styles.seccion}>
                <Text style={styles.seccionTitle}>Premios</Text>
                <View style={styles.seccionDataContainer}>
                  <Text style={styles.seccionData}>{this.state.juego.premios}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <Image style={styles.imageJuego}  source={{ uri: this.state.juego.image }} />
          <IconButton
              size={100}
              icon={({ size }) => (
                <Image
                  source={require('../assets/btnCrearPartida.png')}
                  style={{ width: size, height: size }}
                />
              )}
              onPress={this.crearPartida}
              style={styles.btnCrearPartida}
            />
        </View>
      </View>
    );
  }

  crearPartida = () => {
    this.props.navigation.navigate('crearPartida')
  }

  enDesarrollo = () => {
    Alert.alert('En desarrollo...');
  }

  loQuiero = () => {
    let value = this.state.loQuiero ? 0 : 1;
    this.setState({'loQuiero':!this.state.loQuiero});
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'setJuegoBiblioteca', id: this.state.id_juego, state: 'loQuiero', value: value, accessToken:this.state.accessToken})
    })
      .catch((error) => {
        console.log(error);
      });
  }

  quieroJugar = () => {
    let value = this.state.quieroJugar ? 0 : 1;
    this.setState({'quieroJugar':!this.state.quieroJugar});
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'setJuegoBiblioteca', id: this.state.id_juego, state: 'quieroJugar', value: value, accessToken:this.state.accessToken})
    })
      .catch((error) => {
        console.log(error);
      });
  }

  enBiblioteca = () => {
    let value = this.state.enBiblioteca ? 0 : 1;
    this.setState({'enBiblioteca':!this.state.enBiblioteca});
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({op:'setJuegoBiblioteca', id: this.state.id_juego, state: 'enBiblioteca', value: value, accessToken:this.state.accessToken})
    })
      .catch((error) => {
        console.log(error);
      });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  main: {
    flex: 1,
    backgroundColor: '#f3f1f1',
    paddingVertical: 20,
  },
  mainWrap: {
    paddingHorizontal: 20,
  },
  cabecera: {
    backgroundColor:'#0277bd',
    height:150,
  },
  imageJuego: {
    width:150,
    height:150,
    position:'absolute',
    top:30,
    left:20,
  },
  btnCrearPartida: {
    width:100,
    height:100,
    position:'absolute',
    top:90,
    right:0,
  }
  , 
  btn: {
    borderWidth:2,
    borderColor:'#0277bd',
    borderRadius:5,
    flexDirection:'row',
    padding:15,
    alignItems:'center',
    width:150
  },
  btnInactive: {
    backgroundColor:'transparent',
  },
  btnActive: {
    backgroundColor:'#0277bd',
  },
  txtBtnActive: {
    color:'white',
  },
  txtBtnInactive: {
    color:'#0277bd',
  },
  descripcion: {
    marginTop:30,
  },
  creditos: {
    marginTop:30,
  },
  credito: {
    marginBottom:5,
  },
  creditoTitle: {
    fontSize:14,
  },
  creditoValue: {
    fontSize:12,
  },
  seccion: {
    marginTop:20,
  },
  seccionTitle: {
    fontSize:18,
    marginBottom:7,
  },
  seccionDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  seccionData: {
    fontSize:12,
    width:'50%',
    marginBottom:5,
  },
});

export default Juego;