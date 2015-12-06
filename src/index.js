
import React from 'react'
import ReactDOM from 'react-dom'

import Actions from './actions'
import Map from './map'
import Menu from './menu'
import Filter from './filter'


class Dashboard extends React.Component {
    constructor (props) {
        super(props)
    }

    render = _ => (
        <div className="dashboard">
            <Map />
            <Filter />
            <Menu />
        </div>
    )
}

ReactDOM.render(<Dashboard />, document.querySelector('.app'))

Actions.setObservations([
    {
        id: 0,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.64847946166991, 40.001615831553735]
        },
        properties: {
            aspect: 20
        }
    }, {
        id: 1,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.66345691680908, 39.99563244990408]
        },
        properties: {
            aspect: 240
        }
    }, {
        id: 2,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.63075542449951, 40.0006624706907]
        },
        properties: {
            aspect: 45
        }
    }, {
        id: 3,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.6703233718872, 40.00178020277094]
        },
        properties: {
            aspect: 45
        }
    }, {
        id: 4,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.62247276306151, 39.99599409774689]
        },
        properties: {
            aspect: 90
        }
    }, {
        id: 5,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.64568996429443, 40.00973529662184]
        },
        properties: {
            aspect: 270
        }
    }, {
        id: 6,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.64114093780518, 39.99129252641165]
        },
        properties: {
            aspect: 135
        }
    }, {
        id: 7,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.66792011260986, 40.00329239940286]
        },
        properties: {
            aspect: 180
        }
    }, {
        id: 8,
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-105.63101291656493, 40.00980103733694]
        },
        properties: {
            aspect: 340
        }
    }
])
