import * as Knex from 'knex'
import { injectable } from 'inversify'
import { HighLevelWorkData } from 'street-manager-data'

@injectable()
export default class PermitDao {

  private readonly PERMIT_TABLE_NAME = 'permit'

  private PERMIT_COLUMNS: string[] = [
    'work.work_reference_number',
    'permit.permit_reference_number',
    'permit.promoter_swa_code',
    'promoter_organisation.organisation_name as promoter_organisation_name',
    'permit.highway_authority_swa_code',
    'ha_organisation.organisation_name as ha_organisation_name',
    'permit_coordinates.permit_coordinates',
    'work.street_name',
    'work.area_name',
    'permit_version.work_category_id', // join reference table for string value
    'permit_version.traffic_management_type_id', // join reference table for string value
    'permit_version.proposed_start_date',
    'permit_version.proposed_start_time',
    'permit_version.proposed_end_date',
    'permit_version.proposed_end_time',
    'permit.actual_start_date',
    'permit.actual_end_date',
    'work.work_status_id',
    'work.usrn'
  ]

  public async getPermit(permitReferenceNumber: string, knex: Knex): Promise<HighLevelWorkData> {
    const query: Knex.QueryBuilder = this.preparePermitsQuery(permitReferenceNumber, knex)
      .select(this.PERMIT_COLUMNS)
      .limit(1)

    return await query.first()
  }

  private preparePermitsQuery(permitReferenceNumber: string, knex: Knex): Knex.QueryBuilder {
    const query: Knex.QueryBuilder = knex(this.PERMIT_TABLE_NAME)
      .innerJoin('work', 'permit.work_id', 'work.work_id')
      .innerJoin('organisation as promoter_organisation', 'promoter_organisation.org_ref', 'work.promoter_organisation_reference')
      .innerJoin('organisation as ha_organisation', 'ha_organisation.org_ref', 'work.ha_organisation_reference')
      .where('permit.permit_reference_number', permitReferenceNumber.toUpperCase())

    return query
  }
}
