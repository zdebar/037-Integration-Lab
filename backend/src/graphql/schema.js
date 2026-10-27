const graphqlSchema = `
  type DbCheck {
    database: String!
    time: String!
  }

  type Query {
    dbCheck: DbCheck!
  }
`

export default graphqlSchema
