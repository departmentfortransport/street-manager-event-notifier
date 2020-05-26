import * as moment from 'moment-timezone'
import { EventNotifierSQSMessage, EventTypeNotificationEnum, ObjectTypeNotificationEnum } from 'street-manager-data'

export function generateSQSMessage(): EventNotifierSQSMessage {
  return {
    object_type: ObjectTypeNotificationEnum.Permit,
    object_reference: 'some ref',
    event_reference: 1,
    event_type: EventTypeNotificationEnum.work_start,
    event_time: moment('2019-07-15 00:00').toDate()

  }
}
