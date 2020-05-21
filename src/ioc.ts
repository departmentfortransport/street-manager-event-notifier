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
import ObjectMessageServiceDelegator from './services/objectMessageServiceDelegator'
import PermitObjectMessageService from './services/permitObjectMessageService'
import PermitDao from './daos/permitDao'

const iocContainer = new Container()

// Database
iocContainer.bind<Knex.Config>(TYPES.Knex).toConstantValue(KnexConfig.works as Knex.Config)
iocContainer.bind<DBService>(TYPES.DBService).to(DBService).inSingletonScope()

// Services
iocContainer.bind<ObjectMessageServiceDelegator>(TYPES.ObjectMessageServiceDelegator).to(ObjectMessageServiceDelegator).inSingletonScope()
iocContainer.bind<PermitObjectMessageService>(TYPES.PermitObjectMessageService).to(PermitObjectMessageService)
iocContainer.bind<PermitDao>(TYPES.PermitDao).to(PermitDao)

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
