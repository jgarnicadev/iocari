import React from 'react';
import { withNavigation } from 'react-navigation';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert, TouchableHighlight, AsyncStorage } from 'react-native';
import { Headline, List, TextInput, Button, IconButton, Text  } from 'react-native-paper';

import Header from './Header';

class InvitarAmigos extends React.Component {
    state = {
        accessToken: {
            token: '',
            email: ''
        },
        email: '',
        mensaje: '',
        emails: [],
    };

    async getAccessToken() {
        const data =  await AsyncStorage.getItem('accessToken');
        return data;
    }

    componentDidMount() {
        this.props.navigation.addListener(
          'didFocus',
          payload => {
            this.setState({
                email: '',
                mensaje: '',
                emails: [],
            });
            this.getAccessToken().then( value => {
                this.setState({
                    'accessToken':JSON.parse(value),
                });
            });
          }
        );
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Header title="Invitar amigos por correo" bgcolor="#A0ADC2"/>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <ScrollView style={styles.main}>
                    <Headline>Invita a tus amigos a unirse</Headline>
                    <List.Section>
                        <List.Item
                            title="Si aceptan, serán agregados a tu lista de amigos"
                            left={() => <List.Icon icon="email-outline" color="white" style={{
                                backgroundColor:"#A0ADC2",
                                borderRadius:50,
                                }}
                            />}
                            titleStyle={{
                                fontSize:20,
                                color:'#aaa',
                            }}
                            titleNumberOfLines={2}
                        />
                    </List.Section>
                    <View>
                        <TextInput 
                            label="E-mail"
                            underlineColor="#A0ADC2"
                            theme={{
                                dark:false,
                                mode:'exact',
                                colors:{
                                    background:'white',
                                    primary:'#A0ADC2',
                                    placeholder:'#A0ADC2',
                                }
                            }}
                            style={{
                                backgroundColor:'white',
                            }}
                            onChangeText={(text) => this.setState({email: text})}
                        />
                        <IconButton 
                            icon="send"
                            color="#A0ADC2"
                            size={30}
                            onPress={this.addEmail}
                            style={{
                                position:'absolute',
                                right:10,
                                top:6,
                            }}
                        />
                        <View style={{
                            marginTop:10,
                            flexDirection:'row',
                            justifyContent:'flex-start',
                            flexWrap: 'wrap'
                        }}>
                        {this.state.emails.map((elem) => 
                            <View key={elem} style={[styles.juegoSeleccionado,{flexDirection:'row',justifyContent:'flex-start', flexWrap: 'wrap', alignItems:'center'}]}>
                            <Text style={{color:'white'}}>{elem}</Text>
                            <TouchableHighlight onPress={() => this.quitarEmail(elem)}>
                                <Text style={[styles.quitarJuego,{color:'white'}]}>X</Text>
                            </TouchableHighlight>
                            </View>
                        )}
                        </View>                        
                    </View>
                    <TextInput 
                        label="Mensaje personal"
                        maxLength={500}
                        multiline={true}
                        numberOfLines={5}
                        theme={{
                            dark:false,
                            mode:'exact',
                            colors:{
                                background:'white',
                                primary:'#A0ADC2',
                                placeholder:'#A0ADC2',
                            }
                        }}
                        style={{
                            backgroundColor:'white',
                            marginTop:20,
                        }}
                        onChangeText={(text) => this.setState({mensaje: text})}
                    />
                </ScrollView>
                </KeyboardAvoidingView>
                <Button
                        mode="contained" color="#f50057"
                        style={{
                            position:'absolute',
                            bottom:20,
                            left:20,
                            right:20
                        }}
                        labelStyle={{
                            fontSize:20,
                        }}
                        contentStyle={{
                            paddingVertical:15,
                        }}
                        onPress={this.submit}
                    >Enviar</Button>
            </View>
        );
    }

    addEmail = () => {
        if (!this.validateEmail(this.state.email)) {
            Alert.alert(
              'El email no tiene un formato correcto'
            );
            return;
        }
        let temp = this.state.emails;
        temp.push(this.state.email);
        this.setState({
            emails: temp,
        })
    }

    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    quitarEmail = (email) => {
        let temp = this.state.emails;
        for( let i = 0; i < temp.length; i++){
            if ( temp[i] === email) { temp.splice(i, 1); }
        }
        this.setState({
            emails: temp,
        })
    }

    submit = () => {
        //al menos un email
        if (this.state.emails.length == 0) {
            Alert.alert(
                'Añade al menos un email de amigos!'
              );
              return;
        }
        let invitations = [];
        this.state.emails.forEach(email => {
            let elem = {
                user: {
                    email: email,
                },
                message: this.state.mensaje,
            }
            invitations.push(elem);
        });
        fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/inviteUsers',{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.state.accessToken.token, 
                user: {
                    email: this.state.accessToken.email
                },
                invitations: invitations,
            })
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.result == 'OK') {
                Alert.alert(
                    'Invitación enviada!'
                );
                this.props.navigation.navigate('amigos');  
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex:1,
        backgroundColor:'#f3f1f1',
        padding:20,
    },
    juegoSeleccionado: {
        marginRight:5,
        backgroundColor:'#084b80',
        color:'white',
        padding:5,
        borderRadius:5,
        marginTop:5,
    },
    quitarJuego: {
        fontSize:23,
        marginLeft:10,
    }
});

export default withNavigation(InvitarAmigos);