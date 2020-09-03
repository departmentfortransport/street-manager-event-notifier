import 'reflect-metadata'
import { injectable } from 'inversify'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import { USRN, AREA, HA_ORG, PROMOTER_ORG, ACTIVITY_TYPE } from '../constants/snsMessageAttributes'

@injectable()
export default class SNSMessageAttributeMapper {

  public mapMessageAttributes(usrn: string, haOrg: string,  activityType: string, area?: string, promoterOrg?: string): MessageAttributeMap {
    const attributes: MessageAttributeMap = {
      [USRN] : {
        DataType: 'Number',
        StringValue: usrn
      },
      [HA_ORG]: {
        DataType: 'String',
        StringValue: haOrg
      },

      [ACTIVITY_TYPE]: {
        DataType: 'String',
        StringValue: activityType
      }
    }

    if (promoterOrg) {
      attributes[PROMOTER_ORG] = {
        DataType: 'String',
        StringValue: promoterOrg
      }
    }

    if (area) {
      attributes[AREA] = {
          DataType: 'String',
          StringValue: area
      }
    }

    return attributes
  }
}
