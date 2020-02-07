import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Picker, Modal } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      teamsData: null,
      fixturesData: null,
      selectedTeam: null,
    }
  }

  componentDidMount() {
    getTeams().then(teams => {
      console.log(teams)
      this.setState({
        loading: false,
        teamsData: teams,
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>
            {this.state.selectedTeam}
          </Text>
          <Picker
            selectedValue={this.state.selectedTeam}
            prompt="Select team"
            style={{ 
              height: 200, 
              width: 300,
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedTeam: itemValue })
            }>
            {this.state.teamsData.map(team => (
            <Picker.Item label={team.name} value={team.name} key={team.id}/>
          ))}
          </Picker>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

async function getTeams() {
  const response = await fetch("https://www.api-football.com/demo/api/v2/teams/league/524/");
  const data = await response.json();
  const teamsData = data.api.teams;
  const teams = [];
  teamsData.forEach(team => {
    teams.push({
      id: team.team_id,
      name: team.name,
    })
  });
  teams.sort(teamCompare);
  console.log(teams);
  return teams;
}

function teamCompare(a, b) {
  let comparison = 0;
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    comparison = -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    comparison = 1
  }
  console.log("compared");
  return comparison;
}

//https://www.api-football.com/demo/api/v2/fixtures/team/31