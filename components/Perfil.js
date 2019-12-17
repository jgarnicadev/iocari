import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, TouchableHighlight, Alert, Image, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { IconButton } from 'react-native-paper';

import Header from './Header';
import Footer from './Footer';

class Perfil extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
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
                    this.setState({'accessToken':JSON.parse(value)});
                });
            }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title="Perfil" hideBack={true} />
                <ScrollView style={styles.main}>
                    <View style={styles.botoneraSuperior}>
                        <TouchableHighlight onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/misPartidas.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mis Partidas</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/miEstanteria.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mi estantería</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Amigos</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Image source={require('../assets/bannerPerfil.jpg')} style={styles.banner} />
                    <Image source={require('../assets/avatarPerfil.jpg')} style={styles.avatar} />
                    <Text style={styles.nombreUsuario}>Sideshow Bob</Text>
                    <Text style={styles.sloganUsuario}>App Pioneer</Text>
                    <View style={styles.ubicacion}>
                        <IconButton icon="map-marker" color="black" size={20} style={styles.ubicacionIcon}></IconButton>
                        <Text style={styles.ubicacionText}>Madrid, España</Text>
                    </View>
                    <View style={styles.estadisticas}>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>80</Text>
                            <Text style={styles.estadisticasLabel}>Partidas jugadas</Text>
                        </View>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>9</Text>
                            <Text style={styles.estadisticasLabel}>Juegos</Text>
                        </View>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>40</Text>
                            <Text style={styles.estadisticasLabel}>Amigos</Text>
                        </View>
                    </View>
                    <View style={styles.dobleColumna}>
                        <View style={styles.columna80}>
                            <Text style={styles.tituloApartado}>Acerca de mí</Text>
                            <Text style={styles.textoApartado}>Ut porttitor non ante at lacinia. Morbi sed volutpat risus, id mollis tortor. Donec congue urna et ipsum aliquet tempus. Proin finibus ante mi, eget vestibulum nunc dapibus ut. Sed imperdiet dolor nec tempor fermentum. Praesent at ultrices augue, sit amet mollis quam. Cras hendrerit vestibulum dignissim. Cras ac sapien sapien. Ut quis urna eros. Quisque nisl enim, semper et porta non, ultricies vitae turpis. Nullam tempus vitae magna a venenatis. Maecenas magna est, sodales at dui at, sollicitudin placerat velit.

                            Praesent convallis semper sagittis. Fusce id vestibulum lorem. Nullam nec augue velit.</Text>
                        </View>
                        <View style={styles.columna20}>
                            <Text style={styles.tituloApartado}>Medallas</Text>
                            <Image source={require('../assets/medallaPerfil.png')} style={styles.medalla}/>
                            <Image source={require('../assets/medallaPerfil.png')} style={styles.medalla}/>
                            <Image source={require('../assets/medallaPerfil.png')} style={styles.medalla}/>
                        </View>
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
      }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent:'flex-start',
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
        paddingVertical:30,
    },
    botonSuperiorText: {
        marginTop:8,
        color:'white',
    },
    banner: {
        width:'100%',
    },
    avatar: {
        alignSelf:'center',
        width:200,
        height:200,
        marginTop:-100,
        marginBottom:10,
    },
    nombreUsuario: {
        fontSize:17,
        fontWeight:'bold',
        alignSelf:'center',
        color:'#0277bd',
    },
    sloganUsuario: {
        alignSelf:'center',
        marginTop:5,
    },
    ubicacion: {
        alignSelf:'center',
        marginTop:5,
        flexDirection:'row',
        alignItems:'center',
    },
    ubicacionIcon: {
        margin:0,
    },
    ubicacionText: {

    },
    estadisticas: {
        marginTop:20,
        flexDirection:'row',
    },
    estadisticasData: {
        borderWidth:1,
        borderColor:'#ccc',
        alignItems:'center',
        flex:1,
        paddingVertical:5,
    },
    estadisticasValue: {
        color:'#0277bd',
        fontSize:19,
    },
    dobleColumna: {
        padding:20,
        flexDirection:'row',
    },
    columna80: {
        width:'80%',
    },
    columna20: {
        width:'20%',
    },
    tituloApartado: {
        fontSize:19,
        marginBottom:5,
    },
    textoApartado: {
        lineHeight:18,
        textAlign:'justify',
    },
    medalla: {
        alignSelf:'center',
    }
});
  
export default withNavigation(Perfil);