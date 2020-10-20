import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import { EventNotifierSQSMessage, EventNotifierWorkData } from 'street-manager-data'
import SNSService from './aws/snsService'
import SNSPublishInputMapper from '../mappers/snsPublishInputMapper'
import Logger from '../utils/logger'
import PermitDao from '../daos/permitDao'
import PermitLocationTypeDao from '../daos/permitLocationTypeDao'
import PermitPermitConditionDao from '../daos/permitPermitConditionDao'
import WorkDataMapper from '../mappers/workDataMapper'
import { WorkData } from '../models/workData'
import { SNS } from 'aws-sdk'
import * as Knex from 'knex'
import { KnexPostgis } from 'knex-postgis'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import SNSMessageAttributeMapper from '../mappers/snsMessageAttributeMapper'
import EventNotifierSNSMessageMapper from '../mappers/eventNotifierSNSMessageMapper'
import EventLogMapper from '../mappers/eventLogMapper'

@injectable()
export default class PermitObjectMessageService implements ObjectMessageService {

  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.SNSService) private snsService: SNSService,
    @inject(TYPES.SNSPublishInputMapper) private snsPublishInputMapper: SNSPublishInputMapper,
    @inject(TYPES.PermitDao) private permitDao: PermitDao,
    @inject(TYPES.PermitLocationTypeDao) private permitLocationTypeDao: PermitLocationTypeDao,
    @inject(TYPES.PermitPermitConditionDao) private permitPermitConditionDao: PermitPermitConditionDao,
    @inject(TYPES.WorkDataMapper) private workDataMapper: WorkDataMapper,
    @inject(TYPES.PermitTopic) private permitTopic: string,
    @inject(TYPES.EventNotifierSNSMessageMapper) private eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper,
    @inject(TYPES.SNSMessageAttributeMapper) private attributeMapper: SNSMessageAttributeMapper,
    @inject(TYPES.EventLogMapper) private eventLogMapper: EventLogMapper
  ) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date, knex: Knex, knexPostgis: KnexPostgis): Promise<void> {

    Promise.reject(new Error('Some test error causing an unhandled rejection'))

    try {
      const eventNotifierWorkData: EventNotifierWorkData = await this.getWorkData(sqsMessage.object_reference, knex, knexPostgis)

      const messageAttributes: MessageAttributeMap = this.attributeMapper.mapMessageAttributes(
        eventNotifierWorkData.usrn,
        eventNotifierWorkData.highway_authority,
        eventNotifierWorkData.activity_type,
        eventNotifierWorkData.area_name,
        eventNotifierWorkData.promoter_organisation
      )

      const snsPublishInput: SNS.PublishInput = this.snsPublishInputMapper.mapToSNSPublishInput(
        this.eventNotifierSNSMessageMapper.mapToSNSMessage(sqsMessage, eventNotifierWorkData),
        this.permitTopic,
        messageAttributes
      )

      await this.snsService.publishMessage(snsPublishInput)

      this.logger.logWithObject('Message successfully sent to SNS:', this.eventLogMapper.generateEventLogMessage(sqsMessage, timeReceived))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private async getWorkData(permitReferenceNumber: string, knex: Knex, knexPostgis: KnexPostgis): Promise<EventNotifierWorkData> {
    const workData: WorkData = await this.permitDao.getWorkData(permitReferenceNumber, knex, knexPostgis)

    const [locationTypes, permitConditions] = await Promise.all([
      this.permitLocationTypeDao.getByPermitVersionId(workData.permit_version_id, knex),
      this.permitPermitConditionDao.getByPermitVersionId(workData.permit_version_id, knex)
    ])

    return this.workDataMapper.mapWorkDataToEventNotifierWorkData(workData, locationTypes, permitConditions)
  }
}
