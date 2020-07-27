const { gql } = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Notification {
    id: ID!
    title: String!
    message: String!
    status: String!
    createdAt: String!
    fromUser: ID!
    toUser: ID!
  }
  type User {
    id: ID!
    mobile: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Category {
    id: ID!
    name: String!
    parentId: ID
    ordering: Int
    isLeaf: Boolean!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    mobile: String!
  }
  type Query {
    notifications(toUser: ID!): [Notification]
    notification(id: ID!): Notification
    categories: [Category]
    category(id: ID!): Category
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(mobile: String!, password: String!): User!
    createNotification(title: String!, message: String!, toUser: ID!): Notification!
    deleteNotification(id: ID!): String!
    createCategory(name: String!, ordering: Int!, isLeaf: Boolean!): Category!
    deleteCategory(id: ID!): String!
  }
`;

module.exports = typeDefs