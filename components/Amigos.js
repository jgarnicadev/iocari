import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import { Text, TouchableRipple, IconButton, Searchbar } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';
import ListadoUsuarios from './ListadoUsuarios';

class Amigos extends React.Component {
    searchWaiting = null;
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        loading: true,
        amigos: [],
        filterAmigos: null,
        loadingBusqueda: false,
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
                    this.setState({
                        'accessToken':JSON.parse(value),
                        'filterAmigos': null,
                        'loadingBusqueda': false,
                    }, this.cargarDatos);
                });
            }
        );
    }

    cargarDatos = () => {
        this.getMyFriends();
    }

    getMyFriends = () => {
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyFriends',{
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
                this.setState({
                    'amigos':response.users,
                    'loading':false,
                });
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
          return (
            <View style={styles.container}>
                <Header title="Amigos" hideBack={true} headerPerfil={true} hideTitle={true}/>
                <ScrollView style={styles.main}>
                    <View style={styles.botoneraSuperior}>
                        <TouchableRipple onPress={() => this.props.navigation.navigate('misPartidas')} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/misPartidas.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mis Partidas</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => this.props.navigation.navigate('estanteria')} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/miEstanteria.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mi estantería</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={this.nada} style={{flex:1}}>
                            <View style={styles.botonSuperiorActive}>
                            <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorActiveText}>Amigos</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                    <View style={{
                        padding:20,
                    }}>
                    <Searchbar        
                        placeholder="Buscar amigos"        
                        onChangeText={text => {
                            if (this.searchWaiting) {
                            clearTimeout(this.searchWaiting);
                            }
                            this.searchWaiting = setTimeout(() => {
                                this.searchWaiting = null;
                                this.searchUsers(text);
                            }, 500);
                        }}
                    />    
                    {this.state.filterAmigos != null ?
                        this.state.loadingBusqueda ? 
                            (<ActivityIndicator size="small" />)
                            :
                            (<ListadoUsuarios title="Resultados busqueda" msgEmpty="No se han encontrado usuarios" usuarios={this.state.filterAmigos} />)
                        :
                        null
                    }
                    <View style={{
                        position:'relative',
                        marginTop:20,
                    }}>
                        <ListadoUsuarios title="Amigos" msgEmpty="Aún no tienes ningun amigo añadido!" usuarios={this.state.amigos} />
                        <IconButton 
                            onPress={() => this.props.navigation.navigate('invitarAmigos')}
                            icon="account-card-details"
                            size={20}
                            color="#7c7c7c"
                            style={{
                                position:'absolute',
                                right:10,
                                top:0
                            }}
                        />
                    </View>
                    </View>
                </ScrollView>
                <Footer activo="perfil" />
            </View>
        );
    }

    searchUsers = text => {   

        if (text.length < 3 ) {
          // si la busqueda es de menos de tres caracteres sin busqueda
          this.setState({ filterAmigos: null });  
        } else {
          // si la busqueda es de minimo tres caracteres, llamamos a endpoint busqueda
          //loading
          this.setState({ 
            loadingBusqueda: true,
            filterAmigos: [] ,
          });  
          fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyFriends',{
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
              this.setState({'filterAmigos':response.users});
            }
            this.setState({ loadingBusqueda: false});
          })
          .catch((error) => {
              console.log(error);
          });
        }
    };

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
  });
  
export default withNavigation(Amigos);