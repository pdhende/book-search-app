const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: [Int]
    savedBooks: [Book]!
}

type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me(_id: ID, username: String): User
}`

module.exports = typeDefs;
