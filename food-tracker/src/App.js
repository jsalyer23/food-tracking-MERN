import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
// Material Imports
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// Component Imports
import FoodForm from './FoodForm.js';

const foodsQuery = gql`
  {
    foods {
      id
      name
      expired
    }
  }
`;

const updateMutation = gql`
  mutation($id: ID!, $expired: Boolean!) {
    updateFood(id: $id, expired: $expired)
  }
`;

const deleteMutation = gql`
  mutation($id: ID!) {
    deleteFood(id: $id)
  }
`;

class App extends Component {
  // Funtions written like functionName(prop) {} need to be bound if you want "this"
  updateFood = async (food) => {
    // Update food TODO: There's more that should go into here...
    await this.props.updateFood({
      variables: {
        id: food.id,
        expired: !food.expired
      },
      update: (store, { data: { updateFood } }) => {
        // Read data from client cache for this query
        const data = store.readQuery({ query: foodsQuery });
        // Find and update the current Food within the list of cached Foods from the component props
        data.foods = data.foods.map(elm => elm.id === food.id ? ({ ...food, expired: !food.expired }) : elm);
        // Update data back in the client cache once current food has been updated
        store.writeQuery({ query: foodsQuery, data });
      }
    });
  };

  deleteFood = async (food) => {
    // Delete Food if expired? TODO: Bind this to two step action with modal if item is not currently checked? (maybe no...)
    await this.props.deleteFood({
      variables: {
        id: food.id
      },
      update: store => {
        const data = store.readQuery({ query: foodsQuery });
        // Remove current Food from props
        data.foods = data.foods.filter(elm => elm.id !== food.id);
        store.writeQuery({ query: foodsQuery, data });
      }
    })
  };

  render() {
    const {data: {loading, foods}} = this.props;
    if (loading) {
      return null;
    }
    return (
      <div style={{display: "flex"}}>
        <div style={{margin: "auto", width: 400}}>
          <FoodForm />
          <Paper>
            <List>
              {foods.map(food => (
                <ListItem
                  key={food.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateFood(food)}
                >
                  <Checkbox
                    checked={food.expired /* TODO: this needs changed to the correct prop */}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={food.name /* TODO: Handle capitalization */ } />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.deleteFood(food)}>
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

export default compose(
  graphql(deleteMutation, { name: 'deleteFood' }),
  graphql(updateMutation, { name: 'updateFood' }),
  graphql(foodsQuery))(App);
