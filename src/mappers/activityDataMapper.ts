import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { ActivityData } from '../models/activityData'
import { EventNotifierActivityData, RefTrafficManagementType, ActivityLocationType, RefActivityActivityType } from 'street-manager-data'
import { asOptionalTime, booleanFilter, locationTypeFilter } from '../filters'
import GeometryService from '../services/geometryService'
import TYPES from '../types'

@injectable()
export default class ActivityDataMapper {

  public constructor(@inject(TYPES.GeometryService) private geometryService: GeometryService) {}

  public mapActivityDataToEventNotifierActivityData(activityData: ActivityData, locationTypes: ActivityLocationType[]): EventNotifierActivityData {
    return {
      activity_reference_number: activityData.activity_reference_number,
      usrn: activityData.usrn.toString(),
      street_name: activityData.street_name,
      area_name: activityData.area_name,
      town: activityData.town,
      road_category: activityData.road_category.toString(),
      activity_coordinates: this.geometryService.parseGeoJSONStringToWKT(activityData.activity_coordinates.toString()),
      activity_name: activityData.activity_name,
      activity_type: RefActivityActivityType[activityData.activity_activity_type_id],
      start_date: activityData.start_date.toISOString(),
      start_time: asOptionalTime(activityData.start_time),
      end_date: activityData.end_date.toISOString(),
      end_time: asOptionalTime(activityData.end_time),
      activity_location_type: locationTypes ? this.mapActivityLocationTypesToString(locationTypes) : null,
      traffic_management_required: booleanFilter(activityData.traffic_management_required),
      traffic_management_type: RefTrafficManagementType[activityData.traffic_management_type_id],
      collaborative_working: booleanFilter(activityData.collaborative_working),
      cancelled: booleanFilter(activityData.cancelled),
      highway_authority_swa_code: activityData.ha_organisation_reference,
      highway_authority: activityData.ha_organisation_name
    }
  }

  private mapActivityLocationTypesToString(activityLocationTypes: ActivityLocationType[]): string {
    const activityLocationTypesAsArray: string[] = activityLocationTypes.map((activityLocationType: ActivityLocationType) => locationTypeFilter(activityLocationType.location_type_id))

    return activityLocationTypesAsArray.join(', ')
  }
}
