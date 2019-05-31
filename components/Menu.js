import React from 'react';
import { View, TouchableHighlight, Text, BackHandler, AsyncStorage } from 'react-native';

class Menu extends React.Component {

    closeSession() {
        AsyncStorage.removeItem('accessToken');
        BackHandler.exitApp();
    }

    render() {
        return (
            <View>
                <TouchableHighlight onPress={this.closeSession}>
                    <Text>Cerrar sesión</Text>
                </TouchableHighlight>
            </View>
        );
    }
    
}

export default Menu;