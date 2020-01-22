import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, Alert, Image } from 'react-native';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { IconButton } from 'react-native-paper';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import Header from './Header';
import Footer from './Footer';

class Perfil extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        avatar: null,
        avatarBase64: '',
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
                        <TouchableRipple onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/misPartidas.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mis Partidas</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/miEstanteria.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Mi estantería</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Amigos</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                    <Image source={require('../assets/bannerPerfil.jpg')} style={styles.banner} resizeMode="cover"/>
                    <TouchableHighlight onPress={this.changeAvatar} style={styles.avatarWrapper}>
                        <Image source={ this.state.avatar ? { uri: this.state.avatar } : require('../assets/avatarPerfil.png') } style={styles.avatar} resizeMode="cover" />
                    </TouchableHighlight>
                    <Title style={styles.nombreUsuario}>Sideshow Bob</Title>
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

    changeAvatar = async () => {
        const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
          });
          if (!result.cancelled) {
            // let resizedUri = await new Promise((resolve, reject) => {
            //     ImageEditor.cropImage(result.uri,
            //       {
            //         offset: { x: 0, y: 0 },
            //         size: { width: result.width, height: result.height },
            //         displaySize: { width: 180, height: 180 },
            //         resizeMode: 'contain',
            //       },
            //       async (uri) => {
            //         console.log(uri);
            //         let base64Data = await FileSystem.readAsStringAsync(uri, {
            //             encoding: FileSystem.EncodingType.Base64
            //         });
            //         resolve('data:image/jpg'+ ';base64,' + base64Data);
            //       },
            //       () => reject(),
            //     );
            // });
            let resizedImage = await ImageManipulator.manipulateAsync(
                result.uri,
                [{resize : {width: 180, height: 180}}],
                {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true}
            );
            let resizedUri = 'data:image/jpg'+ ';base64,' + resizedImage.base64;
            this.setState({ avatar: result.uri, avatarBase64: resizedUri });
            //llamada a endpoint
            fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/uploadUserImage',{
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
                      data: resizedUri
                  }
                })
              })
              .then((response) => response.json())
              .then((response) => {
                  if (response.result == 'OK') {
                  }
              })
              .catch((error) => {
                console.log(error);
            });
          }
        } else {
          Alert.alert('Se necesita permiso para acceder a tu camera roll');
        }
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
    botonSuperiorText: {
        color:'white',
    },
    bannerWrapper: {
        height:170,
    },
    banner: {
        height:170,
    },
    avatarWrapper: {
        alignSelf:'center',
        width:150,
        height:150,
        marginTop:-100,
        marginBottom:0,
        padding:0,
    },
    avatar: {
        width:150,
        height:150,
        padding:0,
    },
    nombreUsuario: {
        alignSelf:'center',
        color:'#0277bd',
        margin:0,
        padding:0,
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
        paddingVertical:2,
    },
    estadisticasValue: {
        color:'#0277bd',
        fontSize:18,
        lineHeight:20,
    },
    estadisticasLabel: {
        fontSize:12,
        lineHeight:12
    },
    dobleColumna: {
        padding:20,
        flexDirection:'row',
    },
    columna80: {
        width:'75%',
    },
    columna20: {
        width:'25%',
    },
    tituloApartado: {
        fontSize:15,
        marginBottom:5,
    },
    textoApartado: {
        fontSize:13,
        lineHeight:18,
        textAlign:'justify',
    },
    medalla: {
        alignSelf:'center',
    }
});
  
export default withNavigation(Perfil);