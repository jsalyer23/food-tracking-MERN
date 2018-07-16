import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class FoodForm extends React.Component {

  state = {
    name: '', // TODO: date food was purchased or something like that should be added here
  };

  handleChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    const { name } = this.state;

    return (
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={this.handleChange}
      />
    );
  }
}
