import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

import CarruselPartida from './CarruselPartida';

class CarruselPartidas extends React.Component {
  state = {
    collapsed: this.props.collapsed
  }

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({collapsed: !this.state.collapsed});
  };

  render() {
    return (
      <View style={styles.container} >
          <TouchableOpacity onPress={this.toggleExpanded} style={styles.listTitle} >
            {this.state.collapsed && <IconButton icon="chevron-right" color="black" size={20} style={{ margin:0, padding: 0 }}></IconButton>}
            {!this.state.collapsed && <IconButton icon="chevron-down" color="black" size={20} style={{ margin:0, padding: 0 }}></IconButton>}
            <Title style={{
                paddingHorizontal:15,
              }}>{this.props.title}</Title>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} >
            {this.props.partidas.length == 0 ? (
              <Text style={{
                paddingHorizontal:15,
              }}>{this.props.msgEmpty}</Text>
            ) : (
              <ScrollView horizontal>
              {this.props.partidas.map((elem) => 
                <CarruselPartida key={elem.id} partida={elem} />
              )}
              </ScrollView>
            )}
          </Collapsible>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent:'flex-start',
  },
  listTitle: {
    flexDirection: "row"
  }
});

export default CarruselPartidas;