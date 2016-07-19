var InputManager = function() {
  var up, down, left, right;

}

InputManager.prototype.downEvent = function(event) {
  if(event.keyCode == 87) {
    this.up = true;
  }
  if(event.keyCode == 83) {
    this.down = true;
  }
  if(event.keyCode == 65) {
    this.left = true;
  }
  if(event.keyCode == 68) {
    this.right = true;
  }
}

InputManager.prototype.upEvent = function(event) {
  if(event.keyCode == 87) {
    this.up = false;
  }
  if(event.keyCode == 83) {
    this.down = false;
  }
  if(event.keyCode == 65) {
    this.left = false;
  }
  if(event.keyCode == 68) {
    this.right = false;
  }
}

InputManager.prototype.init = function (){
  document.addEventListener('keydown', this.downEvent);
  document.addEventListener('keyup', this.upEvent);
}
