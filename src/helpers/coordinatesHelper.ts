import WorksCoordinates from '../models/worksCoordinates'
import { coordinateFilter } from '../filters'
import { flatten } from 'underscore'

  export function mapCoordinatesToCSV(coordinates: string): string {
    const coordinatesObject: WorksCoordinates = JSON.parse(coordinates)
    const coordinatesAsFlatArray: number[] = flatten(coordinatesObject.coordinates)
    const formattedCoordinates: string[] = coordinatesAsFlatArray.map((coordinate: number) => coordinateFilter(coordinate))

    return `${coordinatesObject.type}: ${formattedCoordinates}`
  }
