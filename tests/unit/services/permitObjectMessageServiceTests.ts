import 'mocha'
import { mock, instance, when, verify, capture } from 'ts-mockito'
import PermitObjectMessageService, { EventLogMessage } from '../../../src/services/permitObjectMessageService'
import SNSService from '../../../src/services/aws/snsService'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import Logger from '../../../src/utils/logger'
import { generatePublishInput } from '../../fixtures/publishInputFixtures'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { EventNotifierSQSMessage } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import { ArgCaptor2 } from 'ts-mockito/lib/capture/ArgCaptor'
import { assert } from 'chai'

describe('PermitObjectMessageService', () => {
  let permitObjectMessageService: PermitObjectMessageService
  let snsService: SNSService
  let snsPublishInputMapper: SNSPublishInputMapper
  let logger: Logger

  before(() => {
    snsService = mock(SNSService)
    snsPublishInputMapper = mock(SNSPublishInputMapper)
    logger = mock(logger)

    permitObjectMessageService = new PermitObjectMessageService(
      instance(logger),
      instance(snsService),
      instance(snsPublishInputMapper)
    )
  })

  describe('sendMessageToSNS', () => {
    it('should build an SNS message, send it and log the success', async () => {
      const snsMessage: EventNotifierSQSMessage = generateSQSMessage()
      const publishInput: SNS.PublishInput =  generatePublishInput()
      const timeReceived: Date = new Date()

      when(snsPublishInputMapper.mapToSNSPublishInput(snsMessage)).thenResolve(publishInput)
      when(snsService.publishMessage(publishInput)).thenResolve()

      await permitObjectMessageService.sendMessageToSNS(snsMessage, timeReceived)

      const argCaptor: ArgCaptor2<string, EventLogMessage> = capture<string, EventLogMessage>(logger.logWithObject)
      const [message, eventLog] = argCaptor.first()

      assert.equal(message, 'Message successfully sent to SNS:')
      assert.equal(eventLog.event_reference, snsMessage.event_reference)
      assert.equal(eventLog.object_reference, snsMessage.object_reference)
      assert.equal(eventLog.time_message_received, timeReceived)

      verify(snsService.publishMessage(publishInput)).once()
    })
  })
})
