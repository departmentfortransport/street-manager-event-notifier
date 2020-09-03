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
import WorkDataMapper from './mappers/workDataMapper'
import EventNotifierSNSMessageMapper from './mappers/eventNotifierSNSMessageMapper'
import PermitDao from './daos/permitDao'
import SNSPublishInputMapper from './mappers/snsPublishInputMapper'
import GeometryService from './services/geometryService'
import PermitLocationTypeDao from './daos/permitLocationTypeDao'
import PermitPermitConditionDao from './daos/permitPermitConditionDao'
import SNSMessageAttributeMapper from './mappers/snsMessageAttributeMapper'
import ActivityObjectMessageService from './services/activityObjectMessageService'
import ActivityDao from './daos/activityDao'
import ActivityLocationTypeDao from './daos/activityLocationTypeDao'
import ActivityDataMapper from './mappers/activityDataMapper'
import EventLogMapper from './mappers/eventLogMapper'

const iocContainer = new Container()

// Database
iocContainer.bind<Knex.Config>(TYPES.Knex).toConstantValue(KnexConfig.works as Knex.Config)
iocContainer.bind<DBService>(TYPES.DBService).to(DBService).inSingletonScope()

// Services
iocContainer.bind<ObjectMessageServiceDelegator>(TYPES.ObjectMessageServiceDelegator).to(ObjectMessageServiceDelegator).inSingletonScope()
iocContainer.bind<PermitObjectMessageService>(TYPES.PermitObjectMessageService).to(PermitObjectMessageService)
iocContainer.bind<PermitDao>(TYPES.PermitDao).to(PermitDao)
iocContainer.bind<PermitLocationTypeDao>(TYPES.PermitLocationTypeDao).to(PermitLocationTypeDao)
iocContainer.bind<PermitPermitConditionDao>(TYPES.PermitPermitConditionDao).to(PermitPermitConditionDao)
iocContainer.bind<GeometryService>(TYPES.GeometryService).to(GeometryService)
iocContainer.bind<ActivityObjectMessageService>(TYPES.ActivityObjectMessageService).to(ActivityObjectMessageService)
iocContainer.bind<ActivityDao>(TYPES.ActivityDao).to(ActivityDao)
iocContainer.bind<ActivityLocationTypeDao>(TYPES.ActivityLocationTypeDao).to(ActivityLocationTypeDao)

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

iocContainer.bind<string>(TYPES.PermitTopic).toConstantValue(config.PERMITTOPICARN)
iocContainer.bind<string>(TYPES.ActivityTopic).toConstantValue(config.ACTIVITYTOPICARN)

// Utils
iocContainer.bind<Logger>(TYPES.Logger).to(Logger)

// Mappers
iocContainer.bind<WorkDataMapper>(TYPES.WorkDataMapper).to(WorkDataMapper)
iocContainer.bind<ActivityDataMapper>(TYPES.ActivityDataMapper).to(ActivityDataMapper)
iocContainer.bind<EventNotifierSNSMessageMapper>(TYPES.EventNotifierSNSMessageMapper).to(EventNotifierSNSMessageMapper)
iocContainer.bind<SNSPublishInputMapper>(TYPES.SNSPublishInputMapper).to(SNSPublishInputMapper)
iocContainer.bind<SNSMessageAttributeMapper>(TYPES.SNSMessageAttributeMapper).to(SNSMessageAttributeMapper)
iocContainer.bind<EventLogMapper>(TYPES.EventLogMapper).to(EventLogMapper)

export default iocContainer
