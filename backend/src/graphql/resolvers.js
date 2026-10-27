import { getDbCheck } from '../services/database.js'

function createGraphqlResolvers(pool) {
  return {
    Query: {
      dbCheck: () => getDbCheck(pool),
    },
  }
}

export default createGraphqlResolvers
