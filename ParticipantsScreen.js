'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Alert
} = React;

var EVENTICK_PARTICIPANTS_URL = 'https://www.eventick.com.br/api/v1/events/:event_id/attendees.json';
var EVENTICK_CHECKIN_URL = 'https://www.eventick.com.br/api/v1/events/:event_id/attendees/check_all.json';

var resultsCache = {
  participants: []
};

var ParticipantsScreen = React.createClass({
  // TODO: Show loading spinner when syncing checkins
  // TODO: Display search bar to search based on name
  
  getInitialState: function() {
    return {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },
  
  componentDidMount: function() {
    this.getParticipants();
  },
  
  getParticipants: function() {
    var eventickParticipantsURL = EVENTICK_PARTICIPANTS_URL.replace(':event_id', this.props.event.id);
    
    fetch(eventickParticipantsURL, {
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
      resultsCache.participants = json.attendees;
      this.setState({
        loaded: true,
        dataSource: this.state.dataSource.cloneWithRows(json.attendees),
      });
    });
  },
  
  renderParticipant: function(participant) {
    return (
      <TouchableHighlight onPress={() => this.onParticipantPressed(participant)}>
        <View>  
          <View style={[styles.participantRow, participant.checked_at && styles.participantCheckedIn]}>
            <Text style={styles.participant}>{participant.name}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },
  
  onParticipantPressed: function(participant) {
    // React-native won't redraw the rows if we just update the participants
    // Array. We need to create a copy, change the property we want and then
    // use setState. https://github.com/facebook/react-native/issues/4104
    let newParticipantsArray = resultsCache.participants.slice();
    var indexToUpdate = 0;
    for(var i = 0; i < newParticipantsArray.length; i++) {
      if(newParticipantsArray[i].id === participant.id) {
        indexToUpdate = i;
      }
    }
    if (newParticipantsArray[indexToUpdate].checked_at === null) {
      newParticipantsArray[indexToUpdate] = {
        ...resultsCache.participants[indexToUpdate],
        checked_at: new Date().toISOString(),
      };
    } else {
      newParticipantsArray[indexToUpdate] = {
        ...resultsCache.participants[indexToUpdate],
        checked_at: null,
      };
    }
    resultsCache.participants = newParticipantsArray;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(resultsCache.participants),
    });
  },
  
  onSyncPressed: function() {
    var eventickCheckInURL = EVENTICK_CHECKIN_URL.replace(':event_id', this.props.event.id);
    
    // TODO: Only send updated attendees
    var body = { attendees: [] };
    for(var i = 0; i < resultsCache.participants.length; i++) {
      var participant = {};
      participant.id = resultsCache.participants[i].id;
      participant.checked_at = resultsCache.participants[i].checked_at;
      body.attendees.push(participant);
    }
    
    fetch(eventickCheckInURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.props.eventickToken,
      },
      body: JSON.stringify(body),
    })
    .then(res => {
      if(res.ok) {
        this.displayAlert('Success', 'Checkin succesful');
      } else {
        this.displayAlert('Error', 'Network response error while checking in');
      }
    })
    .catch(err => {
      console.log(err);
    });
  },
  
  displayAlert: function(title, message) {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )
  },
  
  render: function() {
    if(!this.state.loaded) {
      // TODO: Add loading spinner
      return (
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      );
    } else if(this.state.dataSource.getRowCount() === 0) {
      return (
        <View style={styles.loading}>
          <Text>No participants for this event</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderParticipant}
          styles={styles.participantsList}
        />
        <TouchableHighlight style={styles.syncButton}
          onPress={this.onSyncPressed}>
          <Text style={styles.syncButtonText}>Sync</Text>
        </TouchableHighlight>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 64,
  },
  syncButton: {
    height:60,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  syncButtonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  participantsList: {
    marginTop: 64,
  },
  participant: {
    textAlign: 'left',
  },
  participantRow: {
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  participantCheckedIn: {
    backgroundColor: '#7CB265'
  }
});

module.exports = ParticipantsScreen;