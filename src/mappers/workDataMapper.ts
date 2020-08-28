import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { WorkData } from '../models/workData'
import { EventNotifierWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType, PermitLocationType, PermitPermitCondition } from 'street-manager-data'
import { worksCategoryFilter, trafficManagementTypeFilter, worksStatusFilter, asOptionalDateTime, asOptionalTime, booleanFilter, activityTypeFilter, locationTypeFilter, permitConditionFilter, permitStatusFilter } from '../filters'
import GeometryService from '../services/geometryService'
import TYPES from '../types'

@injectable()
export default class WorkDataMapper {

  public constructor(@inject(TYPES.GeometryService) private geometryService: GeometryService) {}

  public mapWorkDataToEventNotifierWorkData(workData: WorkData, locationTypes: PermitLocationType[], permitConditions: PermitPermitCondition[]): EventNotifierWorkData {
    return {
      work_reference_number: workData.work_reference_number,
      permit_reference_number: workData.permit_reference_number,
      promoter_swa_code: workData.promoter_organisation_reference,
      promoter_organisation: workData.promoter_organisation_name,
      highway_authority: workData.ha_organisation_name,
      works_location_coordinates: this.geometryService.parseGeoJSONStringToWKT(workData.permit_coordinates.toString()),
      street_name: workData.street_name,
      area_name: workData.area_name,
      work_category: worksCategoryFilter(workData.work_category_id),
      traffic_management_type: trafficManagementTypeFilter(workData.traffic_management_type_id),
      proposed_start_date: workData.proposed_start_date.toISOString(),
      proposed_start_time: asOptionalTime(workData.proposed_start_time),
      proposed_end_date: workData.proposed_end_date.toISOString(),
      proposed_end_time: asOptionalTime(workData.proposed_end_time),
      actual_start_date_time: asOptionalDateTime(workData.actual_start_date),
      actual_end_date_time: asOptionalDateTime(workData.actual_end_date),
      work_status: worksStatusFilter(RefWorkStatus[workData.work_status_id]),
      usrn: workData.usrn.toString(),
      highway_authority_swa_code: workData.ha_organisation_reference,
      work_category_ref: RefWorkCategory[workData.work_category_id],
      traffic_management_type_ref: RefTrafficManagementType[workData.traffic_management_type_id],
      work_status_ref: RefWorkStatus[workData.work_status_id],
      activity_type: activityTypeFilter(workData.activity_type_id),
      is_ttro_required: booleanFilter(workData.is_ttro_required),
      is_covid_19_response: workData.is_covid_19_response !== null ? booleanFilter(workData.is_covid_19_response) : null,
      works_location_type: locationTypes ? this.mapWorksLocationTypesToString(locationTypes) : null,
      permit_conditions: permitConditions ? this.mapPermitConditionCodesToString(permitConditions) : null,
      road_category: workData.road_category.toString(),
      is_traffic_sensitive: booleanFilter(workData.is_traffic_sensitive),
      is_deemed: booleanFilter(workData.is_deemed),
      permit_status: permitStatusFilter(workData.permit_status_id),
      town: workData.town
    }
  }

  private mapWorksLocationTypesToString(permitLocationTypes: PermitLocationType[]): string {
    const permitLocationTypesAsArray: string[] = permitLocationTypes.map((permitLocationType: PermitLocationType) => locationTypeFilter(permitLocationType.location_type_id))

    return permitLocationTypesAsArray.join(', ')
  }

  private mapPermitConditionCodesToString(permitConditions: PermitPermitCondition[]): string {
    const permitConditionCodesAsArray: string[] = permitConditions.map((condition: PermitPermitCondition) => permitConditionFilter(condition.permit_condition_id))

    return permitConditionCodesAsArray.join(', ')
  }
}
