import 'mocha'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import PermitObjectMessageService from '../../../src/services/permitObjectMessageService'
import SNSService from '../../../src/services/aws/snsService'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import Logger from '../../../src/utils/logger'
import { generatePublishInput } from '../../fixtures/publishInputFixtures'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'

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
      when(snsPublishInputMapper.mapToSNSPublishInput(anything())).thenResolve(generatePublishInput())
      when(snsService.publishMessage(anything())).thenResolve()

      await permitObjectMessageService.sendMessageToSNS(generateSQSMessage())

      verify(logger.logSuccess(anything(), anything(), anything(), anything())).once()
      verify(snsService.publishMessage(anything())).once()
    })
  })
})
