import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import { EventNotifierSQSMessage, EventNotifierActivityData, ActivityLocationType } from 'street-manager-data'
import SNSService from './aws/snsService'
import SNSPublishInputMapper from '../mappers/snsPublishInputMapper'
import Logger from '../utils/logger'
import ActivityDao from '../daos/activityDao'
import ActivityLocationTypeDao from '../daos/activityLocationTypeDao'
import ActivityDataMapper from '../mappers/activityDataMapper'
import { ActivityData } from '../models/activityData'
import { SNS } from 'aws-sdk'
import * as Knex from 'knex'
import { KnexPostgis } from 'knex-postgis'
import SNSMessageAttributeMapper from '../mappers/snsMessageAttributeMapper'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import EventNotifierSNSMessageMapper from '../mappers/eventNotifierSNSMessageMapper'
import EventLogMapper from '../mappers/eventLogMapper'

@injectable()
export default class ActivityObjectMessageService implements ObjectMessageService {

  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.SNSService) private snsService: SNSService,
    @inject(TYPES.SNSPublishInputMapper) private snsPublishInputMapper: SNSPublishInputMapper,
    @inject(TYPES.ActivityDao) private activityDao: ActivityDao,
    @inject(TYPES.ActivityLocationTypeDao) private activityLocationTypeDao: ActivityLocationTypeDao,
    @inject(TYPES.ActivityDataMapper) private activityDataMapper: ActivityDataMapper,
    @inject(TYPES.ActivityTopic) private activityTopic: string,
    @inject(TYPES.EventNotifierSNSMessageMapper) private eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper,
    @inject(TYPES.SNSMessageAttributeMapper) private attributeMapper: SNSMessageAttributeMapper,
    @inject(TYPES.EventLogMapper) private eventLogMapper: EventLogMapper
  ) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date, knex: Knex, knexPostgis: KnexPostgis): Promise<void> {
    try {
      const eventNotifierActivityData: EventNotifierActivityData = await this.getActivityData(sqsMessage.object_reference, knex, knexPostgis)

      const messageAttributes: MessageAttributeMap = this.attributeMapper.mapMessageAttributes(
        eventNotifierActivityData.usrn,
        eventNotifierActivityData.highway_authority,
        eventNotifierActivityData.activity_type,
        eventNotifierActivityData.area_name
      )

      const snsPublishInput: SNS.PublishInput = this.snsPublishInputMapper.mapToSNSPublishInput(
        this.eventNotifierSNSMessageMapper.mapToSNSMessage(sqsMessage, eventNotifierActivityData),
        this.activityTopic,
        messageAttributes
      )

      await this.snsService.publishMessage(snsPublishInput)

      this.logger.logWithObject('Message successfully sent to SNS:', this.eventLogMapper.generateEventLogMessage(sqsMessage, timeReceived))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private async getActivityData(activityReferenceNumber: string, knex: Knex, knexPostgis: KnexPostgis): Promise<EventNotifierActivityData> {
    const activityData: ActivityData = await this.activityDao.getActivityData(activityReferenceNumber, knex, knexPostgis)
    const locationTypes: ActivityLocationType[] = await this.activityLocationTypeDao.getActivityLocationTypeByActivityId(activityData.activity_id, knex)

    return this.activityDataMapper.mapActivityDataToEventNotifierActivityData(activityData, locationTypes)
  }
}
