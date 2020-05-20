import 'reflect-metadata'
import { Container } from 'inversify'
import DBService from './services/dbService'
import TYPES from './types'
import { RDS, SNS } from 'aws-sdk'
import * as config from './config'
import RDSService from './services/aws/rdsService'
import SNSService from './services/aws/snsService'
import Logger from './utils/logger'
import * as Knex from 'knex'
import KnexConfig from './knexfile'
import * as postgis from 'knex-postgis'

const iocContainer = new Container()

// Database
iocContainer.bind<Knex.Config>(TYPES.Knex).toConstantValue(KnexConfig.works as Knex.Config)
// Database
const knexRead: Knex = Knex(KnexConfig.worksRead)
const knexWrite: Knex = Knex(KnexConfig.worksWrite)

iocContainer.bind<Knex>(TYPES.KnexRead).toConstantValue(knexRead)
iocContainer.bind<Knex>(TYPES.KnexWrite).toConstantValue(knexWrite)
iocContainer.bind<postgis.KnexPostgis>(TYPES.Postgis).toConstantValue(postgis(knexRead))
iocContainer.bind<DBService>(TYPES.DBService).to(DBService).inSingletonScope()

// AWS
iocContainer.bind<RDSService>(TYPES.RDSService).to(RDSService)

iocContainer.bind<RDS.Signer>(TYPES.RDSSigner).toConstantValue(new RDS.Signer({
  region: config.AWSREGION,
  hostname: config.PGHOST,
  port: Number(config.PGPORT),
  username: config.PGUSER
}))

// - SNS
iocContainer.bind<SNSService>(TYPES.SNSService).to(SNSService)

iocContainer.bind<SNS>(TYPES.SNS).toConstantValue(new SNS())

iocContainer.bind<string>(TYPES.WorkStartTopic).toConstantValue(config.WORKSTARTTOPICARN)
iocContainer.bind<string>(TYPES.WorkStopTopic).toConstantValue(config.WORKSTOPTOPICARN)

// Utils
iocContainer.bind<Logger>(TYPES.Logger).to(Logger)

export default iocContainer
