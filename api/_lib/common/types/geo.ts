interface ILocationRectangle {
  north: number|string|null|undefined
  south: number|string|null|undefined
  west: number|string|null|undefined
  east: number|string|null|undefined
}

interface ILocationRectangleDbType {
  north: number
  south: number
  west: number
  east: number
}

export { ILocationRectangle, ILocationRectangleDbType }
