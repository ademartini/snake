'use strict';
// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  
var canvas, context, model;

var blocksX = 40;
var blocksY = 30;
var initialSnakeLength = 3;
var initialSpeed = 5;

//Modified example from http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = blocksX / blocksY;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;

    } else {
        newHeight = newWidth / widthToHeight;
    }
    
    gameArea.style.height = newHeight + 'px';
    gameArea.style.width = newWidth + 'px';

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

function init() {

    canvas = $('#gameCanvas')[0];
    context = canvas.getContext( '2d' );
}

function draw() {

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  var blockDimension = gameCanvas.height / blocksY;

  context.beginPath();
  context.rect(0, 0, gameCanvas.width, gameCanvas.height);
  context.fillStyle = '#B99C6B';
  context.fill();
  context.lineWidth = blockDimension * 2;
  context.strokeStyle = '#855723';
  context.stroke();

  if(!model){

      context.fillStyle = 'green';
      context.font = 'italic bold 30px sans-serif';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillText('Welcome - Click to Begin!', gameCanvas.width / 2, gameCanvas.height / 2);    
      return;
  }

  _.each(model.snakeSegments,function(seg){

    context.beginPath();
    context.rect(blockDimension*seg.position.x, blockDimension*seg.position.y, blockDimension, blockDimension);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();    
  });

  _.each(model.foodItems,function(item){

    context.beginPath();
    context.rect(blockDimension*item.position.x, blockDimension*item.position.y, blockDimension, blockDimension);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
    context.stroke();    
  });

  context.fillStyle = 'black';
  context.font = 'italic bold 24px sans-serif';
  context.textBaseline = 'top';
  context.textAlign = 'left';
  context.fillText('Score: ' + model.score, blockDimension, blockDimension);

  if(model.paused){

      context.fillStyle = 'black';
      context.font = 'italic bold 30px sans-serif';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillText('PAUSED', gameCanvas.width / 2, gameCanvas.height / 2);

  }
  else if(model.gameOver){

      context.fillStyle = 'black';
      context.font = 'italic bold 30px sans-serif';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillText('GAME OVER', gameCanvas.width / 2, gameCanvas.height / 2);
  }


}

var fps, fpsInterval, now, then, elapsed;


function animate() {


    requestAnimFrame(animate);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);

        draw();
        if(model != null){
          model.update(); 
        }
    }
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animate();
}

init();
startAnimating(60);
resizeGame();

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: 
          model.requestDirectionChange('left');
        break;

        case 38:
          model.requestDirectionChange('up');
        break;

        case 39:
          model.requestDirectionChange('right');
        break;

        case 40:
          model.requestDirectionChange('down');
        break;

        case 32:
          model.togglePause();
        default: return;
    }
    e.preventDefault();
});

$('#gameCanvas').click(function(){

  model = new GameModel(initialSpeed,initialSnakeLength,blocksX,blocksY);
});
