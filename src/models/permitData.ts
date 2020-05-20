import { RefActivityType, RefTrafficManagementType } from 'street-manager-data'

export interface PermitData {
  street_name: string
  usrn: number
  town: string
  area_name?: string
  road_category: number
  permit_coordinates: GeoJSON.GeometryObject | string
  activity_type_id: RefActivityType
  proposed_start_date: Date
  proposed_start_time?: Date
  proposed_end_date: Date
  proposed_end_time?: Date
  // location types
  works_location_description: string
  traffic_management_type_id: RefTrafficManagementType
  collaborative_working: boolean
  // additional info
  // cancelled
  promoter_swa_code: string
  highway_authority_swa_code: string
}
