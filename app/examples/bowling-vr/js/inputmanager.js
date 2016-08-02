"use strict";

const InputManager = {
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
    shift: false,

    init: function() {
      document.addEventListener('keydown', this.downEvent);
      document.addEventListener('keyup', this.upEvent);
    },

    downEvent: function(event) {
      if(event.keyCode == 87) {
        InputManager.w = true;
      }
      if(event.keyCode == 83) {
        InputManager.s = true;
      }
      if(event.keyCode == 65) {
        InputManager.a = true;
      }
      if(event.keyCode == 68) {
        InputManager.d = true;
      }
      if(event.keyCode == 16) {
        InputManager.shift = true;
      }
      if(event.keyCode == 32) {
        InputManager.space = true;
      }
    },

    upEvent: function(event) {
      if(event.keyCode == 87) {
        InputManager.w = false;
      }
      if(event.keyCode == 83) {
        InputManager.s = false;
      }
      if(event.keyCode == 65) {
        InputManager.a = false;
      }
      if(event.keyCode == 68) {
        InputManager.d = false;
      }
      if(event.keyCode == 16) {
        InputManager.shift = false;
      }
      if(event.keyCode == 32) {
        InputManager.space = false;
      }
    }
}
