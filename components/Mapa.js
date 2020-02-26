import React from 'react';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import Header from './Header';

class Mapa extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Header title="Partidas disponibles" />
                <MapView style={styles.container} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

export default withNavigation(Mapa);