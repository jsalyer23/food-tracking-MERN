import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// Material Imports
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const foodsQuery = gql`
  {
    foods {
      id
      name
      expired
    }
  }
`;

class App extends Component {
  handleToggle = food => () => {
    // Update food
  };

  render() {
    const {data: {loading, foods}} = this.props;
    if (loading) {
      return null;
    }
    return (
      <div style={{display: "flex"}}>
        <div style={{margin: "auto", width: 400}}>
          <Paper>
            <List>
              {foods.map(food => (
                <ListItem
                  key={food.id}
                  role={undefined}
                  dense
                  button
                  onClick={this.handleToggle(food)}
                >
                  <Checkbox
                    checked={food.expired /* TODO: this needs changed to the correct prop */}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={food.name /* TODO: Handle capitalization */ } />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Comments">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default graphql(foodsQuery)(App);
