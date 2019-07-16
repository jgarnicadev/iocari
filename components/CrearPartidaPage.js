import React from 'react';
import { StyleSheet, View, Image, Button, TextInput, Text, Switch, ScrollView, Alert, AsyncStorage, TouchableHighlight, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ImagePicker, Permissions } from 'expo';
import { TextInput as TextInputPaper, Dialog, Portal, withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';

import Header from './Header';

class CrearPartidaPage extends React.Component {
  state = {
    accessToken: '',
    image: null,
    imageBase64: '',
    nombre: '',
    juegos: [],
    fecha: '',
    hora: '',
    duracion: '',
    tope_apuntarse: '',
    lugar: '',
    players: '',
    descripcion: '',
    privada: true,
    controlar_solicitudes: false,
    selectorJuegosVisible: false,
    todosJuegos: [],
    proximasFechas: [],
    fechaCalendar: '-',
  };

  constructor(props) {
    super(props);
    this.publicar = this.publicar.bind(this);
    this.loadJuegos = this.loadJuegos.bind(this);
    this.seleccionJuego = this.seleccionJuego.bind(this);
    this.loadProximasFechas = this.loadProximasFechas.bind(this)
    this.openCalendar = this.openCalendar.bind(this)
    this.fechaSelect = this.fechaSelect.bind(this)
    this.loadToday = this.loadToday.bind(this)
    this.selectFechaHoy = this.selectFechaHoy.bind(this);
    this.selectFechaProx = this.selectFechaProx.bind(this);
  }

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          this.setState({'accessToken':value});
          this.loadJuegos();
        });
      }
    );
    this.loadToday();
    this.loadProximasFechas();
  }

  loadToday() {
    var todayTime = new Date();
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    var str = '';
    if (day < 10) str+= '0';
    str += day + '/';
    if (month < 10) str+= '0';
    str += month + '/';
    str += year;
    this.setState({'today': str,'fecha': str});
  }

  loadProximasFechas() {
    var today = new Date(),
        fechas = [],
        diasSemana = ['DOM.', 'LUN.','MAR.','MIE.','JUE.','VIE.','SAB.'],
        meses = ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'];
    
    for (var i=1;i < 7;i++) {
      today.setDate(today.getDate() + 1); 
      var month = today.getMonth() + 1;
      var day = today.getDate();
      var year = today.getFullYear();
      var str = '';
      if (day < 10) str+= '0';
      str += day + '/';
      if (month < 10) str+= '0';
      str += month + '/';
      str += year;
      var item = {
        diaSemana: diasSemana[today.getDay()],
        fecha: today.getDate() + ' ' + meses[today.getMonth()],
        fechaFormat: str
      }
      fechas.push(item);
    }

    this.setState({'proximasFechas':fechas});

  }

  loadJuegos() {
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
        method: 'POST',
        mode: 'no-cors',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({op:'getJuegos', accessToken:this.state.accessToken})
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var j = [];
      responseJson.forEach(juego => {
        var t = {
          key: juego.id,
          nombre: juego.nombre
        }
        j.push(t);
      });
      this.setState({'todosJuegos':j});
    })
    .catch((error) => {
        console.log(error);
    });
  }
  
  seleccionJuego(idJuego) {
    this.ocultarJuegosSelect();
    var temp = this.state.juegos;
    this.state.todosJuegos.forEach(el => {
      if (el.key == idJuego) {
        temp.push(el);
      }
    })
    this.setState({'juegos':temp});
  }

  openCalendar() {
    this.refs.datepicker.onPressDate()
  }
  fechaSelect(fechasel) {
    this.setState({fecha: fechasel, fechaCalendar: fechasel});
  }
  selectFechaHoy() {
    this.setState({fecha: this.state.today, fechaCalendar: '-'});
  }
  selectFechaProx(fechasel) {
    this.setState({fecha: fechasel, fechaCalendar: '-'});
  }

  publicar() {
    if (
      !this.state.nombre ||
      this.state.juegos.length == 0 ||
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
    let data = {
      op: 'crearPartida',
      accessToken: this.state.accessToken,
      image: this.state.image,
      imageBase64: this.state.imageBase64,
      nombre: this.state.nombre,
      juegos: this.state.juegos,
      fecha: this.state.fecha,
      hora: this.state.hora,
      duracion: this.state.duracion,
      tope_apuntarse: this.state.tope_apuntarse,
      lugar: this.state.lugar,
      players: this.state.players,
      descripcion: this.state.descripcion,
      privada: this.state.privada,
      controlar_solicitudes: this.state.controlar_solicitudes,
    };
    var dataStr = JSON.stringify(data);
    fetch('http://www.afcserviciosweb.com/iocari-api.php',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: dataStr
    })
    .then(() => {
      Alert.alert('Partida Creada');
      this.props.navigation.navigate('home');  
    });
  }

  handleBack = () => {
    this.props.navigation.navigate('home');  
  }

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <Header title="Crear Partida" onBack={this.handleBack} onCrearPartida={this.publicar} />
        <ScrollView>
          <View  style={styles.fondoNormal}>
            {image ?
              <Image source={{ uri: image }} style={styles.image} />
              :
              <Image source={require('../assets/image-partida-default.png')} style={styles.imageDefault} />
            }
            <TouchableHighlight onPress={this._pickImage} style={styles.btnSelectImage}>
              <Text style={styles.btnSelectImageTxt}>Elige una imagen</Text>
            </TouchableHighlight>
          </View>
          <View  style={styles.fondoNormal}>
            <TextInputPaper 
              label="Nombre para la partida" style={styles.input}
              underlineColor="#7C7C7C"
              selectionColor="#7C7C7C"
              onChangeText={(text) => this.setState({nombre: text})}
              value={this.state.nombre}
              theme={{ colors: {primary: '#7C7C7C', placeholder: '#7C7C7C'} }}
              maxLength={100}
            />
            <Text style={styles.textoSmall}>Máx. 100 caracteres</Text>
          </View>
          <View style={[styles.fondoOscuro,{justifyContent:'flex-start'}]}>
            <Image source={require('../assets/ico-juegos.png')} style={styles.iconOscuro} />
            <Text style={styles.textoOscuro}>Juegos</Text>
          </View>
          <View  style={styles.fondoNormal}>
            <TouchableHighlight onPress={this.mostrarJuegosSelect}>
              <View style={styles.juegosSelect}>
                <Image source={require('../assets/icon-search.png')} style={styles.juegosSelectIcon} />
                <Text style={styles.juegosSelectText}>¿Qué juegos tendrás en la partida?</Text>
              </View>
            </TouchableHighlight>
            <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-start'}}>
              {this.state.juegos.map((elem) => 
                <Text key={elem.key} style={styles.juegoSeleccionado}>{elem.nombre}</Text>
              )}
            </View>
          </View>
          <View style={[styles.fondoOscuro,{justifyContent:'flex-start',marginBottom:0}]}>
            <Image source={require('../assets/ico-dia-partida.png')} style={styles.iconOscuro} />
            <Text style={styles.textoOscuro}>Elige el día de la partida</Text>
          </View>
          <ScrollView horizontal="true" style={{marginBottom:5}}>
            <TouchableHighlight onPress={this.openCalendar}>
              <View style={this.state.fecha==this.state.fechaCalendar?[styles.botonCarruselDiaPartida,{backgroundColor:'#F50057'}]:styles.botonCarruselDiaPartida}>
                <Image source={require('../assets/abrir-calendario.png')} />
                <Text style={[this.state.fecha==this.state.fechaCalendar?{color:'white'}:{color:'#7C7C7C'},{fontSize:12}]}>Abrir Calendario</Text> 
                <Text style={[this.state.fecha==this.state.fechaCalendar?{color:'white'}:{color:'#7C7C7C'},{fontSize:12}]}>{this.state.fechaCalendar}</Text>
                <DatePicker
                  style={{display:'none'}}
                  showIcon={false}
                  ref="datepicker"
                  date={this.state.fecha}
                  mode="date"
                  format="DD/MM/YYYY"
                  onDateChange={this.fechaSelect}
                />  
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.selectFechaHoy}>
              <View style={this.state.fecha==this.state.today?[styles.botonCarruselDiaPartida,{backgroundColor:'#F50057'}]:styles.botonCarruselDiaPartida}>
                <Text style={[this.state.fecha==this.state.today?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>¡HOY!</Text>  
              </View>
            </TouchableHighlight>
            {this.state.proximasFechas.map((elem) => 
              <TouchableHighlight key={elem.fecha} onPress={() => this.selectFechaProx(elem.fechaFormat)}>
                <View style={this.state.fecha==elem.fechaFormat?[styles.botonCarruselDiaPartida,{backgroundColor:'#F50057'}]:styles.botonCarruselDiaPartida}>
                  <Text style={[this.state.fecha==elem.fechaFormat?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>{elem.diaSemana}</Text>  
                  <Text style={[this.state.fecha==elem.fechaFormat?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>{elem.fecha}</Text>  
                </View>
              </TouchableHighlight>
            )}
          </ScrollView>
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
            <Button title="Publicar" color="#f50057" onPress={this.publicar}/>
          </View>
        </ScrollView>
        <Portal>
          <Dialog visible={this.state.selectorJuegosVisible} onDismiss={this.ocultarJuegosSelect}>
              <Dialog.Content>
                <FlatList
                 style={{height:200}}
                 data={this.state.todosJuegos}
                 extraData={this.state.todosJuegos}
                 renderItem={({item}) => <TouchableHighlight onPress={() => this.seleccionJuego(item.key)}><Text style={styles.listJuegosText}>{item.nombre}</Text></TouchableHighlight>}
                 ItemSeparatorComponent={() => <View style={styles.listJuegosSeparator}/>}
                />
              </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
    );
  }
  _pickImage = async () => {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true
      });


      if (!result.cancelled) {
        this.setState({ image: result.uri, imageBase64: result.base64 });
      }
    } else {
      Alert.alert('Se necesita permiso para acceder a tu camera roll');
    }
  };

  mostrarJuegosSelect = () => {
    this.setState({selectorJuegosVisible:true})
  }
  ocultarJuegosSelect = () => {
    this.setState({selectorJuegosVisible:false})
  }
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
  input: {
    backgroundColor: 'white',
    padding:10,
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
  iconOscuro: {
    marginRight:10,
  },
  textoOscuro: {
    fontSize:15,
    color:'#7C7C7C',
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
  image: {
    width: 200, 
    height: 200, 
    alignSelf: 'center',
  },
  imageDefault: {
    alignSelf: 'center',
  },
  btnSelectImage: {
    alignSelf:'center',
    marginTop:20,
  },
  btnSelectImageTxt: {
    color:'#7c7c7c',
  },
  textoSmall: {
    fontSize:13,
    color:'#7C7C7C',
  },
  juegosSelect: {
    backgroundColor:'white',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:17,
    paddingHorizontal:15,
    borderRadius:5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    
    elevation: 4,
  },
  juegosSelectIcon: {
    marginRight:15,
  },
  juegosSelectText: {
    fontSize:15,
    color:'#7C7C7C',
  },
  listJuegosText: {
    paddingVertical:17,
    paddingHorizontal:10,
    fontSize:15,
    color:'#7C7C7C',
  },
  listJuegosSeparator: {
    height:1,
    backgroundColor:'#7C7C7C',
  },
  juegoSeleccionado: {
    marginRight:5,
    backgroundColor:'#084b80',
    color:'white',
    padding:5,
    borderRadius:5,
  },
  botonCarruselDiaPartida: {
    backgroundColor:'white',
    height:75,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:30,
  }
});

export default withNavigation(CrearPartidaPage);