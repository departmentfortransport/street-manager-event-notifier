import * as Knex from 'knex'
import { injectable } from 'inversify'
import { KnexPostgis } from 'knex-postgis'
import 'reflect-metadata'
import { ActivityData } from '../models/activityData'

@injectable()
export default class ActivityDao {
  private readonly ACTIVITY_TABLE_NAME = 'activity'

  private ACTIVITY_COLUMNS: string[] = [
    'activity.activity_id',
    'activity.activity_reference_number',
    'activity.usrn',
    'activity.street_name',
    'activity.area_name',
    'activity.town',
    'activity.road_category',
    'activity.activity_name',
    'activity.activity_activity_type_id',
    'activity.start_date',
    'activity.start_time',
    'activity.end_date',
    'activity.end_time',
    'activity.traffic_management_required',
    'activity.traffic_management_type_id',
    'activity.collaborative_working',
    'activity.cancelled',
    'ha_organisation.org_ref as ha_organisation_reference',
    'ha_organisation.organisation_name as ha_organisation_name'
  ]

  public async getActivityData(activityReferenceNumber: string, knex: Knex, knexPostgis: KnexPostgis): Promise<ActivityData> {
    const query: Knex.QueryBuilder = this.prepareActivityQuery(activityReferenceNumber, knex)
      .select([
        ...this.ACTIVITY_COLUMNS,
        knexPostgis.asGeoJSON('activity.activity_coordinates').as('activity_coordinates')
      ])

    return await query.first()
  }

  private prepareActivityQuery(activityReferenceNumber: string, knex: Knex): Knex.QueryBuilder {
    return knex(this.ACTIVITY_TABLE_NAME)
      .innerJoin('organisation as ha_organisation', 'ha_organisation.organisation_id', 'activity.ha_organisation_id')
      .where('activity.activity_reference_number', activityReferenceNumber.toUpperCase())
  }
}
