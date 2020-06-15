import * as moment from 'moment-timezone'
import { EventTypeNotificationEnum, ObjectTypeNotificationEnum, EventNotifierSNSMessage } from 'street-manager-data'
import { generateEventNotifierWorkData } from './eventNotifierWorkDataFixtures'

export function generateSNSMessage(): EventNotifierSNSMessage {
  return {
    event_reference: 1,
    event_type: EventTypeNotificationEnum.WORK_START,
    object_data: generateEventNotifierWorkData(),
    event_time: moment('2019-07-15 00:00').toDate(),
    object_type: ObjectTypeNotificationEnum.PERMIT,
    object_reference: 'some ref',
    version: 1
  }
}
