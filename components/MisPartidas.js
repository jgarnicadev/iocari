import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, ActivityIndicator, Image, Alert } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes'

import Header from './Header';
import Footer from './Footer';
import CarruselPartidas from './CarruselPartidas';

class MisPartidas extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        loading: true,
        proximasPartidas: [],
        partidasTerminadas: [],
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
                    }, this.cargarDatos);
                });
            }
        );
    }

    cargarDatos = () => {
        this.cargarProximasPartidas();
        this.cargarPartidasTerminadas();
    }

    cargarProximasPartidas = () => {
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyBattles',{
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
                    'proximasPartidas':response.battles,
                    'loading':false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    cargarPartidasTerminadas = () => {
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getMyFormerBattles',{
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
                    'partidasTerminadas':response.battles,
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
                <Header title="Mis Partidas" hideBack={true} headerPerfil={true} hideTitle={true} idUsuario={this.state.uid}/>
                <ScrollView style={styles.main}>
                    <View style={styles.botoneraSuperior}>
                        <TouchableRipple onPress={this.nada} style={{flex:1}}>
                            <View style={styles.botonSuperiorActive}>
                            <Image source={require('../assets/misPartidas.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorActiveText}>Mis Partidas</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => this.props.navigation.navigate('estanteria')} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/miEstanteria.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mi estantería</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => this.props.navigation.navigate('amigos')} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Amigos</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                    <View style={{
                        padding:20,
                    }}>
                        <CarruselPartidas title="Mis Próximas Partidas" msgEmpty="" partidas={this.state.proximasPartidas} />
                        <CarruselPartidas title="Partidas Terminadas" msgEmpty="" partidas={this.state.partidasTerminadas} />
                    </View>
                </ScrollView>
                <Footer activo="perfil" />
            </View>
        );
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
  });
  
export default withNavigation(MisPartidas);