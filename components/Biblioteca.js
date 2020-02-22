import React from 'react';
import { View, StyleSheet, Image, ScrollView, AsyncStorage, TouchableHighlight, Text, FlatList, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Dialog, Portal, Searchbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes'

import Header from './Header';
import Footer from './Footer';

import CarruselJuegos from './CarruselJuegos';

class Biblioteca extends React.Component {
    searchWaiting = null;
    state = {
        accessToken: {
            token: '',
            email: ''
          },
          categorias: [],
          mecanicas: [],
          recomendaciones: [],
          selectorJuegosVisible: false,
          todosJuegos: [],
          filterJuegos: [],
          loadingBusquedaJuegos: false,
          filterCategoria : null,
          filterMecanica : null,
    };

    async getAccessToken() {
        const data =  await AsyncStorage.getItem('accessToken');
        return data;
    }
    
    componentDidMount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.getAccessToken().then( value => {
                    this.setState({'accessToken':JSON.parse(value)});
                    this.setState({
                        'selectorJuegosVisible': false,
                        'todosJuegos': [],
                        'filterJuegos': [],
                        'filterCategoria':null,
                        'filterMecanica':null,
                    })
                    this.loadCategorias();
                    this.loadMecanicas();
                    this.cargarRecomendaciones();
                });
            }
        );
    }

    loadCategorias = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGameCategories',{
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
                let categorias = [];
                response.categories.forEach(elem => {
                    let t = {
                        label: elem.name,
                        value: elem.id
                    }
                    categorias.push(t);
                });
                this.setState({'categorias':categorias});
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    loadMecanicas = () => {
      fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGameMechanics',{
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
                let mecanicas = [];
                response.mechanics.forEach(elem => {
                    let t = {
                        label: elem.name,
                        value: elem.id
                    }
                    mecanicas.push(t);
                });
                this.setState({'mecanicas':mecanicas});
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    cargarRecomendaciones() {
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
            console.log(response);
            if (response.result == 'OK') {
                this.setState({'recomendaciones':response.games});
                this.setState({
                    'todosJuegos':response.games,
                    'filterJuegos':response.games
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
          
    render() {
      let stylePicker = {
        inputAndroid: {
          paddingHorizontal:10,
          paddingVertical:2,
          fontSize:14,
          color:'white',
          fontWeight:'300',
          borderRadius: 4,
          backgroundColor: '#004C8B',
        },
        inputIOS: {
          paddingHorizontal:10,
          paddingVertical:2,
          fontSize:14,
          color:'white',
          fontWeight:'300',
          borderRadius: 4,
          backgroundColor: '#004C8B',
        },
        placeholder: {
          color:'white',
          fontSize:14,
          fontWeight:'300',
        },
        iconContainer: {
          top: 12,
          right: 15,
        },
      };
        return (
            <View style={styles.container}>
                <Header title="Biblioteca" hideBack={true} />
                <View style={styles.buscador}>
                    <TouchableHighlight onPress={this.mostrarJuegosSelect}>
                        <View style={styles.juegosSelect}>
                            <Image source={require('../assets/icon-search.png')} style={styles.juegosSelectIcon} />
                            <Text style={styles.juegosSelectText}>Buscar Juegos</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.main}>
                  <ScrollView style={styles.mainWrap}>
                    <View style={styles.filtrosWrapper}>
                      <View style={{flex:1,paddingRight:5}}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        placeholder={{
                          label: 'Categorías',
                          value: null,
                        }}
                        Icon={() => {
                          return <Chevron size={1.5} color="white" />;
                        }}
                        onValueChange={(value) => this.setState({filterCategoria:value})}
                        items={this.state.categorias}
                      />
                      </View>
                      <View style={{flex:1,paddingLeft:5}}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        placeholder={{
                          label: 'Mecánicas',
                          value: null,
                        }}
                        Icon={() => {
                          return <Chevron size={1.5} color="white" />;
                        }}
                        onValueChange={(value) => this.setState({filterMecanicas:value})}
                        items={this.state.mecanicas}
                      />
                      </View>
                    </View>
                    <CarruselJuegos title="Tus Recomendaciones" msgEmpty="" juegos={this.state.recomendaciones} />
                  </ScrollView>
                </View>
                <Footer activo="biblioteca" />
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
            </View>
        );
    }

    mostrarJuegosSelect = () => {
        this.setState({selectorJuegosVisible:true})
    }
    ocultarJuegosSelect = () => {
        this.setState({selectorJuegosVisible:false})
    }
    seleccionJuego = (idJuego) => {
        this.ocultarJuegosSelect();
        this.props.navigation.navigate('juego', {
            id_juego: idJuego
        });
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
            }
            this.setState({ loadingBusquedaJuegos: false});
          })
          .catch((error) => {
              console.log(error);
          });
        }
      };
              

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent:'flex-start',
    },
    buscador: {
        backgroundColor:'#03a9f4',
        padding:10,
    },
    buscadorIcon: {
        alignSelf:'center',
        marginLeft:15,
        marginRight:5,
    },
    buscadorInput: {
        backgroundColor:'white',
        padding:10,
        fontSize:15,
        borderRadius:5,
    },
    main: {
        flex:1,
        backgroundColor:'#f3f1f1',
        paddingVertical:20,
    },
    mainWrap: {
        paddingHorizontal:15,
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
    filtrosWrapper: {
      marginBottom:10,
      flexDirection:'row',
      justifyContent:'space-between'
    },
});
  
export default withNavigation(Biblioteca);