import React from 'react';
import { View, TouchableOpacity, AsyncStorage, StyleSheet, Alert } from 'react-native';
import { Drawer } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class Menu extends React.Component {

    closeSession = () => {
        AsyncStorage.removeItem('accessToken');
        // BackHandler.exitApp();
        this.props.navigation.navigate('login');
    }

    enDesarrollo  = () => {
        Alert.alert('Proximamente');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('home')}>
                    <Drawer.Item label="Inicio" icon="castle" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('biblioteca')}>
                    <Drawer.Item label="Biblioteca" icon="format-list-bulleted-type" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('misPartidas')}>
                    <Drawer.Item label="Mis Partidas" icon="sword-cross" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('amigos')}>
                    <Drawer.Item label="Amigos" icon="account-multiple" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.enDesarrollo}>
                    <Drawer.Item label="Notificaciones" icon="bell" style={styles.elementMenu} theme={{ colors: { text: 'grey' } }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.enDesarrollo}>
                    <Drawer.Item label="Ajustes" icon="cellphone-settings" style={styles.elementMenu} theme={{ colors: { text: 'grey' } }} />    
                </TouchableOpacity>
                <TouchableOpacity onPress={this.closeSession}>
                    <Drawer.Item label="Cerrar Sesión" icon="logout" style={styles.lastEelementMenu} theme={{ colors: { text: '#ea3e67' } }} />
                </TouchableOpacity>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
    },
    elementMenu: {
    },
    lastElementMenu: {
        bottom: 0,
    }
});

export default withNavigation(Menu);