import 'mocha'
import { mock, instance, when, verify } from 'ts-mockito'
import ActivityObjectMessageService from '../../../src/services/activityObjectMessageService'
import SNSService from '../../../src/services/aws/snsService'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import Logger from '../../../src/utils/logger'
import { generatePublishInput, generateMessageAttributes } from '../../fixtures/publishInputFixtures'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { EventNotifierSQSMessage, ActivityLocationType, EventNotifierActivityData, EventNotifierSNSMessage } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import ActivityDao from '../../../src/daos/activityDao'
import ActivityLocationTypeDao from '../../../src/daos/activityLocationTypeDao'
import ActivityDataMapper from '../../../src/mappers/activityDataMapper'
import { ActivityData } from '../../../src/models/activityData'
import { generateActivityData } from '../../fixtures/activityDataFixtures'
import { generateActivityLocationType } from '../../fixtures/activityLocationTypeFixtures'
import { generateEventNotifierActivityData } from '../../fixtures/eventNotifierActivityDataFixtures'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import SNSMessageAttributeMapper from '../../../src/mappers/snsMessageAttributeMapper'
import { generateSNSMessage } from '../../fixtures/snsFixtures'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import { EventLogMessage } from '../../../src/models/eventLogMessage'
import { generateEventLogMessage } from '../../fixtures/eventLogFixtures'
import EventLogMapper from '../../../src/mappers/eventLogMapper'

describe('ActivityObjectMessageService', () => {
  let logger: Logger
  let snsService: SNSService
  let snsPublishInputMapper: SNSPublishInputMapper
  let activityDao: ActivityDao
  let activityLocationTypeDao: ActivityLocationTypeDao
  let activityDataMapper: ActivityDataMapper
  let eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper
  let attributeMapper: SNSMessageAttributeMapper
  let eventLogMapper: EventLogMapper

  let activityObjectMessageService: ActivityObjectMessageService

  const KNEX: any = {}
  const KNEX_POSTGIS: any = {}

  const activityTopic = 'ACTIVITY'

  before(() => {
    logger = mock(Logger)
    snsService = mock(SNSService)
    snsPublishInputMapper = mock(SNSPublishInputMapper)
    activityDao = mock(ActivityDao)
    activityLocationTypeDao = mock(ActivityLocationTypeDao)
    activityDataMapper = mock(ActivityDataMapper)
    eventNotifierSNSMessageMapper = mock(EventNotifierSNSMessageMapper)
    attributeMapper = mock(SNSMessageAttributeMapper)
    eventLogMapper = mock(eventLogMapper)

    activityObjectMessageService = new ActivityObjectMessageService(
      instance(logger),
      instance(snsService),
      instance(snsPublishInputMapper),
      instance(activityDao),
      instance(activityLocationTypeDao),
      instance(activityDataMapper),
      activityTopic,
      instance(eventNotifierSNSMessageMapper),
      instance(attributeMapper),
      instance(eventLogMapper)
    )
  })

  describe('sendMessageToSNS', () => {
    it('should build an SNS message, send it and log the success', async () => {
      const eventNotifierSQSMessage: EventNotifierSQSMessage = generateSQSMessage()
      const eventNotifierSNSMessage: EventNotifierSNSMessage = generateSNSMessage()
      const messageAttributes: MessageAttributeMap = generateMessageAttributes()
      const activityData: ActivityData = generateActivityData()
      const activityLocationTypes: ActivityLocationType[] = [generateActivityLocationType(activityData.activity_id)]
      const eventNotifierActivityData: EventNotifierActivityData = generateEventNotifierActivityData()
      const snsPublishInput: SNS.PublishInput = generatePublishInput()
      const timeReceived: Date = new Date()
      const expectedLogMessage: EventLogMessage = generateEventLogMessage(
        eventNotifierSQSMessage.object_reference,
        eventNotifierSQSMessage.event_reference,
        timeReceived,
        new Date()
      )

      when(activityDao.getActivityData(eventNotifierSQSMessage.object_reference, KNEX, KNEX_POSTGIS)).thenResolve(activityData)
      when(activityLocationTypeDao.getActivityLocationTypeByActivityId(activityData.activity_id, KNEX)).thenResolve(activityLocationTypes)
      when(activityDataMapper.mapActivityDataToEventNotifierActivityData(activityData, activityLocationTypes)).thenReturn(eventNotifierActivityData)
      when(attributeMapper.mapMessageAttributes(eventNotifierActivityData.usrn, eventNotifierActivityData.highway_authority, eventNotifierActivityData.activity_type, eventNotifierActivityData.area_name)).thenReturn(messageAttributes)
      when(eventNotifierSNSMessageMapper.mapToSNSMessage(eventNotifierSQSMessage, eventNotifierActivityData)).thenReturn(eventNotifierSNSMessage)
      when(snsPublishInputMapper.mapToSNSPublishInput(eventNotifierSNSMessage, activityTopic, messageAttributes)).thenReturn(snsPublishInput)
      when(snsService.publishMessage(snsPublishInput)).thenResolve()
      when(eventLogMapper.generateEventLogMessage(eventNotifierSQSMessage, timeReceived)).thenReturn(expectedLogMessage)

      await activityObjectMessageService.sendMessageToSNS(eventNotifierSQSMessage, timeReceived, KNEX, KNEX_POSTGIS)

      verify(snsService.publishMessage(snsPublishInput)).once()
      verify(logger.logWithObject('Message successfully sent to SNS:', expectedLogMessage)).once()
    })
  })
})
