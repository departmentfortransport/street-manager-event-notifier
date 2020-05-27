import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import * as Knex from 'knex'
import RDSService from './aws/rdsService'
import TYPES from '../types'
import * as postgis from 'knex-postgis'

@injectable()
export default class DBService {
  private connection: Knex
  private knexPostgis: postgis.KnexPostgis

  public constructor(
    @inject(TYPES.RDSService) private rds: RDSService,
    @inject(TYPES.Knex) private knexConfig: Knex.Config) {
  }

  public postgis(): postgis.KnexPostgis {
    if (!this.knexPostgis) {
      this.knexPostgis = postgis(this.connection)
    }

    return this.knexPostgis
  }

  public async knex(): Promise<Knex> {
    if (!this.connection) {
      await this.connect()
    }

    return this.connection
  }

  public async destroy(): Promise<void> {
    if (this.connection) {
      this.connection.destroy()
    }
  }

  public async connect(): Promise<void> {
    const config: Knex.Config = this.knexConfig
    await this.configureConnection(<Knex.PgConnectionConfig>config.connection)
    this.connection = Knex(config)
  }

  private async configureConnection(connection: Knex.PgConnectionConfig): Promise<void> {
    if (!connection.password) {
      connection.password = await this.rds.getAuthToken()
    }
  }
}
