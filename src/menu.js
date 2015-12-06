
import React from 'react'
import ReactDOM from 'react-dom'

import ObservationStore from './observations'
import Actions from './actions'


class Menu extends React.Component {
    constructor (props) {
        super(props)
    }

    state = ObservationStore.getDefaultData()
    componentDidMount = _ => this.unsubscribe = ObservationStore.listen(this.onUpdate)
    componentWillUnmount = _ => this.unsubscribe()
    onUpdate = state => this.setState(state)

    render = _ => (
        <div className="menu">
            {[<strong>Aspect </strong>, this.state.minAspect, '-', this.state.maxAspect, <span>&deg;</span>]}
        </div>
    )
}

export default Menu
