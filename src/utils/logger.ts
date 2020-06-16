import { injectable } from 'inversify'

@injectable()
export default class Logger {

  public log(message: string): void {
    console.log(message)
  }

  public logWithObject(message: string, object: any): void {
    console.log(message, object)
  }

  public error(message: string): void {
    console.error(message)
  }
}
