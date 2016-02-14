'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} = React;

var Base64 = require('./Base64.js');
var EVENTICK_TOKEN_URL='https://www.eventick.com.br/api/v1/tokens.json';
var EventsScreen = require('./EventsScreen.js');

var LoginScreen = React.createClass({  
  getInitialState: function() {
    return {
      emailText: '',
      passwordText: '',
      isLoading: false
    };
  },
  
  loadEventsScreen: function(eventickToken) {
    eventickToken = 'Basic ' + Base64.encode(eventickToken + ':');
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: 'Events List',
        component: EventsScreen,
        passProps: {eventickToken},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: 'Events List',
        name: 'events',
        eventickToken: eventickToken,
      });
    }
  },
  
  onLoginPressed: function() {
    this.setState({ isLoading: true });
    
    var accessToken = 'Basic ' + Base64.encode(this.state.emailText + ':' + this.state.passwordText);
    
    fetch(EVENTICK_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
    })
    .then(res => res.json())
    .then(json => {
      this.setState({ isLoading: false });
      this.loadEventsScreen(json.token);
    })
    .catch(err => {
      this.setState({ isLoading: false });
      
      // TODO: Show feedback on why login failed
    });
  },
  
  render: function() {    
    var spinner;
    if(this.state.isLoading) {
      if (Platform.OS === 'ios') {
        spinner = ( <ActivityIndicatorIOS hidden='true' size='large' /> );
      } else {
        spinner = (
          <View  style={{alignItems: 'center'}}>
            <ProgressBarAndroid styleAttr="Large" />
          </View>
        );
      }
    }
    
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(emailText) => this.setState({emailText})}
          value={this.state.emailText}
          placeholder="email"
          autoCorrect={false}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(passwordText) => this.setState({passwordText})}
          value={this.state.passwordText}
          placeholder="password"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <TouchableHighlight style={styles.button} 
          underlayColor='#99d9f4'
          onPress={this.onLoginPressed}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        {spinner}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});

module.exports = LoginScreen;