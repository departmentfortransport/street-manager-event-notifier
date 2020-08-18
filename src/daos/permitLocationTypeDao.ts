import { injectable } from 'inversify'
import * as Knex from 'knex'
import { PermitLocationType } from 'street-manager-data'

@injectable()
export default class PermitLocationTypeDao {

  private readonly PERMIT_LOCATION_TYPE_TABLE_NAME = 'permit_location_type'

  public async getByPermitVersionId(permitVersionId: number, knex: Knex): Promise<PermitLocationType[]> {
    return await knex(this.PERMIT_LOCATION_TYPE_TABLE_NAME).where('permit_version_id', permitVersionId)
  }
}
