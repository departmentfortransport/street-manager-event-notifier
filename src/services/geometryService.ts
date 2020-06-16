import { injectable } from 'inversify'
import WorksCoordinates from '../models/worksCoordinates'
import * as wkx from 'wkx'

@injectable()
export default class GeometryService {
  public parseGeoJSONStringToWKT(worksCoordinates: string): string {
    const worksCoordinatesObject: WorksCoordinates = JSON.parse(worksCoordinates)

    const geometry: wkx.Geometry = wkx.Geometry.parseGeoJSON(worksCoordinatesObject)

    return geometry.toWkt()
  }
}
