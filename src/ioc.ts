import 'reflect-metadata'
import { Container } from 'inversify'
import DBService from './services/dbService'
import TYPES from './types'
import { RDS } from 'aws-sdk'
import * as config from './config'
import RDSService from './services/aws/rdsService'
import Logger from './utils/logger'
import * as Knex from 'knex'
import KnexConfig from './knexfile'

const iocContainer = new Container()

// Database
iocContainer.bind<Knex.Config>(TYPES.Knex).toConstantValue(KnexConfig.works as Knex.Config)

iocContainer.bind<DBService>(TYPES.DBService).to(DBService).inSingletonScope()

iocContainer.bind<RDS.Signer>(TYPES.RDSSigner).toConstantValue(new RDS.Signer({
  region: config.AWSREGION,
  hostname: config.PGHOST,
  port: Number(config.PGPORT),
  username: config.PGUSER
}))

iocContainer.bind<RDSService>(TYPES.RDSService).to(RDSService)

// Utils
iocContainer.bind<Logger>(TYPES.Logger).to(Logger)

export default iocContainer
