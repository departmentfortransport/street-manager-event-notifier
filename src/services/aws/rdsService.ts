import { injectable, inject } from 'inversify'
import { RDS } from 'aws-sdk'
import AWSService from './awsService'
import TYPES from '../../types'
import Logger from '../../utils/logger'

@injectable()
export default class RDSService extends AWSService<RDS.Signer> {
  public constructor(
    @inject(TYPES.RDSSigner) private rds: RDS.Signer,
    @inject(TYPES.Logger) private logger: Logger) {
    super(rds)
  }

  public async getAuthToken(): Promise<string> {
    try {
      return super.toAWSPromise<RDS.Signer.SignerOptions, string>(this.rds.getAuthToken, null)
    } catch (err) {
      this.logger.error(err)
    }

    return null
  }
}
