import { injectable } from 'inversify'

@injectable()
export default class Logger {

  public log(message: string): void {
    console.log(message)
  }

  public logSuccess(object_reference: string, event_reference: string, timeReceived: string, timeSent: string): void {
    this.log(`Message successfully sent to SNS:
    - object reference: ${object_reference}
    - event reference: ${event_reference}
    - time message received: ${timeReceived}
    - time message sent: ${timeSent}
   `)
  }

  public error(message: string): void {
    console.error(message)
  }
}
