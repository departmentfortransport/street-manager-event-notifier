import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import PermitDao from '../daos/permitDao'
import WorkDataMapper from '../mappers/workDataMapper'
import { WorkData } from '../models/workData'
import { EventNotifierWorkData, EventNotifierSNSMessage, EventNotifierSQSMessage } from 'street-manager-data'

@injectable()
export default class EventNotifierSNSMessageMapper {

  public constructor(
    @inject(TYPES.PermitDao) private permitDao: PermitDao,
    @inject(TYPES.WorkDataMapper) private workDataMapper: WorkDataMapper
  ) {}

  public async mapToSNSMessage(sqsMessage: EventNotifierSQSMessage): Promise<EventNotifierSNSMessage> {
    return {
      event_reference: sqsMessage.event_reference,
      event_type: sqsMessage.event_type,
      object_data: await this.generateWorkData(sqsMessage.object_reference),
      event_time: sqsMessage.event_time,
      object_type: sqsMessage.object_type,
      object_reference: sqsMessage.object_reference,
      version: 1
    }
  }

  private async generateWorkData(permitReferenceNumber: string): Promise<EventNotifierWorkData> {
    const workData: WorkData = await this.permitDao.getPermit(permitReferenceNumber)

    return await this.workDataMapper.mapWorkDataToEventNotifierWorkData(workData)
  }
}
