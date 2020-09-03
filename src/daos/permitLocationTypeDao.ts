import { injectable } from 'inversify'
import * as Knex from 'knex'
import { PermitLocationType } from 'street-manager-data'

@injectable()
export default class PermitLocationTypeDao {

  private readonly PERMIT_LOCATION_TYPE_TABLE_NAME = 'permit_location_type'

  private readonly PERMIT_LOCATION_TYPE_COLUMNS: string[] = [
    'location_type_id',
    'permit_version_id'
  ]

  public async getByPermitVersionId(permitVersionId: number, knex: Knex): Promise<PermitLocationType[]> {
    return await knex(this.PERMIT_LOCATION_TYPE_TABLE_NAME)
      .select(this.PERMIT_LOCATION_TYPE_COLUMNS)
      .where('permit_version_id', permitVersionId)
  }
}
