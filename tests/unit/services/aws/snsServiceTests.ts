import 'mocha'
import * as sinon from 'sinon'
import SNSService from '../../../../src/services/aws/snsService'
import { SNS } from 'aws-sdk'
import { assert } from 'chai'
import Logger from '../../../../src/utils/logger'
import { mock } from 'ts-mockito'

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
      const messageAttributes = {
        'USRN': {
          DataType: 'Number',
          StringValue: '001001'
        }
      }

      const input: SNS.PublishInput = {
        Message: message,
        TopicArn: arn,
        MessageAttributes: messageAttributes
      }

      await service.publishMessage(input)

      const methodInput: SNS.PublishInput = publish.lastCall.args[0]

      assert.equal(methodInput.Message, input.Message)
      assert.equal(methodInput.TopicArn, input.TopicArn)
      assert.equal(methodInput.MessageAttributes, input.MessageAttributes)
    })

    it('should return error from SNS', async () => {
      publish.yields(new Error('error'))

      const message = JSON.stringify({test: 'message'})
      const arn = 'topicArn'
      const messageAttributes = {
        'USRN': {
          DataType: 'Number',
          StringValue: '001001'
        }
      }

      const input: SNS.PublishInput = {
        Message: message,
        TopicArn: arn,
        MessageAttributes: messageAttributes
      }

      try {
        await service.publishMessage(input)
        assert.fail()
      } catch (err) {
        assert.equal(err.message, 'error')
      }
    })
  })
})
