const w = 500 
const h = 500
const fontSize = 40
const textColor = "white"
const backColor = "black"
const delay = 20 
const scGap = 0.02 
const text = "2020"
const newText = "1"

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

class ScaleUtil {

    static maxScale(scale, i, n) {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale, i, n) {
        return Math.min(1 / n, ScaleUtil.divideScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawRotatingText(context, scale) {
        const sf = ScaleUtil.sinify(scale)
        const sfNext = DrawingUtil.divideScale(sf, 1, 2)
        const gap = h / (2 * text.length)
        context.font = `${fontSize}px sans-serif`
        context.fillStyle = textColor 
        for (var j = 0; j < text.length; j++) {
            const tw = context.measureText(text[i]).width
            const tw1 = context.measureText(newText).width
            const sfi = ScaleUtil.divideScale(sf, 0, 2)
            context.save()
            context.translate(w / 2, gap * (i + 1))
            context.rotate(2 * Math.PI * sfi)
            context.scale(sfi, sfi)
            if (j == text.length - 1) {
                context.fillText(text[i], -tw / 2 + (w * 0.5 + tw) * sfNext, 0)
                context.fillText(newText, -tw1 / 2 - (w * 0.5 + tw) * (1 - sfNext), 0)
            }
            context.restore()
        }
    }

    static drawBackground(context) {
        context.fillStyle = backColor 
        context.fillRect(0, 0, w, h)
    }
}

class NewYearNode  {

    constructor() {
        this.state = new State()
    }

    draw(context, cb) {
        DrawingUtil.drawBackground(context)
        DrawingUtil.drawRotatingText(context, this.state.scale)
        cb(context)
    }

    update(cb) {
        this.state.update(cb)
    }
}

class Loop {

    constructor() {
        this.animated = false 
    }

    start(cb) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, 0)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}
