import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

class CarruselPartidas extends React.Component {
    render() {
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text>{this.props.msgEmpty}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
    },
    title: {

    }
});

export default CarruselPartidas;