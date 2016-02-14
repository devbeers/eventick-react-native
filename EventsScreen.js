'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform
} = React;

var ParticipantsScreen = require('./ParticipantsScreen.js');
var EVENTICK_EVENTS_URL = 'https://www.eventick.com.br/api/v1/events.json';

var EventsScreen = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },
  
  componentDidMount: function() {
    this.getEvents();
  },
  
  getEvents: function() {    
    fetch(EVENTICK_EVENTS_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.eventickToken
      },
    })
    .then(res => res.json())
    .catch(err => {
      console.log(err);
    })
    .then(json => {
      var currentEvents = [];
      json.events.forEach(function(event) {
        // Date in React-native doesn't support the format 2014-02-12 20:00:00 -0200
        // Changing 2014-02-12 to 2014/02/12 works
        var formattedDate = event.start_at.substr(0, 4) + '/' +
                            event.start_at.substr(5, 2) + '/' + 
                            event.start_at.substr(8);
        
        // Only show events in the future, or over for 2 days
        var today = new Date();
        if(new Date(formattedDate) > today.setDate(today.getDate() + 2)) currentEvents.push(event);
      });
      this.setState({
        loaded: true,
        dataSource: this.state.dataSource.cloneWithRows(currentEvents),
      });
    });
  },
  
  renderEvent: function(event) {
    return (
      <TouchableHighlight onPress={() => this.onEventPressed(event)}>
        <View>
          <View style={styles.event}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    )
  },
  
  onEventPressed: function(event) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: event.title,
        component: ParticipantsScreen,
        passProps: { event: event, eventickToken: this.props.eventickToken},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: event.title,
        name: 'participants',
        event: event,
        eventickToken: this.props.eventickToken
      });
    }
  },
  
  render: function() {
    if(!this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text>Events List</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderEvent}
          style={styles.eventsList}
        />
      </View>
    )
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  eventsList: {
    marginTop: 64,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  event: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    padding: 30,
  },
  eventTitle: {
    fontFamily: 'Verdana',
    fontSize: 20,
    color: 'black'
  },
});

module.exports = EventsScreen;