const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose')
const http = require('http')

const { MONGODB } = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const PORT = 4000;
const pubsub = new PubSub()

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = new ApolloServer({ 
      typeDefs, 
      resolvers, 
      context: ({ req }) => ({req, pubsub})
    });
    const app = express();
    server.applyMiddleware({app});
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
  })
  .catch(err => console.log('error == ', err))

