import 'mocha'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import { EventNotifierWorkData, EventNotifierSQSMessage, EventNotifierSNSMessage } from 'street-manager-data'
import { assert } from 'chai'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'

describe('EventNotifierSNSMessageMapper', () => {
  const eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper = new EventNotifierSNSMessageMapper()

  let sqsMessage: EventNotifierSQSMessage
  let eventNotifierWorkData: EventNotifierWorkData

  before(() => {
    sqsMessage = generateSQSMessage()
    eventNotifierWorkData = generateEventNotifierWorkData()
  })

  describe('mapSQSToSNSMessage', () => {
    it('should map the sqs message to an sns message', async () => {
      const eventNotifierSNSMessage: EventNotifierSNSMessage = eventNotifierSNSMessageMapper.mapToSNSMessage(sqsMessage, eventNotifierWorkData)

      assert.equal(eventNotifierSNSMessage.event_reference, sqsMessage.event_reference)
      assert.equal(eventNotifierSNSMessage.event_type, sqsMessage.event_type)
      assert.equal(eventNotifierSNSMessage.object_data, eventNotifierWorkData)
      assert.equal(eventNotifierSNSMessage.event_time, sqsMessage.event_time)
      assert.equal(eventNotifierSNSMessage.object_type, sqsMessage.object_type)
      assert.equal(eventNotifierSNSMessage.object_reference, sqsMessage.object_reference)
      assert.equal(eventNotifierSNSMessage.version, 1)
    })
  })
})
