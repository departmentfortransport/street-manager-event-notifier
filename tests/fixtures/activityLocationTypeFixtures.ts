import { ActivityLocationType } from 'street-manager-data'

export function generateActivityLocationType(activityId = 1): ActivityLocationType {
  return {
    activity_id: activityId,
    location_type_id: 1
  }
}
