import { useMapEvents } from 'react-leaflet'

function UseMapEventsHook(props) {
  useMapEvents({
    click(e) {
      const newPosition = e.latlng

      props.setPosition(newPosition)
    },
  })

  return null
}

export default UseMapEventsHook
