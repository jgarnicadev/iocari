import React from 'react';
import { View, TouchableHighlight, Text, BackHandler, AsyncStorage, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-paper';

class Menu extends React.Component {

    closeSession() {
        AsyncStorage.removeItem('accessToken');
        BackHandler.exitApp();
    }

    temp = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Inicio" icon="home" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Biblioteca" icon="view-list" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Mis Partidas" icon={require('../assets/misPartidas.png')} style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Amigos" icon="account-multiple" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Notificaciones" icon="bell" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.temp}>
                    <Drawer.Item label="Configuración" icon="settings" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.closeSession}>
                    <Drawer.Item label="Cerrar Sesión" icon="logout" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
    },
    elementMenu: {
    }
});

export default Menu;