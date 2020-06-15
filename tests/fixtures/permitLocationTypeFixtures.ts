import { PermitLocationType } from 'street-manager-data'

export function generatePermitLocationType(permitVersionId: number): PermitLocationType {
  return {
    permit_version_id: permitVersionId,
    location_type_id: 1
  }
}
