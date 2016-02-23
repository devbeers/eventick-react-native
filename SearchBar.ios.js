/**
 * @providesModule SearchBar
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  TextInput,
  StyleSheet,
  View,
} = React;

var SearchBar = React.createClass({
  render: function() {
    return (
      <View style={styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChange={this.props.onSearchChange}
          placeholder="Search by name"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          clearButtonMode="always"
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 50,
  },
});

module.exports = SearchBar;
