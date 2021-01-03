const w = 500 
const h = 500
const fontSize = 40
const textColor = "white"
const backColor = "#bdbdbd"
const delay = 100 
const scGap = 0.02 
const text = "2020"
const newText = "1"

const {Canvas} = require('canvas')
const GifEncoder = require('gifencoder')
const {createWriteStream} = require('fs')

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
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale) {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawRotatingText(context, scale) {
        
        const sf = 0.01 + ScaleUtil.sinify(scale)
        const sfNext = ScaleUtil.divideScale(sf, 1, 2)
        const gap = h / (text.length + 2)
        context.font = context.font.replace(/\d+/g, fontSize)
        const sfi = ScaleUtil.divideScale(sf, 0, 2)
        context.fillStyle = textColor 
        for (var j = 0; j < text.length; j++) {
            const tw = context.measureText(text[j]).width
            context.save()
            context.translate(w / 2, gap * (j + 1))

            context.rotate(2 * Math.PI * sfi)
            context.scale(sfi, sfi)
            if (j == text.length - 1) {
                context.fillText(text[j], -tw / 2 + (w * 0.5 + tw) * sfNext, 0)
            } else {
                context.fillText(text[j], -tw / 2, 0)
            }
            context.restore()
        }
        const tw1 = context.measureText(newText).width
        context.fillText(newText, w / 2 - tw1 / 2 - (w * 0.5 + 2 * tw1) * (1 - sfNext), gap * (text.length))
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

class Renderer {

    constructor() {
        this.encoder = new GifEncoder(w, h)
        this.canvas = new Canvas()
        this.loop = new Loop()
        this.node = new NewYearNode()
        this.init()
    }

    init() {
        this.encoder.setQuality(200)
        this.encoder.setDelay(delay)
        this.encoder.setRepeat(0)
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
    }

    start(fileName) {
        this.encoder.createReadStream().pipe(createWriteStream(fileName))
        this.encoder.start()
        this.loop.start(() => {
            this.node.draw(this.context, (context) => {
                this.encoder.addFrame(context)
                console.log("adding frawe")
            })
            this.node.update(() => {
                this.loop.stop()
                this.encoder.end()
                console.log("stopping")
            })
        })
    }
}

const renderer = new Renderer()
renderer.start('test.gif')