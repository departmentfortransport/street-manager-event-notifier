import { RefTrafficManagementType, RefWorkCategory, RefWorkStatus, RefActivityType } from 'street-manager-data'

export interface WorkData {
  work_reference_number: string
  permit_reference_number: string
  promoter_organisation_reference: string
  promoter_organisation_name: string
  ha_organisation_reference: string
  ha_organisation_name: string
  permit_coordinates: GeoJSON.GeometryObject | string
  street_name: string
  area_name: string
  work_category_id: RefWorkCategory
  traffic_management_type_id: RefTrafficManagementType
  proposed_start_date: Date
  proposed_end_date: Date
  proposed_start_time?: Date
  proposed_end_time?: Date
  actual_start_date: Date
  actual_end_date: Date
  work_status_id: RefWorkStatus
  usrn: number
  activity_type_id: RefActivityType
  is_ttro_required: boolean
  is_covid_19_response?: boolean
  permit_version_id?: number
  road_category: number
  is_traffic_sensitive: false
  is_deemed: boolean
  permit_status_id: number
  town?: string
}
