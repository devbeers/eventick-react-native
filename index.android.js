/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View,
} = React;

var LoginScreen = require('./LoginScreen');
var EventsScreen = require('./EventsScreen');
var ParticipantsScreen = require('./ParticipantsScreen');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'login') {
    return (
      <LoginScreen navigator={navigationOperations} />
    );
  } else if (route.name === 'events') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.title} />
        <EventsScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          eventickToken={route.eventickToken}
        />
      </View>
    );
  } else if (route.name === 'participants') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          navIcon={require('image!android_back_white')}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.event.title} />
        <ParticipantsScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          event={route.event}
          eventickToken={route.eventickToken}
        />
      </View>
    );
  }
};

var reactEventick = React.createClass({
  render: function() {
    var initialRoute = {name: 'login'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

AppRegistry.registerComponent('reactEventick', () => reactEventick);

module.exports = reactEventick;