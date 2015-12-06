
import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import difference from 'lodash.difference'

import ObservationStore from './observations'
import Actions from './actions'

L.Icon.Default.imagePath = 'img'


class Map extends React.Component {
    constructor (props) {
        super(props)
    }

    points = {}
    state = ObservationStore.getDefaultData()
    onUpdate = state => this.setState(state)

    filterObservations = (observations, minAspect, maxAspect) => {
        return observations.filter(
            observation => {
                if (minAspect < maxAspect) {
                    return (
                        observation.properties.aspect >= minAspect &&
                        observation.properties.aspect <= maxAspect
                    )
                } else {
                    return (
                        observation.properties.aspect >= minAspect ||
                        observation.properties.aspect <= maxAspect
                    )
                }
            }
        )
    }

    updateObservations = observations => {
        let mapping = observations.reduce((map, observation) => {
            map[observation.id] = observation
            return map
        }, {})

        let toAdd = difference(Object.keys(mapping), Object.keys(this.points))
        let toRemove = difference(Object.keys(this.points), Object.keys(mapping))

        for (let id of toRemove) {
            this.map.removeLayer(this.points[id])
            delete this.points[id]
        }

        for (let id of toAdd) {
            this.points[id] = L.geoJson(mapping[id]).addTo(this.map)
        }
    }

    componentDidMount = _ => {
        this.unsubscribe = ObservationStore.listen(this.onUpdate)
        this.map = L.map(ReactDOM.findDOMNode(this), {
                zoomControl: false,
                attributionControl: false
            })
            .setView([40.00187, -105.64899], 15)

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            maxZoom: 18,
            id: 'andrewsohn.713608d5',
            accessToken: 'pk.eyJ1IjoiYW5kcmV3c29obiIsImEiOiJmWVdBa0QwIn0.q_Esm5hrpZLbl1XQERtKpg'
        }).addTo(this.map)

        L.control.zoom({position: 'bottomright'}).addTo(this.map)

        this.map.on('click', e => {
            Actions.addObservation({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [e.latlng.lng, e.latlng.lat]
                },
                properties: {
                    aspect: Math.floor(Math.random() * 360)
                } 
            })
        })

        this.updateObservations(
            this.filterObservations(this.state.observations,
                                    this.state.minAspect,
                                    this.state.maxAspect)
        )
    }

    componentWillUnmount = _ => this.unsubscribe()

    componentDidUpdate = _ => {
        this.updateObservations(
            this.filterObservations(this.state.observations,
                                    this.state.minAspect,
                                    this.state.maxAspect)
        )
    }

    render = _ => <div></div>
}

export default Map
