'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

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
        if(new Date(formattedDate) > Date.now()) currentEvents.push(event);
      });
      this.setState({
        loaded: true,
        dataSource: this.state.dataSource.cloneWithRows(currentEvents),
      });
    })
    .catch(err => {
      console.log(err);
    });
  },
  
  renderEvent: function(event) {
    return (
      <View>
        <View style={styles.event}>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    )
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
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderEvent}
        style={styles.eventsList}
      />
    )
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
  eventsList: {
    backgroundColor: '#F5FCFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  event: {
    flex: 1,
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