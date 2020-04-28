import 'mocha'
import * as sinon from 'sinon'
import SNSService from '../../../../src/services/aws/snsService'
import { SNS } from 'aws-sdk'
import { assert } from 'chai'
import Logger from '../../../../src/utils/logger'
import { mock} from 'ts-mockito'

describe('snsService', () => {

  let service: SNSService

  let sns: SNS
  let logger: Logger

  beforeEach(() => {
    sns = new SNS()
    logger = mock(Logger)

    service = new SNSService(sns, logger)
  })

  describe('getToken', () => {
    let publish: sinon.SinonStub

    beforeEach(() => {
      publish = sinon.stub()
      sns.publish = publish
    })

    it('should send provided message to provided topic', async () => {
      publish.yields(null, 1)

      const message = JSON.stringify({test: 'message'})
      const arn = 'topicArn'

      await service.publishMessage(message, arn)

      const input: SNS.PublishInput = publish.lastCall.args[0]

      assert.equal(input.Message, message)
      assert.equal(input.TopicArn, arn)
    })
  })
})
