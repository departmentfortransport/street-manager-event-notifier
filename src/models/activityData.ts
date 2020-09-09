import { RefTrafficManagementType, RefActivityActivityType } from 'street-manager-data'

export interface ActivityData {
  activity_id?: number
  activity_reference_number: string
  usrn: number
  street_name: string
  area_name?: string
  town?: string
  road_category: number
  activity_coordinates: GeoJSON.GeometryObject | string
  activity_name: string
  activity_activity_type_id: RefActivityActivityType
  start_date: Date
  start_time?: Date
  end_date: Date
  end_time?: Date
  traffic_management_required: boolean
  traffic_management_type_id: RefTrafficManagementType
  collaborative_working: boolean
  cancelled: boolean
  ha_organisation_reference: string
  ha_organisation_name: string
}
