
import React from 'react'
import ReactDOM from 'react-dom'

import ObservationStore from './observations'
import Actions from './actions'


class Filter extends React.Component {
    constructor (props) {
        super(props)
    }

    static dirs = [
        {label: 'N',  deg: 0},
        {label: 'NE', deg: 45},
        {label: 'E',  deg: 90},
        {label: 'SE', deg: 135},
        {label: 'S',  deg: 180},
        {label: 'SW', deg: 225},
        {label: 'W',  deg: 270},
        {label: 'NW', deg: 315}
    ]

    static centerX = 50
    static centerY = 50
    static radius = 40

    /* Diagonal and straight max distance from center of graph
     */
    static maxD = 25
    static maxS = 35

    /* Helper methods for circle math
     */
    static rad = a => Math.PI * a / 180
    static deg = r => r * 180 / Math.PI
    static rx = a => Filter.centerX + Filter.radius * Math.cos(Filter.rad(a - 90))
    static ry = a => Filter.centerY + Filter.radius * Math.sin(Filter.rad(a - 90))

    dragging = false
    draggingSide = null

    state = ObservationStore.getDefaultData()
    componentDidMount = _ => this.unsubscribe = ObservationStore.listen(this.onUpdate)
    componentWillUnmount = _ => this.unsubscribe()
    onUpdate = state => this.setState(state)

    mouseDown = e => {
        e.preventDefault()

        this.dragging = true
    }

    mouseMove = e => {
        if (this.dragging) {
            this.setAspectFromEvent(e)
        }
    }

    setAspectFromEvent = e => {
        let rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
          , x = e.clientX - rect.left
          , y = e.clientY - rect.top
          , deltaY = y - Filter.centerY
          , deltaX = x - Filter.centerX
          , deg = Filter.deg(Math.atan2(deltaY, deltaX)) + 90

        if (this.draggingSide === null) {
            if (deltaX > 0) {
                this.draggingSide = 'max'
            } else {
                this.draggingSide = 'min'
            }
        }

        if (deg < 0) {
            deg += 360
        }

        deg = Math.floor(deg % 360)

        if (this.draggingSide == 'max') {
            Actions.setMaxAspect(deg)
        } else if (this.draggingSide == 'min') {
            Actions.setMinAspect(deg)
        } else {
            Actions.setAspect(deg)
        }        
    }

    endDragging = _ => {
        this.dragging = false
        this.draggingSide = 'either'
    }

    render = _ => {
        return (
            <div className="filter"
                 onMouseDown={this.mouseDown}
                 onMouseLeave={this.endDragging}
                 onMouseUp={this.endDragging}
                 onMouseMove={this.mouseMove}>
                <div className="bg">
                    {Filter.dirs.map((dir, i) => <Deg dir={dir} key={i} />)}
                </div>
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx={Filter.centerX} cy={Filter.centerY} r={Filter.radius} stroke="#eee" strokeWidth="10" fillOpacity="0" />
                    <CompassLines />
                    <Selection minAspect={this.state.minAspect} maxAspect={this.state.maxAspect} />
                    <RadarChart observations={this.state.observations} />
                </svg>
            </div>
        )
    }
}

class Deg extends React.Component {
    constructor (props) {
        super(props)
    }

    handleClick = e => {
        e.stopPropagation()

        Actions.setAspect(this.props.dir.deg)
    }

    render = _ => (
        <div onClick={this.handleClick} className={'dir dir-' + this.props.dir.label}>
            {this.props.dir.label}
        </div>
    )
}

class CompassLines extends React.Component {
    constructor (props) {
        super(props)
    }

    render = _ => {
        let ns =   `M${Filter.centerX},${Filter.centerY - Filter.maxS} L${Filter.centerX},${Filter.centerY + Filter.maxS}`
          , ew =   `M${Filter.centerX - Filter.maxS},${Filter.centerY} L${Filter.centerY + Filter.maxS},${Filter.centerY}`
          , nwse = `M${Filter.centerX - Filter.maxD},${Filter.centerY - Filter.maxD} L${Filter.centerY + Filter.maxD},${Filter.centerY + Filter.maxD}`
          , nesw = `M${Filter.centerX - Filter.maxD},${Filter.centerY + Filter.maxD} L${Filter.centerY + Filter.maxD},${Filter.centerY - Filter.maxD}`

        return (
            <g>
                <path d={ns} stroke="black" strokeWidth="1" strokeOpacity="0.2" />
                <path d={ew} stroke="black" strokeWidth="1" strokeOpacity="0.2" />

                <path d={nwse} stroke="black" strokeWidth="1" strokeOpacity="0.1" />
                <path d={nesw} stroke="black" strokeWidth="1" strokeOpacity="0.1" />
            </g>
        )
    }
}

class RadarChart extends React.Component {
    constructor (props) {
        super(props)
    }

    render = _ => {
        if (this.props.observations.length === 0) return null

        //             n  ne e  se s  sw w  nw
        let aspects = [0, 0, 0, 0, 0, 0, 0, 0]
          , centerX = Filter.centerX
          , centerY = Filter.centerY
          , maxD = Filter.maxD
          , maxS = Filter.maxS
          , p
          , radarChart

        /* Bucket observations for generating radar chart.
         * Each bucket is 45 degress of slope aspect.
         */
        for (let observation of this.props.observations) {
            aspects[Math.floor(observation.properties.aspect / 45)] += 1
        }

        /* Scale each aspect as a percentage of the aspect with the most
         * observations.
         */
        p = aspects.map(aspect => aspect / Math.max.apply(null, aspects))

        /* Generate a radar graph with each point mapped to the percentage
         * distance from the center of the graph in pixels.
         */
        radarChart = [
            'M' + (centerX - (p[7] * maxD)) + ',' + (centerY - (p[7] * maxD)),  // nw
            'L' + centerX + ',' + (centerY - (p[0] * maxS)),                    // n
            'L' + (centerX + (p[1] * maxD)) + ',' + (centerY - (p[1] * maxD)),  // ne
            'L' + (centerX + (p[2] * maxS)) + ',' + centerY,                    // e
            'L' + (centerX + (p[3] * maxD)) + ',' + (centerY + (p[3] * maxD)),  // se
            'L' + centerX + ',' + (centerY + (p[4] * maxS)),                    // s
            'L' + (centerX - (p[5] * maxD)) + ',' + (centerY + (p[5] * maxD)),  // sw
            'L' + (centerX - (p[6] * maxS)) + ',' + centerY,                    // w
            'L' + (centerX - (p[7] * maxD)) + ',' + (centerY - (p[7] * maxD))   // nw
        ]

        return <path d={radarChart.join(' ')} fillOpacity="0.5" fill="#3498db" stroke="#3498db" strokeWidth="0" />
    }
}

class Selection extends React.Component {
    constructor (props) {
        super(props)
    }

    render = _ => {
        let sweep
          , diff
          , selectedAspects

        /* Determine the sweep of the selected aspect arc based on the range
         * and start and end of selection.
         */
        if (this.props.minAspect > this.props.maxAspect) {
            diff = Math.abs(360 - this.props.minAspect + this.props.maxAspect)
        } else {
            diff = Math.abs(this.props.minAspect - this.props.maxAspect)
        }

        if (diff < 180) {
            sweep = '0,1'
        } else {
            sweep = '1,1'
        }

        /* Generate the selected aspect arc
         */
        selectedAspects = [
            'M' + Filter.rx(this.props.minAspect) + ',' + Filter.ry(this.props.minAspect),
            'A' + Filter.radius + ',' + Filter.radius,
            '0',
            sweep,
            Filter.rx(this.props.maxAspect) + ',' + Filter.ry(this.props.maxAspect)
        ]

        return (
            <g>
                <path d={selectedAspects.join(' ')} stroke="#ccc" strokeWidth="10" fillOpacity="0" />

                <Handle angle={this.props.minAspect} />
                <Handle angle={this.props.maxAspect} />
            </g>
        )
    }
}

class Handle extends React.Component {
    constructor (props) {
        super(props)
    }

    handle = 8

    render = _ => {
        let handle = [
            'M' + Filter.rx(this.props.angle - this.handle) + ',' + Filter.ry(this.props.angle - this.handle),
            'A' + Filter.radius + ',' + Filter.radius,
            '0',
            '0,1',
            Filter.rx(this.props.angle + this.handle) + ',' + Filter.ry(this.props.angle + this.handle)
        ]

        return <path d={handle.join(' ')} stroke="#3498db" strokeWidth="10" fillOpacity="0" />
    }
}

export default Filter
