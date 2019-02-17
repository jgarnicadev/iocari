import React from 'react';
import { StyleSheet, View } from 'react-native';

import LoginPage from './components/LoginPage';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginPage></LoginPage>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'stretch',
    justifyContent: 'center',
  },
});
