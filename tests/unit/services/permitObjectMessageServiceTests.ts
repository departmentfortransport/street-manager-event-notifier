import 'mocha'
import { mock, instance, when, verify, capture } from 'ts-mockito'
import PermitObjectMessageService, { EventLogMessage } from '../../../src/services/permitObjectMessageService'
import SNSService from '../../../src/services/aws/snsService'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import Logger from '../../../src/utils/logger'
import { generatePublishInput } from '../../fixtures/publishInputFixtures'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { EventNotifierSQSMessage, PermitLocationType, EventNotifierWorkData } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import { ArgCaptor2 } from 'ts-mockito/lib/capture/ArgCaptor'
import { assert } from 'chai'
import PermitDao from '../../../src/daos/permitDao'
import PermitLocationTypeDao from '../../../src/daos/permitLocationTypeDao'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { WorkData } from '../../../src/models/workData'
import { generateWorkData } from '../../fixtures/workDataFixtures'
import { generatePermitLocationType } from '../../fixtures/permitLocationTypeFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'

describe('PermitObjectMessageService', () => {
  let logger: Logger
  let snsService: SNSService
  let snsPublishInputMapper: SNSPublishInputMapper
  let permitDao: PermitDao
  let permitLocationTypeDao: PermitLocationTypeDao
  let workDataMapper: WorkDataMapper

  let permitObjectMessageService: PermitObjectMessageService

  const KNEX: any = {}
  const KNEX_POSTGIS: any = {}

  before(() => {
    logger = mock(Logger)
    snsService = mock(SNSService)
    snsPublishInputMapper = mock(SNSPublishInputMapper)
    permitDao = mock(PermitDao)
    permitLocationTypeDao = mock(PermitLocationTypeDao)
    workDataMapper = mock(WorkDataMapper)

    permitObjectMessageService = new PermitObjectMessageService(
      instance(logger),
      instance(snsService),
      instance(snsPublishInputMapper),
      instance(permitDao),
      instance(permitLocationTypeDao),
      instance(workDataMapper)
    )
  })

  describe('sendMessageToSNS', () => {
    it('should build an SNS message, send it and log the success', async () => {
      const eventNotifierSQSMessage: EventNotifierSQSMessage = generateSQSMessage()
      const workData: WorkData = generateWorkData()
      const permitLocationTypes: PermitLocationType[] = [generatePermitLocationType(workData.permit_version_id)]
      const eventNotifierWorkData: EventNotifierWorkData = generateEventNotifierWorkData()
      const snsPublishInput: SNS.PublishInput = generatePublishInput()
      const timeReceived: Date = new Date()

      when(permitDao.getWorkData(eventNotifierSQSMessage.object_reference, KNEX, KNEX_POSTGIS)).thenResolve(workData)
      when(permitLocationTypeDao.getByPermitVersionId(workData.permit_version_id, KNEX)).thenResolve(permitLocationTypes)
      when(workDataMapper.mapWorkDataToEventNotifierWorkData(workData, permitLocationTypes)).thenReturn(eventNotifierWorkData)
      when(snsPublishInputMapper.mapToSNSPublishInput(eventNotifierSQSMessage, eventNotifierWorkData)).thenResolve(snsPublishInput)
      when(snsService.publishMessage(snsPublishInput)).thenResolve()

      await permitObjectMessageService.sendMessageToSNS(eventNotifierSQSMessage, timeReceived, KNEX, KNEX_POSTGIS)

      const argCaptor: ArgCaptor2<string, EventLogMessage> = capture<string, EventLogMessage>(logger.logWithObject)
      const [message, eventLog] = argCaptor.first()

      assert.equal(message, 'Message successfully sent to SNS:')
      assert.equal(eventLog.event_reference, eventNotifierSQSMessage.event_reference)
      assert.equal(eventLog.object_reference, eventNotifierSQSMessage.object_reference)
      assert.equal(eventLog.time_message_received, timeReceived)

      verify(snsService.publishMessage(snsPublishInput)).once()
    })
  })
})
