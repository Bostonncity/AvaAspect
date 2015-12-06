
import Reflux from 'reflux'

import Actions from './actions'

let data = {
    observations: [],
    minAspect: 0,
    maxAspect: 360
}


const ObservationStore = Reflux.createStore({
    listenables: Actions,

    angleDiff (a, b) {
        let d = Math.abs(a - b) % 360
        return d > 180 ? 360 - d : d
    },

    onSetObservations (observations) {
        data.observations = observations

        this.trigger(data)
    },

    onAddObservation (observation) {
        observation.id = data.observations.length + 1
        data.observations.push(observation)

        this.trigger(data)
    },

    onSetAspect (aspect) {
        /* For the initial setAspect, set the max or min based on the aspect
         * being less than or greater than 180
         */
        if (data.minAspect == 0 && data.maxAspect == 360) {
            if (aspect < 180) {
                data.maxAspect = aspect
            } else {
                data.minAspect = aspect
                data.maxAspect = 0
            }

        /* Otherwise, set based on closest min or max aspect, accounting for
         * values on both sides of 360
         */
        } else {
            let minDiff = this.angleDiff(data.minAspect, aspect)
              , maxDiff = this.angleDiff(data.maxAspect, aspect)

            if (minDiff < maxDiff) {
                data.minAspect = aspect
            } else {
                data.maxAspect = aspect
            }
        }

        this.trigger(data)
    },

    onSetMinAspect (aspect) {
        data.minAspect = aspect

        this.trigger(data)
    },

    onSetMaxAspect (aspect) {
        data.maxAspect = aspect

        this.trigger(data)
    },

    getDefaultData () {
        return data
    }
})

export default ObservationStore
