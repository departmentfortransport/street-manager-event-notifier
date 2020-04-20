import 'reflect-metadata'
import { AWSError } from 'aws-sdk'
import { injectable } from 'inversify'

export type AWSCallback<Response> = (err: AWSError, response: Response) => void
export type AWSMethod<Request, Response> = (params: Request, callback: AWSCallback<Response>) => void

@injectable()
export default abstract class AWSService<Service> {

  protected constructor(protected service: Service) {}

  protected toAWSPromise<Request, Response>(awsMethod: AWSMethod<Request, Response>, params: Request): Promise<Response> {
    return new Promise((resolve, reject) =>
      awsMethod.bind(this.service)(params, (err: AWSError, response: Response) =>
        err ? reject(err) : resolve(response)
      )
    )
  }
}
