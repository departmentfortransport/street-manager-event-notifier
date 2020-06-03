import { RefWorkCategory } from 'street-manager-data'

export function booleanFilter(value: boolean | string) {
  if (value === true || value === 'true') {
    return 'Yes'
  } else if (value === false || value === 'false') {
    return 'No'
  } else {
    return 'Not provided'
  }
}

enum WorksStatusType {
  planned = 'Works planned',
  in_progress = 'Works in progress',
  completed = 'Works completed',
  cancelled = 'Works cancelled',
  unattributable = 'Unattributable works',
  historical = 'Historical works',
  non_notifiable = 'Non notifiable works',
  section_81 = 'Section 81 works'
}

export function worksStatusFilter(workStatus: string) {
  return WorksStatusType[workStatus]
}

enum WorksCategory {
  'Minor' = RefWorkCategory.minor,
  'Standard' = RefWorkCategory.standard,
  'Major' = RefWorkCategory.major,
  'Major (PAA)' = RefWorkCategory.paa,
  'Immediate - urgent' = RefWorkCategory.immediate_urgent,
  'Immediate - emergency' = RefWorkCategory.immediate_emergency,
  'HS2 (Highway)' = RefWorkCategory.hs2_highway
}

export function worksCategoryFilter(worksCategoryId: number) {
  return WorksCategory[worksCategoryId]
}

enum FormattedTrafficManagementType {
  'Road closure' = 1,
  'Contra-flow' = 2,
  'Lane closure' = 3,
  'Multi-way signals' = 4,
  'Two-way signals' = 5,
  'Convoy workings' = 6,
  'Stop/go boards' = 7,
  'Priority working' = 8,
  'Give and take' = 9,
  'Some carriageway incursion' = 10,
  'No carriageway incursion' = 11
}

export function trafficManagementTypeFilter(trafficManagementTypeId: number) {
  return FormattedTrafficManagementType[trafficManagementTypeId]
}

enum ActivityType {
  'Highway improvement works' = 1,
  'Highway repair and maintenance works' = 2,
  'Utility asset works' = 3,
  'Utility repair and maintenance works' = 4,
  'Diversionary works' = 5,
  'Disconnection or alteration of supply' = 6,
  'Permanent reinstatement' = 7,
  'Remedial works' = 8,
  'Section 58' = 9,
  'Section 50' = 10,
  'Core Sampling' = 11,
  'Statutory Infrastructure Works' = 12,
  'Works for Rail Purposes' = 13,
  'Works for road purposes' = 14,
  'New service connection' = 15,
  'Optional permit (no fee) e.g. for traffic management etc' = 16
}

export function activityTypeFilter(activityTypeId: number) {
  return ActivityType[activityTypeId]
}

export function coordinateFilter(value: number): string {
  return ('00' + Number(value).toFixed(2)).slice(-9)
}

export function asOptionalTime(dateToFormat?: Date): string {
  return dateToFormat ? dateToFormat.toISOString() : null
}

export function asOptionalDateTime(dateToFormat?: Date): string {
  return dateToFormat ? dateToFormat.toISOString() : null
}
