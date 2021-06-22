import React from 'react';
import { withNavigation } from 'react-navigation';
import { View, StyleSheet, ImageBackground, ScrollView, Image, AsyncStorage, TouchableOpacity, FlatList } from 'react-native';
import { Button, Headline, Subheading, Text  } from 'react-native-paper';

class Onboarding extends React.Component {
  state = {
    accessToken: {
      token: '',
      email: ''
    },
    categorias: [],
    mecanicas: [],
  };

  async getAccessToken() {
    const data =  await AsyncStorage.getItem('accessToken');
    return data;
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getAccessToken().then( value => {
          this.setState({'accessToken':JSON.parse(value)});
          this.loadCategorias();
          this.loadMecanicas();
        });
      }
    );
  }

  shuffle_array = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  loadCategorias = () => {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGameCategories',{
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
              email: this.state.accessToken.email
          }
      })
      })
      .then((response) => response.json())
      .then((response) => {
          if (response.result == 'OK') {
              let categorias = [];
              response.categories.forEach(elem => {
                  let t = {
                      label: elem.name,
                      value: elem.id,
                      selected: false
                  }
                  categorias.push(t);
              });
              this.shuffle_array(categorias);
              categorias = categorias.slice(0, 9);
              this.setState({'categorias':categorias});
          }
      })
      .catch((error) => {
          console.log(error);
      });
  }

  loadMecanicas = () => {
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/getGameMechanics',{
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
              email: this.state.accessToken.email
          }
      })
      })
      .then((response) => response.json())
      .then((response) => {
          if (response.result == 'OK') {
              let mecanicas = [];
              response.mechanics.forEach(elem => {
                  let t = {
                      label: elem.name,
                      value: elem.id,
                      selected: false
                  }
                  mecanicas.push(t);
              });
              this.shuffle_array(mecanicas);
              mecanicas = mecanicas.slice(0, 9);
              this.setState({'mecanicas':mecanicas});
          }
      })
      .catch((error) => {
          console.log(error);
      });
  }

  pressCategoria = (item) => {
    let categorias = [];
    this.state.categorias.forEach(elem => {
      if (elem.value == item.value) elem.selected = !elem.selected;
      categorias.push(elem);
    });
    this.setState({'categorias':categorias});
  }

  pressMecanica = (item) => {
    let mecanicas = [];
    this.state.mecanicas.forEach(elem => {
      if (elem.value == item.value) elem.selected = !elem.selected;
      mecanicas.push(elem);
    });
    this.setState({'mecanicas':mecanicas});
  }

  submit = () => {
    let categorias = [];
    this.state.categorias.forEach(elem => {
      if (elem.selected)
        categorias.push(elem.value);
    });
    let mecanicas = [];
    this.state.mecanicas.forEach(elem => {
      if (elem.selected)
        mecanicas.push(elem.value);
    });
    fetch('https://25lpkzypn8.execute-api.eu-west-1.amazonaws.com/default/userConfig',{
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token: this.state.accessToken.token, 
          user: {
              email: this.state.accessToken.email
          },
          config: {
            preferences: {
              categories: categorias,
              mechanics: mecanicas
            }
          }
        })
      })
      .then((response) => response.json())
      .then((response) => {
      })
      .catch((error) => {
          console.log(error);
      });
    this.props.navigation.navigate('home');
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/bkgOnboarding.jpg')} style={styles.background}>
          <ScrollView style={styles.hPad} contentContainerStyle={{}}>
            <Image  source={require('../assets/logo.png')} style={{
              marginTop:40,
              alignSelf:'center',
              width:50,
              height:50,
            }} />
            <View style={{
              alignItems:'center'
            }}>
              <Headline style={{color:'white'}}>¡Bienvenido!</Headline>
              <Subheading style={{color:'white'}}>Construyamos tu experiencia</Subheading>
            </View>
            {this.state.mecanicas.length > 0 && 
              <View style={{
                marginTop:20
              }}>
                <Subheading style={{color:'white',marginBottom:10}}>Escoge tus mecánicas</Subheading>
                <FlatList
                  data={this.state.mecanicas}
                  renderItem={({item}) => 
                    <TouchableOpacity style={{
                      backgroundColor:item.selected?'#0277bd':'transparent',
                      borderRadius:5,
                      borderWidth:2,
                      borderColor: item.selected?'#0277bd':'white',
                      height:50,
                      justifyContent:'center',
                      alignItems:'center',
                      flex: 1,
                      flexDirection: 'column',
                      marginBottom:5,
                      marginHorizontal:2,
                      paddingHorizontal:5,
                    }} onPress={() => this.pressMecanica(item)}>
                      <Text style={{color:'white',textAlign:'center'}}>{item.label}</Text>
                    </TouchableOpacity>
                  }
                  numColumns={3}
                  keyExtractor={ elem => elem.value}
                />
              </View>
            }
            {this.state.categorias.length > 0 && 
              <View style={{
                marginTop:20
              }}>
                <Subheading style={{color:'white',marginBottom:10}}>y tus categorías</Subheading>
                <FlatList
                  data={this.state.categorias}
                  renderItem={({item}) => 
                    <TouchableOpacity style={{
                      backgroundColor:item.selected?'#0277bd':'transparent',
                      borderRadius:5,
                      borderWidth:2,
                      borderColor: item.selected?'#0277bd':'white',
                      height:50,
                      justifyContent:'center',
                      alignItems:'center',
                      flex: 1,
                      flexDirection: 'column',
                      marginBottom:5,
                      marginHorizontal:2,
                      paddingHorizontal:5,
                    }} onPress={() => this.pressCategoria(item)}>
                      <Text style={{color:'white',textAlign:'center'}}>{item.label}</Text>
                    </TouchableOpacity>
                  }
                  numColumns={3}
                  keyExtractor={ elem => elem.value}
                />
              </View>
            }
            <Button style={{paddingVertical:10,marginTop:30}} mode="contained" dark="true" color="#f50057" onPress={this.submit}>Siguiente</Button>
          </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex:1,
    resizeMode: "cover",
  },
  hPad: {
    paddingVertical:30,
    paddingHorizontal:20,
  },
});

export default withNavigation(Onboarding);