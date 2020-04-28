import { injectable, inject } from 'inversify'
import { SNS } from 'aws-sdk'
import AWSService from './awsService'
import TYPES from '../../types'
import Logger from '../../utils/logger'

@injectable()
export default class SNSService extends AWSService<SNS> {
  public constructor(
    @inject(TYPES.SNS) private sns: SNS,
    @inject(TYPES.Logger) private logger: Logger) {
    super(sns)
  }

  public async publishMessage(message: string, topic: string): Promise<void> {
    const params: SNS.PublishInput = {
      Message: message,
      TopicArn: topic
    }

    try {
      await super.toAWSPromise<SNS.PublishInput, SNS.PublishResponse>(this.sns.publish, params)
    } catch (err) {
      this.logger.error(err)
      throw new Error(err)
    }
  }
}
