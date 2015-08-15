'use strict'

var createShader = require('gl-shader')
var createBuffer = require('gl-buffer')

module.exports = createSelectBox

function SelectBox(plot, boxBuffer, boxShader) {
  this.plot = plot
  this.boxBuffer = boxBuffer
  this.boxShader = boxShader

  this.enabled = true

  this.selectBox = [Infinity,Infinity,-Infinity,-Infinity]

  this.projectLines = [
    false,
    false,
    false,
    false
  ]

  this.borderColor = [0,0,0,1]
  this.fillColor   = [0,0,0,0.25]
  this.borderWidth = 10
}

var proto = SelectBox.prototype

proto.draw = function() {
  if(!this.enabled) {
    return
  }

  var plot         = this.plot
  var borderColor  = this.borderColor
  var fillColor    = this.fillColor
  var selectBox    = this.selectBox
  var projectLines = this.projectLines
  var lineWidth    = this.borderWidth
  var fillColor    = this.fillColor
  var borderColor  = this.borderColor

  var boxes        = plot.box
  var screenBox    = plot.screenBox
  var dataBox      = plot.dataBox
  var viewBox      = plot.viewBox
  var pixelRatio   = plot.pixelRatio

  //Map select box into pixel coordinates

  boxes.bind()

  //Draw box
  var loX = (selectBox[0]-dataBox[0])*(viewBox[2]-viewBox[0])/(dataBox[2]-dataBox[0])+viewBox[0]
  var loY = (selectBox[1]-dataBox[1])*(viewBox[3]-viewBox[1])/(dataBox[3]-dataBox[1])+viewBox[1]
  var hiX = (selectBox[2]-dataBox[0])*(viewBox[2]-viewBox[0])/(dataBox[2]-dataBox[0])+viewBox[0]
  var hiY = (selectBox[3]-dataBox[1])*(viewBox[3]-viewBox[1])/(dataBox[3]-dataBox[1])+viewBox[1]

  boxes.drawBox(loX, loY, hiX, hiY, fillColor)

  //Draw border
  if(lineWidth > 0) {

    //Draw border
    var w = lineWidth * pixelRatio
    boxes.drawBox(loX-w, loY-w, hiX+w, loY+w, borderColor)
    boxes.drawBox(loX-w, hiY-w, hiX+w, hiY+w, borderColor)
    boxes.drawBox(loX-w, loY-w, loX+w, hiY+w, borderColor)
    boxes.drawBox(hiX-w, loY-w, hiX+w, hiY+w, borderColor)

    //TODO: Draw projection lines
  }
}

proto.update = function(options) {
  options = options || {}

  this.fillColor   = (options.fillColor   || [0,0,0,0.5]).slice()
  this.borderColor = (options.borderColor || [0,0,0,1]).slice()
  this.borderWidth = options.borderWidth || 0
  this.selectBox   = (options.selectBox || this.selectBox).slice()
  this.projectLines = (options.projectLines || [false, false, false, false]).slice()
}

proto.dispose = function() {
  this.boxBuffer.dispose()
  this.boxShader.dispose()
}

function createSelectBox(plot, options) {
  var gl = plot.gl
  var buffer = createBuffer(gl, [
    0, 0,
    0, 1,
    1, 0,
    1, 1 ])
  var shader = createShader(gl, SHADERS.boxVertex, SHADERS.boxFragment)
  var selectBox = new SelectBox(plot, buffer, shader)
  selectBox.update(options)
  return selectBox
}
