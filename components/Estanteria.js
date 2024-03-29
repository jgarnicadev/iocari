import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, ActivityIndicator, Image, Alert, Share } from 'react-native';
import { Text, TouchableRipple, IconButton } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import * as Linking from 'expo-linking';

import Header from './Header';
import Footer from './Footer';
import ListadoJuegos from './ListadoJuegos';

class Estanteria extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        loading: true,
        juegos: [],
        categorias: [],
        mecanicas: [],
        filterCategoria : null,
        filterMecanica : null,
        uid: '',
        myuid: '',
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
                this.getAccessToken().then( value => {
                    const uid = this.props.navigation.getParam('id_usuario', '');
                    this.props.navigation.setParams({'id_usuario': ''});
                    this.setState({
                        'accessToken':JSON.parse(value),
                        'uid':uid,
                        'filterCategoria':null,
                        'filterMecanica':null,
                    }, this.cargarDatos);
                });
            }
        );
    }

    cargarDatos = () => {
        this.getMyGames();
        this.loadCategorias();
        this.loadMecanicas();
        if (this.state.uid == '') {
            this.loadMyUID();
        }
    }

    getMyGames = () => {
        let body = {
            token: this.state.accessToken.token, 
            user: {
                email: this.state.accessToken.email
            }
        };
        if (this.state.uid != '') {
            body.profile_user = {
                id: this.state.uid
            };
        }
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyGames',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.result == 'OK') {
                this.setState({
                    'juegos':response.games,
                    'loading':false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    loadCategorias = () => {
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyCategories',{
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
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyMechanics',{
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
  
    render() {
        if (this.state.loading) {
            return (
              <View style={[styles.container,{justifyContent:'center'}]}><ActivityIndicator size="large" /></View>
            );
          }
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
          let titleJuegos = "Juegos en mi estantería";
          if (this.state.juegos.length > 0) {
              titleJuegos = this.state.juegos.length + ' ' + titleJuegos;
          }
          return (
            <View style={styles.container}>
                <Header title="Estantería" hideBack={true} headerPerfil={true} hideTitle={true} idUsuario={this.state.uid}/>
                <ScrollView style={styles.main}>
                    {this.state.uid == '' &&
                        <View style={styles.botoneraSuperior}>
                            <TouchableRipple onPress={() => this.props.navigation.navigate('misPartidas')} style={{flex:1}}>
                                <View style={styles.botonSuperior}>
                                <Image source={require('../assets/misPartidas.png')} style={styles.botonSuperiorIcon} />
                                <Text style={styles.botonSuperiorText}>Mis Partidas</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={this.nada} style={{flex:1}}>
                                <View style={styles.botonSuperiorActive}>
                                <Image source={require('../assets/miEstanteria.png')} style={styles.botonSuperiorIcon} />
                                <Text style={styles.botonSuperiorActiveText}>Mi estantería</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => this.props.navigation.navigate('amigos')} style={{flex:1}}>
                                <View style={styles.botonSuperior}>
                                <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                                <Text style={styles.botonSuperiorText}>Amigos</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    }
                    <View style={{
                        padding:20,
                    }}>
                    <View style={styles.filtrosWrapper}>
                      <View style={{flex:1,paddingRight:5}}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        placeholder={{
                          label: 'Todas las Categorías',
                          value: null,
                        }}
                        Icon={() => {
                          return <Chevron size={1.5} color="white" />;
                        }}
                        onValueChange={(value) => this.setState({filterCategoria:value}, this.filtrarJuegos)}
                        items={this.state.categorias}
                      />
                      </View>
                      <View style={{flex:1,paddingLeft:5}}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={stylePicker}
                        placeholder={{
                          label: 'Todas las Mecánicas',
                          value: null,
                        }}
                        Icon={() => {
                          return <Chevron size={1.5} color="white" />;
                        }}
                        onValueChange={(value) => this.setState({filterMecanica:value}, this.filtrarJuegos)}
                        items={this.state.mecanicas}
                      />
                      </View>
                    </View>

                    <View style={{
                        position:'relative',
                    }}>
                        <ListadoJuegos title={titleJuegos} msgEmpty="Aún no tienes ningun juego añadido!" juegos={this.state.juegos} />
                        {this.state.uid == '' && (
                        <IconButton 
                            onPress={this.share}
                            icon="share-variant"
                            size={20}
                            color="#7c7c7c"
                            style={{
                                position:'absolute',
                                right:10,
                                top:0
                            }}
                        />
                        )}
                    </View>

                    </View>
                </ScrollView>
                <Footer activo="perfil" />
            </View>
        );
    }

    loadMyUID = () => {
        let data = {
            token: this.state.accessToken.token, 
            user: {
                email: this.state.accessToken.email
            }
        };
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getProfile',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then((response) => response.json())
          .then((response) => {
            if (response.result == 'OK') {
              this.setState({
                    'myuid': response.profile_user.id,
                });
            }
          });
    }

    share = async () => {
        const url = Linking.makeUrl('estanteria', {uid: this.state.myuid});
        try {
            const result = await Share.share({
              message:
                'iOcari | Te comparto enlace a mi estantería de juegos: ' + url,
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    filtrarJuegos = () => {
        this.setState({'loading':true});
        if (this.state.filterCategoria == null && this.state.filterMecanica == null) {
            this.getMyGames();
            return;
        }
        let filters = {};
        if (this.state.filterCategoria != null) {
          filters['categories'] = [this.state.filterCategoria];
        }
        if (this.state.filterMecanica != null) {
          filters['mechanics'] = [this.state.filterMecanica];
        }
        let body = {
            token: this.state.accessToken.token, 
            user: {
                email: this.state.accessToken.email
            },
            filters: filters
        };
        if (this.state.uid != '') {
            body.profile_user = {
                id: this.state.uid
            };
        }
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyGames',{
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.result == 'OK') {
                this.setState({
                    'juegos':response.games,
                    'loading':false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
  
    enDesarrollo = () => {
        Alert.alert(
        'En desarrollo...'
        );
        //TODO
      }
    
      nada = () => {
      }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex:1,
        backgroundColor:'#f3f1f1',
    },
    botoneraSuperior: {
        flexDirection:'row',
        backgroundColor:'#0277bd',
    },
    botonSuperior: {
        alignItems:'center',
        paddingVertical:20,
    },
    botonSuperiorActive: {
        alignItems:'center',
        paddingVertical:20,
        borderBottomColor:'white',
        borderBottomWidth:5,
        paddingBottom:15,
    },
    botonSuperiorText: {
        color:'white',
    },
    botonSuperiorActiveText: {
        color:'white',
        fontWeight:'bold',
    },
    filtrosWrapper: {
        marginBottom:10,
        flexDirection:'row',
        justifyContent:'space-between'
      },
  });
  
export default withNavigation(Estanteria);