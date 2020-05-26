import { GeoJsonGeometryTypes } from 'geojson'

export default interface WorksCoordinates {
  type: GeoJsonGeometryTypes,
  coordinates: number[]
}
