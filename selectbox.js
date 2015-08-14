'use strict'

var createShader = require('gl-shader')
var createBuffer = require('gl-buffer')

module.exports = createSelectBox

function SelectBox(plot, boxBuffer, boxShader) {
  this.plot = plot
  this.boxBuffer = boxBuffer
  this.boxShader = boxShader
}

var proto = SelectBox.prototype

proto.draw = function() {
}

proto.update = function(options) {
}

proto.dispose = function() {
}

function createSelectBox(plot) {
  var buffer = createBuffer(gl, [
    0, 0,
    0, 1,
    1, 0,
    1, 1 ])
  var shader = createShader(gl, SHADERS.boxVertex, SHADERS.boxFragment)

  

}
