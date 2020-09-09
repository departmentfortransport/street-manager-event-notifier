import 'mocha'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { EventNotifierSQSMessage } from 'street-manager-data'
import { assert } from 'chai'
import { EventLogMessage } from '../../../src/models/eventLogMessage'
import EventLogMapper from '../../../src/mappers/eventLogMapper'

describe('EventLogMapper', () => {
  const eventLogMapper: EventLogMapper = new EventLogMapper()

  describe('generateEventLogMessage', () => {
    it('should map SQS message properties, time received & time sent to EventLogMessage', async () => {
      const eventNotifierSQSMessage: EventNotifierSQSMessage = generateSQSMessage()
      const timeReceived: Date = new Date()

      const result: EventLogMessage = eventLogMapper.generateEventLogMessage(eventNotifierSQSMessage, timeReceived)

      assert.equal(result.event_reference, eventNotifierSQSMessage.event_reference)
      assert.equal(result.object_reference, eventNotifierSQSMessage.object_reference)
      assert.equal(result.time_message_received, timeReceived)
      assert.typeOf(result.time_message_sent, 'date')
    })
  })
})
