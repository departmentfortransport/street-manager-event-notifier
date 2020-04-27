import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import Knex = require('knex')
import Logger from './utils/logger'

let knex: Knex
const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)

async function main(event) {
  logger.log(`Recieved message: ${JSON.stringify(event)}`)

  if (!knex) {
    knex = await iocContainer.get<DBService>(TYPES.DBService).connect()
  }

  const permit = await knex('permit').select('permit_reference_number').limit(1)
  logger.log(JSON.stringify(permit))
  return permit
}

export const handler = main
