const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

// Connnect to database
mongoose.connect('mongodb://localhost/test1');

// Model Creation
const Food = mongoose.model('Food', {
  name: String,
  expired: Boolean
});

// Schema
const typeDefs = `
  type Query {
    hello(name: String): String!
    foods: [Food]
  }
  type Food {
    id: ID!,
    name: String!,
    expired: Boolean!
  }
  type Mutation {
    createFood(name: String!): Food
    updateFood(id: ID!, expired: Boolean!): Boolean
    deleteFood(id: ID!): Boolean
  }
`;

// TODO: Clean these up for reuse
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    foods: () => Food.find()
  },
  Mutation: {
    // Creates and returns new Food object
    createFood: async (_, { name }) => {
      const newFood = new Food({ name, expired: false });
      await newFood.save();
      return newFood;
    },

    updateFood: async (_, { id, expired }) => {
      await Food.findByIdAndUpdate(id, { expired });
      return true;
    },

    deleteFood: async (_, { id }) => {
      await Food.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

// Create instance of database connection for callbacks
const db = mongoose.connection;

// TODO Handle connection errors
db.on('error', console.error.bind(console, 'CONNECTION ERRORS'));

// Start server once connected to database
db.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'));
});
