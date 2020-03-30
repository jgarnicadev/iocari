import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import ListadoUsuario from './ListadoUsuario';

class ListadoUsuarios extends React.Component {
    render() {
      return (
        <View style={styles.container}>
            {this.props.title != '' ? (
              <Text style={styles.title}>{this.props.title}</Text>
            ) : null }
            <ScrollView>
            {this.props.usuarios.length == 0 ? (
              <Text>{this.props.msgEmpty}</Text>
            ) : (
              <View style={{
                flex:1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent:'space-between',
              }}>
              {this.props.usuarios.map((elem) => 
                <ListadoUsuario key={elem.id} usuario={elem} style={{
                  width:'30%',
                }} />
              )}
              </View>
              )
            }
            </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
      fontSize:20,
      marginBottom:10,
    },
});

export default ListadoUsuarios;