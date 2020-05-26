const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose')

const { MONGODB } = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const PORT = 5000;

const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  context: ({ req }) => ({req})
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen(PORT)
  })
  .then(result => console.log(`🚀 Server ready at ${result.url}`))
  .catch(err => console.log('error == ', err))

