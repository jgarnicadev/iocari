import React from 'react';
import { StyleSheet, View, Image, Button, TextInput, Text, Switch, ScrollView, Alert, AsyncStorage, TouchableHighlight, FlatList, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { TextInput as TextInputPaper, Dialog, Portal, Searchbar, IconButton, Snackbar } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import TimePicker from "react-native-24h-timepicker";
import * as ImageManipulator from 'expo-image-manipulator';

import Header from './Header';

class CrearPartidaPage extends React.Component {
  searchWaiting = null;
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
    filterJuegos: [],
    proximasFechas: [],
    fechaCalendar: '-',
    loadingBusquedaJuegos: false,
    snackbarVisible: false,
    snackbarText: '',
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
    this.loadToday();
    this.loadProximasFechas();
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          this.setState({'accessToken':JSON.parse(value)});
          this.clearDataForm();
          this.loadJuegos();
        });
      }
    );
  }

  clearDataForm = () => {
    this.setState({
      'image': null,
      'imageBase64': '',
      'nombre': '',
      'juegos': [],
      'fecha': this.state.today,
      'hora': '',
      'duracion': '',
      'tope_apuntarse': '',
      'lugar': '',
      'players': '',
      'descripcion': '',
      'privada': true,
      'controlar_solicitudes': false,
      'selectorJuegosVisible': false,
      'todosJuegos': [],
      'filterJuegos': [],
      'fechaCalendar': '-'
    });
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
    this.setState({'today': str});
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
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGames',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
            email: this.state.accessToken.email
          }
        })
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        var j = [];
        response.games.forEach(juego => {
          var t = {
            key: String(juego.id),
            nombre: juego.name
          }
          j.push(t);
        });
        this.setState({'todosJuegos':j});
        this.setState({'filterJuegos':j});
      }
    })
    .catch((error) => {
        console.log(error);
    });
  }
  
  seleccionJuego(idJuego) {
    this.ocultarJuegosSelect();
    var temp = this.state.juegos;
    this.state.filterJuegos.forEach(el => {
      if (el.key == idJuego) {
        temp.push(el);
      }
    })
    this.setState({'juegos':temp});
  }

  quitarJuego = (keyJuego) => {
    var temp = this.state.juegos;
    this.state.juegos.forEach((el,i) => {
      if (el.key == keyJuego) {
        temp.splice(i, 1);
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
    /*let data = {
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
    var dataStr = JSON.stringify(data);*/
    var pattern_fecha = /(\d{2})\/(\d{2})\/(\d{4})/;
    var str_date = this.state.fecha.replace(pattern_fecha,'$3-$2-$1') + 'T' + this.state.hora;
    var init_date = new Date(str_date);
    var end_date = new Date(str_date);
    init_date = init_date.toJSON().slice(0, 19).replace('T', ' ');
    var duracion = parseInt(this.state.duracion);
    if (!isNaN(duracion)) {
      end_date.setHours(end_date.getHours() + duracion);
    }
    end_date = end_date.toJSON().slice(0, 19).replace('T', ' ');
    str_date = this.state.fecha.replace(pattern_fecha,'$3-$2-$1') + 'T' + this.state.tope_apuntarse;
    var join_date = new Date(str_date);
    join_date = join_date.toJSON().slice(0, 19).replace('T', ' ');
    var games = [];
    this.state.juegos.forEach(juego => {
      var id_game = parseInt(juego.key);
      games.push(id_game);
    });
    let data2 = {
      token: this.state.accessToken.token, 
      user: {
        email: this.state.accessToken.email, 
      },
      battle: {
        name: this.state.nombre,
        init_date: init_date,
        end_date: end_date,
        join_date: join_date,
        description: this.state.descripcion,
        num_players: this.state.players,
        address: this.state.lugar,
        games: games,
        private: this.state.privada ? 1:0,
        request_join: this.state.controlar_solicitudes ? 1:0
      }
    }
    var dataStr2 = JSON.stringify(data2);
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/newBattle',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: dataStr2
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.result == 'OK') {
        if (this.state.imageBase64 != '') {
          //subir imagen
          fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/uploadBattleImage',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: this.state.accessToken.token, 
              user: {
                email: this.state.accessToken.email
              },
              image: {
                  mime:"image/jpeg",
                  data: this.state.imageBase64
              },
              battle: {
                id: response.battle.id
              }
            })
          })
          .then((response) => response.json())
          .then((response) => {
            //console.log(response);
            if (response.result == 'OK') {
              Alert.alert('Partida Creada');
              this.props.navigation.navigate('home');  
            } else if (response.result == 'NOK') { 
              Alert.alert('Error en creación partida, problema en subida imagen');
            }
          })
        } else {
          Alert.alert('Partida Creada');
          this.props.navigation.navigate('home');  
        }
      } else if (response.result == 'NOK') { 
        Alert.alert('Error en creación partida, datos incorrectos');
      }
    });
  }

  handleBack = () => {
    this.props.navigation.navigate('home');  
  }

  
  render() {
    let { image } = this.state;
    return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" enabled>
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
            <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-start', flexWrap: 'wrap'}}>
              {this.state.juegos.map((elem) => 
                <View key={elem.key} style={[styles.juegoSeleccionado,{flexDirection:'row',justifyContent:'flex-start', flexWrap: 'wrap', alignItems:'center'}]}>
                  <Text style={{color:'white'}}>{elem.nombre}</Text>
                  <TouchableHighlight onPress={() => this.quitarJuego(elem.key)}>
                    <Text style={[styles.quitarJuego,{color:'white'}]}>X</Text>
                  </TouchableHighlight>
                </View>
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
                <IconButton icon="calendar-multiselect" size={20} color={this.state.fecha==this.state.fechaCalendar?'white':'#7C7C7C'} style={{padding:0, margin:0}}/>
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
              <View style={(this.state.fechaCalendar=='-' && this.state.fecha==this.state.today)?[styles.botonCarruselDiaPartida,{backgroundColor:'#F50057'}]:styles.botonCarruselDiaPartida}>
                <Text style={[(this.state.fechaCalendar=='-' && this.state.fecha==this.state.today)?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>¡HOY!</Text>  
              </View>
            </TouchableHighlight>
            {this.state.proximasFechas.map((elem) => 
              <TouchableHighlight key={elem.fecha} onPress={() => this.selectFechaProx(elem.fechaFormat)}>
                <View style={(this.state.fechaCalendar=='-' && this.state.fecha==elem.fechaFormat)?[styles.botonCarruselDiaPartida,{backgroundColor:'#F50057'}]:styles.botonCarruselDiaPartida}>
                  <Text style={[(this.state.fechaCalendar=='-' && this.state.fecha==elem.fechaFormat)?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>{elem.diaSemana}</Text>  
                  <Text style={[(this.state.fechaCalendar=='-' && this.state.fecha==elem.fechaFormat)?{color:'white'}:{color:'#7C7C7C'},{fontSize:14}]}>{elem.fecha}</Text>  
                </View>
              </TouchableHighlight>
            )}
          </ScrollView>
          <View style={styles.fondoOscuro}>
            <Text style={styles.textoOscuro}>¿A qué hora empieza?</Text>
            <TextInput style={styles.inputTextOscuro} placeholder="hh:mm"
            onChangeText={(text) => this.setState({hora: text})}
            value={this.state.hora}
            onFocus={this.showTimePickerHora}
            />
          </View>
          <TimePicker
            ref={ref => {
              this.TimePickerHora = ref;
            }}
            onCancel={() => this.onCancelTimePickerHora()}
            onConfirm={(hour, minute) => this.onConfirmTimePickerHora(hour, minute)}
          />       
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
            onFocus={this.showTimePickerTope}
            />
          </View>
          <TimePicker
            ref={ref => {
              this.TimePickerTope = ref;
            }}
            onCancel={() => this.onCancelTimePickerTope()}
            onConfirm={(hour, minute) => this.onConfirmTimePickerTope(hour, minute)}
          />       
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
                 data={this.state.filterJuegos}
                 extraData={this.state.filterJuegos}
                 renderItem={({item}) => <TouchableHighlight onPress={() => this.seleccionJuego(item.key)}><Text style={styles.listJuegosText}>{item.nombre}</Text></TouchableHighlight>}
                 ItemSeparatorComponent={() => <View style={styles.listJuegosSeparator}/>}
                 ListHeaderComponent={this.headerListJuegos}                             
                />
              </Dialog.Content>
          </Dialog>
        </Portal>
        <Snackbar visible={this.state.snackbarVisible} onDismiss={() => this.setState({ snackbarVisible: false })}>{this.state.snackbarText}</Snackbar>
      </View>
      </KeyboardAvoidingView>
    );
  }
  _pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (!result.cancelled) {
        let resizedImage = await ImageManipulator.manipulateAsync(
          result.uri,
          [{resize : {width: 400, height: 300}}],
          {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true}
        );
        let resizedUri = 'data:image/jpg'+ ';base64,' + resizedImage.base64;
        this.setState({ image: result.uri, imageBase64: resizedUri });
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

  headerListJuegos = () => {
    return ( 
      <View style={{flex:1}}>
        <Searchbar        
          placeholder="Buscar juego..."        
          onChangeText={text => {
            if (this.searchWaiting) {
              clearTimeout(this.searchWaiting);
            }
            this.searchWaiting = setTimeout(() => {
              this.searchWaiting = null;
              this.filterJuego(text);
            }, 500);
          }}
        />    
        {this.state.loadingBusquedaJuegos ? (
          <View style={{flex:1,justifyContent:'center', marginTop:5}}><ActivityIndicator size="large" /></View>
        ) : null}
      </View>
    ); 
  }

  filterJuego = text => {   

    /*let arrayHolder = this.state.todosJuegos; 
    const newData = arrayHolder.filter(item => {      
      const itemData = `${item.nombre.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;    
    });*/

    if (text.length < 3 ) {
      // si la busqueda es de menos de tres caracteres cargamos todos los juegos
      const newData = this.state.todosJuegos; 
      this.setState({ filterJuegos: newData });  
    } else {
      // si la busqueda es de minimo tres caracteres, llamamos a endpoint busqueda
      //loading
      this.setState({ 
        loadingBusquedaJuegos: true,
        filterJuegos: [] ,
        snackbarVisible: false
      });  
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGames',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
            email: this.state.accessToken.email
          },
          filters: {
            keywords: text
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.result == 'OK') {
          var j = [];
          response.games.forEach(juego => {
            var t = {
              key: String(juego.id),
              nombre: juego.name
            }
            j.push(t);
          });
          this.setState({'filterJuegos':j});
        } else {
          //si endpoint nos devuelve error mostrar todo el listado de juegos
          const newData = this.state.todosJuegos; 
          this.setState({ filterJuegos: newData });      
          //notificacion visual del error
          this.setState({
            'snackbarText': response.message,
            'snackbarVisible': true,
          });
        }
        this.setState({ loadingBusquedaJuegos: false});
      })
      .catch((error) => {
          console.log(error);
      });
    }
  };

  showTimePickerHora = () => {
    this.TimePickerHora.open();
  }

  onCancelTimePickerHora() {
    this.TimePickerHora.close();
  }
 
  onConfirmTimePickerHora(hour, minute) {
    if (hour.length == 1) hour = '0'+hour;
    this.setState({ hora: `${hour}:${minute}` });
    this.TimePickerHora.close();
  }

  showTimePickerTope = () => {
    this.TimePickerTope.open();
  }

  onCancelTimePickerTope() {
    this.TimePickerTope.close();
  }
 
  onConfirmTimePickerTope(hour, minute) {
    if (hour.length == 1) hour = '0'+hour;
    this.setState({ tope_apuntarse: `${hour}:${minute}` });
    this.TimePickerTope.close();
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
    marginTop:5,
  },
  botonCarruselDiaPartida: {
    backgroundColor:'white',
    height:75,
    justifyContent:'center',
    alignItems:'center',
    // paddingHorizontal:30,
    width:100,
  },
  quitarJuego: {
    fontSize:23,
    marginLeft:10,
  }
});

export default withNavigation(CrearPartidaPage);