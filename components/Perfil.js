import React from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, Alert, Image, ActivityIndicator } from 'react-native';
import { Text, TouchableRipple, Title, Avatar } from 'react-native-paper';
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
        uid: '',
        user:null,
        medallas: [],
        loading: true,
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
                    this.setState({'accessToken':JSON.parse(value)});
                    const uid = this.props.navigation.getParam('id_usuario', '');
                    this.props.navigation.setParams({'id_usuario': ''});
                    // console.log('usuario: '+uid);
                    this.setState({'uid':uid}, this.loadProfile);
                });
            }
        );
    }

    loadProfile = () => {
        if (this.state.uid == '') {
            data = {
                token: this.state.accessToken.token, 
                user: {
                  email: this.state.accessToken.email
                }
              };
        } else {
            data = {
                token: this.state.accessToken.token, 
                user: {
                  email: this.state.accessToken.email
                },
                profile_user: {
                    id: this.state.uid
                }
              };

        }
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
                    'user': response.profile_user,
                    'avatar': response.profile_user.photo_url,
                    'medallas': response.achivements,
                    'loading':false,
                });
            }
          });
    }

    render() {
        if (this.state.loading) {
            return (
              <View style={[styles.container,{justifyContent:'center'}]}><ActivityIndicator size="large" /></View>
            );
          }
        //   console.log(this.state.medallas);
          return (
            <View style={styles.container}>
                {this.state.uid == '' ?
                    (<Header title="Perfil" hideBack={true} onEditarMiPerfil={this.editarMiPerfil} />)
                    :
                    (<Header title="Perfil" hideBack={true} onAddAmigo={this.addAmigo}/>)
                }
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
                        <TouchableRipple onPress={this.enDesarrollo} style={{flex:1}}>
                            <View style={styles.botonSuperior}>
                            <Image source={require('../assets/amigos.png')} style={styles.botonSuperiorIcon} />
                            <Text style={styles.botonSuperiorText}>Amigos</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                    <View style={styles.container}>
                        <Image source={ (this.state.user.bg_image_url != '') ? { uri: this.state.user.bg_image_url } : require('../assets/bannerPerfil.jpg')} style={styles.banner} resizeMode="cover"/>
                        <TouchableHighlight onPress={this.changeAvatar} style={styles.avatarWrapper}>
                            <Avatar.Image size={150} source={ this.state.avatar ? { uri: this.state.avatar + '?' + new Date() } : require('../assets/avatarPerfil.png') } />
                        </TouchableHighlight>
                    </View>
                    <Title style={styles.nombreUsuario}>{this.state.user.username}</Title>
                    <Text style={styles.sloganUsuario}>{this.state.user.title}</Text>
                    <View style={styles.ubicacion}>
                        <IconButton icon="map-marker" color="black" size={20} style={styles.ubicacionIcon}></IconButton>
                        <Text style={styles.ubicacionText}>{this.state.user.city}, {this.state.user.id_country}</Text>
                    </View>
                    <View style={styles.estadisticas}>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>{this.state.user.num_battles}</Text>
                            <Text style={styles.estadisticasLabel}>Partidas jugadas</Text>
                        </View>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>{this.state.user.num_games}</Text>
                            <Text style={styles.estadisticasLabel}>Juegos</Text>
                        </View>
                        <View style={styles.estadisticasData}>
                            <Text style={styles.estadisticasValue}>{this.state.user.num_friends}</Text>
                            <Text style={styles.estadisticasLabel}>Amigos</Text>
                        </View>
                    </View>
                    <View style={styles.dobleColumna}>
                        <View style={styles.columna80}>
                            <Text style={styles.tituloApartado}>Acerca de mí</Text>
                            <Text style={styles.textoApartado}>{this.state.user.about_me}</Text>
                        </View>
                        <View style={styles.columna20}>
                            <Text style={styles.tituloApartado}>Medallas</Text>
                            {this.state.medallas.map((medalla) => 
                                <Image key={medalla.id} source={{ uri: medalla.image_url }} style={styles.medalla}/>                            
                            )}
                            {/* <Image source={require('../assets/medallaPerfil.png')} style={styles.medalla}/> */}
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
        //TODO
      }

    editarMiPerfil = () => {
        Alert.alert(
            'A desarrollar...'
        );
        //TODO
    }

    addAmigo = () => {
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/followUser',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: this.state.accessToken.token, 
              user: {
                  email: this.state.accessToken.email
              },
              follow_user: {
                id: this.state.uid, 
              }
            })
          })
          .then((response) => response.json())
          .then((response) => {
            // console.log(response);
            if (response.result == 'OK') {
              Alert.alert('Solicitud enviada!');
            } else {
              Alert.alert('Error: Solicitud no procesada!');
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }

    changeAvatar = async () => {
        if (this.state.uid != '') {
            // console.log('no permiso');
            return; //solo perfil propio
        }
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
                  console.log(response);
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
        position:'absolute',
        top:0,
        width:'100%',
    },
    avatarWrapper: {
        alignSelf:'center',
        width:150,
        height:150,
        marginTop:70,
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
        width:44,
        height:44
    }
});
  
export default withNavigation(Perfil);