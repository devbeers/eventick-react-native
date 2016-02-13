'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

// Eventick access token available on this.props.eventick_token

// TODO: Grab event list from Eventick
var EventsScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Events List</Text>
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
});

module.exports = EventsScreen;