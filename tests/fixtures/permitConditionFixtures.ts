import { PermitPermitCondition, RefPermitConditionType } from 'street-manager-data'

export function generatePermitPermitCondition(permitVersionId: number, permitConditionId: RefPermitConditionType = RefPermitConditionType.NCT01a): PermitPermitCondition {
  return {
    permit_version_id: permitVersionId,
    permit_condition_id: permitConditionId
  }
}
