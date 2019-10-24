import React from 'react';
import { View, StyleSheet, Image, TextInput, Alert, ScrollView, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';

import Header from './Header';
import Footer from './Footer';

import CarruselJuegos from './CarruselJuegos';

class Biblioteca extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
          },
          recomendaciones: [],
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
            this.cargarRecomendaciones();
        });
        }
    );
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
            if (response.result == 'OK') {
                this.setState({'recomendaciones':response.games});
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
          
    render() {
        return (
            <View style={styles.container}>
                <Header title="Biblioteca" hideBack={true} />
                {/* <View style={styles.buscador}>
                    <View style={styles.buscadorInputWrap}>
                        <Image source={require('../assets/icon-search.png')} style={styles.buscadorIcon} />
                        <TextInput style={styles.buscadorInput} placeholder="Buscar Juegos" onSubmitEditing={this.submitSearch}/>
                    </View>
                </View> */}
                <View style={styles.main}>
                  <ScrollView style={styles.mainWrap}>
                    <CarruselJuegos title="Tus Recomendaciones" msgEmpty="" juegos={this.state.recomendaciones} />
                  </ScrollView>
                </View>
                <Footer activo="biblioteca" />
            </View>
        );
    }

    submitSearch = () => {
        Alert.alert(
            'En desarrollo...'
          );
          //TODO    
    }

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
    buscadorInputWrap: {
        backgroundColor:'white',
        flexDirection:'row',
        borderRadius:5,
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
    }
});
  
export default withNavigation(Biblioteca);