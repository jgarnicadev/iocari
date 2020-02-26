import React from 'react';
import { View, TouchableHighlight, Text, BackHandler, AsyncStorage, StyleSheet, Alert } from 'react-native';
import { Drawer } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class Menu extends React.Component {

    closeSession = () => {
        AsyncStorage.removeItem('accessToken');
        // BackHandler.exitApp();
        this.props.navigation.navigate('login');
    }

    enDesarrollo  = () => {
        Alert.alert('a desarrollar...');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('home')}>
                    <Drawer.Item label="Inicio" icon="home" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('biblioteca')}>
                    <Drawer.Item label="Biblioteca" icon="view-list" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
                    <Drawer.Item label="Mis Partidas" icon={require('../assets/misPartidas.png')} style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
                    <Drawer.Item label="Amigos" icon="account-multiple" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
                    <Drawer.Item label="Notificaciones" icon="bell" style={styles.elementMenu} theme={{ colors: { text: 'white' } }} />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.enDesarrollo}>
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

export default withNavigation(Menu);