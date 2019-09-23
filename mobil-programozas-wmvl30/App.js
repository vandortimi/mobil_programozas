import React from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  ImageBackground,
  Image,
  SafeAreaView,
  Button,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { createAppContainer } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';


const userInfo = { username: 'user', password: 'user' };


class LoginScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
  }
  
  static navigationOptions = {
    header: null,
  };

  render() {
    return (

      <ImageBackground 
        source={require('./images/background.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>  
        <Image source={require('./images/books.jpg')} />
          <Text style={styles.welcome}>Felhasználónév és jelszó: user </Text>
          <TextInput
            style={styles.input}
            placeholder="Felhasználónév"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
          />
          <TextInput
            style={styles.input}
            placeholder="Jelszó"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.btnEnter} onPress={this._signin}>
            <Text style={styles.btnEnterText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  _signin = async () => {
    if (
      userInfo.username === this.state.username &&
      userInfo.password === this.state.password
    ) {
      await AsyncStorage.setItem('logged', '1');
      this.props.navigation.navigate('Home');
    } else {
      alert('Nem megfelelő azonosítás! Kérlek próbálkozz újra!');
    }
  };
}


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      icim: '',
      ikategoria: '',
      ioldalszam: '',
   
      data: [
        { id: 1, cim: 'Lachlain', kategoria: 'Romantikus', oldalszam: 90},    
      ],
    };
  }

  static navigationOptions = {
    header: null,
  };


  render() {
    return (
        <View style={styles.container}>      
        <Text style={styles.welcome}>Kedvenc Könyvek listája</Text>
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={styles.listV}>
                <Text style={{ fontWeight: 'bold' }}>
                  Könyv cím: {item.cim}          Kategória: {item.kategoria}{' '}
                </Text>
  
                <Text>
                  Oldalszám: {item.oldalszam} 
                </Text>
                <TouchableOpacity
                  style={[
                    styles.btnEnter,
                    {
                      backgroundColor: '#f00',
                      width: 100,
                      padding: 5,
                      alignSelf: 'center',
                      marginTop: 10,
                    },
                  ]}
                  color="green"
                  onPress={() => this._deleteByID(item.id)}>
                  <Text style={styles.btnEnterText}>Töröl</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.welcome}>Könyv hozzáadása</Text>
          <View style={styles.formView}>
            <TextInput
              style={styles.inputF}
              placeholder="Cím"
              onChangeText={text => this.handleChange(text, 'icim')}
            />
            <TextInput
              style={styles.inputF}
              placeholder="Kategória"
              onChangeText={text => this.handleChange(text, 'ikategoria')}
            />
            <TextInput
              style={styles.inputF}
              placeholder="Oldalszám"
              onChangeText={text => this.handleChange(text, 'ioldalszam')}
              keyboardType={'numeric'}
            />
            <TouchableOpacity
              style={[styles.btnEnter, { marginBottom: 10 }]}
              onPress={this._addNewKonyv}>
              <Text style={styles.btnEnterText}>Bevitel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

         <Button onPress={this._logout} title="Logout" />
      </View>      
    );
  }

     handleChange = (value, state) => {
        this.setState({ [state]: value })
        }
        
    _addNewKonyv = () => {
    const { icim, ikategoria, ioldalszam, data } = this.state;

    if (icim.length < 1) {
      alert('Cím nem lehet üres!!!');
    } else if (ikategoria.length < 1) {
      alert('Kategória nem lehet üres!!!');
    } else if (ioldalszam.length < 1)  {
      alert('Oldalszám nem lehet üres!!!');
    }     
     else {
      var length = Object.keys(this.state.data).length;
      var iID = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
      iID = iID + length;
      
      this.setState(prevState => ({
        data: [
          ...prevState.data,
          {
            id: iID,
            cim: icim,
            kategoria: ikategoria,
            olalszam: ioldalszam,
          }
        ]
      }))
    }
  }


  _deleteByID(konyvID) {
   
    const konyvs = this.state.data.filter(item => item.id != konyvID);
    this.setState({ data: konyvs });
  }

  
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _loadData = async () => {
    const logged = await AsyncStorage.getItem('logged');
    this.props.navigation.navigate(logged !== '1' ? 'Auth' : 'Home');
  };
}


export default createAppContainer(
  createStackNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Home: HomeScreen,
      Auth: LoginScreen,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);


const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: '#d7f9ac',
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    width: 200,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: ' #641e16',
    margin: 15,
    height: 50,
    padding: 15,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#123d11',
    borderRadius: 50,
    paddingLeft: 25,
  },
  btnEnter: {
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    backgroundColor: '#003366',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 25,
  },
  btnEnterText: {    
    color: '#ffffff',
    fontWeight: '500',
    fontSize:18,   
    width: 80,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: null,
    height: null,
  },
  scrollView: {
    backgroundColor: '#e8f8f5',
  },
  listV: {
    borderRadius: 30,
    backgroundColor: '#8fe3a1',
    padding: 5,
    marginBottom: 10,
  },
  formView: {
    alignItems: 'center',    
    backgroundColor: '#f5b041',
    borderRadius: 40,
    marginHorizontal: 10,
  },
  inputF: {
    width: 200,
    backgroundColor: '#d3f0d9',
    color: 'black',
    margin: 15,
    height: 40,
    padding: 5,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#003366',
    borderRadius: 25,
    paddingLeft: 15,
  },
});
