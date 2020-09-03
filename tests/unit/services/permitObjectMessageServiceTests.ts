import 'mocha'
import { mock, instance, when, verify } from 'ts-mockito'
import PermitObjectMessageService from '../../../src/services/permitObjectMessageService'
import SNSService from '../../../src/services/aws/snsService'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import Logger from '../../../src/utils/logger'
import { generatePublishInput, generateMessageAttributes } from '../../fixtures/publishInputFixtures'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { EventNotifierSQSMessage, PermitLocationType, EventNotifierWorkData, PermitPermitCondition, EventNotifierSNSMessage } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import PermitDao from '../../../src/daos/permitDao'
import PermitLocationTypeDao from '../../../src/daos/permitLocationTypeDao'
import PermitPermitConditionDao from '../../../src/daos/permitPermitConditionDao'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { WorkData } from '../../../src/models/workData'
import { generateWorkData } from '../../fixtures/workDataFixtures'
import { generatePermitLocationType } from '../../fixtures/permitLocationTypeFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'
import { generatePermitPermitCondition } from '../../fixtures/permitConditionFixtures'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import SNSMessageAttributeMapper from '../../../src/mappers/snsMessageAttributeMapper'
import { generateSNSMessage } from '../../fixtures/snsFixtures'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import { EventLogMessage } from '../../../src/models/eventLogMessage'
import EventLogMapper from '../../../src/mappers/eventLogMapper'
import { generateEventLogMessage } from '../../fixtures/eventLogFixtures'

describe('PermitObjectMessageService', () => {
  let logger: Logger
  let snsService: SNSService
  let snsPublishInputMapper: SNSPublishInputMapper
  let permitDao: PermitDao
  let permitLocationTypeDao: PermitLocationTypeDao
  let permitPermitConditionDao: PermitPermitConditionDao
  let workDataMapper: WorkDataMapper
  let eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper
  let attributeMapper: SNSMessageAttributeMapper
  let eventLogMapper: EventLogMapper

  let permitObjectMessageService: PermitObjectMessageService

  const KNEX: any = {}
  const KNEX_POSTGIS: any = {}

  const permitTopic = 'PERMIT'

  before(() => {
    logger = mock(Logger)
    snsService = mock(SNSService)
    snsPublishInputMapper = mock(SNSPublishInputMapper)
    permitDao = mock(PermitDao)
    permitLocationTypeDao = mock(PermitLocationTypeDao)
    permitPermitConditionDao = mock(PermitPermitConditionDao)
    workDataMapper = mock(WorkDataMapper)
    eventNotifierSNSMessageMapper = mock(EventNotifierSNSMessageMapper)
    attributeMapper = mock(SNSMessageAttributeMapper)
    eventLogMapper = mock(EventLogMapper)

    permitObjectMessageService = new PermitObjectMessageService(
      instance(logger),
      instance(snsService),
      instance(snsPublishInputMapper),
      instance(permitDao),
      instance(permitLocationTypeDao),
      instance(permitPermitConditionDao),
      instance(workDataMapper),
      permitTopic,
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
      const workData: WorkData = generateWorkData()
      const permitLocationTypes: PermitLocationType[] = [generatePermitLocationType(workData.permit_version_id)]
      const permitConditions: PermitPermitCondition[] = [generatePermitPermitCondition(workData.permit_version_id)]
      const eventNotifierWorkData: EventNotifierWorkData = generateEventNotifierWorkData()
      const snsPublishInput: SNS.PublishInput = generatePublishInput()
      const timeReceived: Date = new Date()
      const expectedLogMessage: EventLogMessage = generateEventLogMessage(
        eventNotifierSQSMessage.object_reference,
        eventNotifierSQSMessage.event_reference,
        timeReceived,
        new Date()
      )

      when(permitDao.getWorkData(eventNotifierSQSMessage.object_reference, KNEX, KNEX_POSTGIS)).thenResolve(workData)
      when(permitLocationTypeDao.getByPermitVersionId(workData.permit_version_id, KNEX)).thenResolve(permitLocationTypes)
      when(permitPermitConditionDao.getByPermitVersionId(workData.permit_version_id, KNEX)).thenResolve(permitConditions)
      when(workDataMapper.mapWorkDataToEventNotifierWorkData(workData, permitLocationTypes, permitConditions)).thenReturn(eventNotifierWorkData)
      when(attributeMapper.mapMessageAttributes(eventNotifierWorkData.usrn, eventNotifierWorkData.highway_authority, eventNotifierWorkData.activity_type, eventNotifierWorkData.area_name, eventNotifierWorkData.promoter_organisation)).thenReturn(messageAttributes)
      when(eventNotifierSNSMessageMapper.mapToSNSMessage(eventNotifierSQSMessage, eventNotifierWorkData)).thenReturn(eventNotifierSNSMessage)
      when(snsPublishInputMapper.mapToSNSPublishInput(eventNotifierSNSMessage, permitTopic, messageAttributes)).thenReturn(snsPublishInput)
      when(snsService.publishMessage(snsPublishInput)).thenResolve()
      when(eventLogMapper.generateEventLogMessage(eventNotifierSQSMessage, timeReceived)).thenReturn(expectedLogMessage)

      await permitObjectMessageService.sendMessageToSNS(eventNotifierSQSMessage, timeReceived, KNEX, KNEX_POSTGIS)

      verify(snsService.publishMessage(snsPublishInput)).once()
      verify(logger.logWithObject('Message successfully sent to SNS:', expectedLogMessage)).once()
    })
  })
})
