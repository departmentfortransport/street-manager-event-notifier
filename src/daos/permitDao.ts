import * as Knex from 'knex'
import { injectable } from 'inversify'
import * as postgis from 'knex-postgis'
import { WorkData } from '../models/workData'
import 'reflect-metadata'

@injectable()
export default class PermitDao {
  private readonly PERMIT_TABLE_NAME = 'permit'

  private PERMIT_COLUMNS: string[] = [
    'work.work_reference_number',
    'permit.permit_reference_number',
    'promoter_organisation.org_ref as promoter_organisation_reference',
    'promoter_organisation.organisation_name as promoter_organisation_name',
    'ha_organisation.org_ref as ha_organisation_reference',
    'ha_organisation.organisation_name as ha_organisation_name',
    'work.street_name',
    'work.area_name',
    'permit_version.permit_version_id',
    'permit_version.work_category_id',
    'permit_version.traffic_management_type_id',
    'permit_version.proposed_start_date',
    'permit_version.proposed_start_time',
    'permit_version.proposed_end_date',
    'permit_version.proposed_end_time',
    'permit.actual_start_date',
    'permit.actual_end_date',
    'work.work_status_id',
    'work.usrn',
    'permit_version.activity_type_id',
    'permit_version.is_ttro_required',
    'permit.is_covid_19_response'
  ]

  public async getWorkData(permitReferenceNumber: string, knex: Knex, knexPostgis: postgis.knexPostgis): Promise<WorkData> {
    const query: Knex.QueryBuilder = this.preparePermitsQuery(permitReferenceNumber, knex)
      .select([
        ...this.PERMIT_COLUMNS,
        knexPostgis.asGeoJSON('permit_version.permit_coordinates').as('permit_coordinates')
      ])

    return await query.first()
  }

  private preparePermitsQuery(permitReferenceNumber: string, knex: Knex): Knex.QueryBuilder {
    return knex(this.PERMIT_TABLE_NAME)
      .innerJoin('permit_version', 'permit.permit_id', 'permit_version.permit_id').where('permit_version.is_current_version', true)
      .innerJoin('work', 'permit.work_id', 'work.work_id')
      .innerJoin('organisation as promoter_organisation', 'promoter_organisation.organisation_id', 'work.promoter_organisation_id')
      .innerJoin('organisation as ha_organisation', 'ha_organisation.organisation_id', 'work.ha_organisation_id')
      .where('permit.permit_reference_number', permitReferenceNumber.toUpperCase())
  }
}
