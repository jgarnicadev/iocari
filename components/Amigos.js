import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';
import ListadoUsuarios from './ListadoUsuarios';

class Amigos extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        loading: true,
        amigos: [],
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
            console.log(response);
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
                    <ListadoUsuarios title="Amigos" msgEmpty="Aún no tienes ningun amigo añadido!" usuarios={this.state.amigos} />
                    </View>
                </ScrollView>
                <Footer activo="perfil" />
            </View>
        );
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
  
export default withNavigation(Amigos);