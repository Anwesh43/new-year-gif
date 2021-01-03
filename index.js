const w = 500 
const h = 500
const fontSize = 40
const backColor = "white"
const delay = 20 
const scGap = 0.02 

const {Canvas} = require('canvas')
const GifEncoder = require('gifencoder')

class State {

    constructor() {
        this.scale = 0 
    }

    update(cb) {
        this.scale += scGap 
        if (Math.abs(this.scale) > 1) {
            this.scale = 0 
            cb()
        }
    }
}