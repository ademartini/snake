"use strict";

function Position(x,y){

    this.x = x;
    this.y = y;
}

function FoodItem(position){

    this.position = position;
}

function SnakeSegment(position, direction){

    this.position = position;
    this.direction = direction;
}

function GameModel(initialSpeed,initialSnakeLength,boardLengthX,boardLengthY){

    var _this = this;

    this.speed = initialSpeed; //units per second
    this.boardLengthX = boardLengthX;
    this.boardLengthY = boardLengthY;

    this.score = 0;
    this.gameOver = false;
    this.paused = false;

    var newDirection = null;

    var startX = boardLengthX / 2;
    var startY = boardLengthY / 2;


    this.snakeSegments = _.range(initialSnakeLength).map(function(index){

        return new SnakeSegment(new Position(startX + index,startY),'right');
    });

    var head = _.last(this.snakeSegments);

    this.foodItems = [];
    this.foodItems.push(generateRandomFoodItem());

    var then = null;

    this.togglePause = function(){
        _this.paused = !_this.paused;
    };

    this.update = function(){

        if(then == null){
            then = Date.now();
            return;
        }

        var movementInterval = 1000 / _this.speed;

        var now = Date.now();
        var elapsed = now - then;

        if (elapsed > movementInterval) {

            then = now - (elapsed % movementInterval);

            if(!_this.paused){

                checkGotFood();
                advanceSnake();
                checkGameOver();
            }

        }
    };

    function addNewSnakeSegment(){

        var tail = _this.snakeSegments[0];

        var newPosition;

        if(tail.direction === "up"){

            newPosition = new Position(tail.position.x,tail.position.y + 1);
        }
        else if(tail.direction === "down"){

            newPosition = new Position(tail.position.x,tail.position.y - 1);
        }
        else if(tail.direction === "left"){

            newPosition = new Position(tail.position.x + 1,tail.position.y);
        }
        else {

            newPosition = new Position(tail.position.x - 1,tail.position.y);
        }
        
        var newSegment = new SnakeSegment(newPosition,tail.direction);
        _this.snakeSegments.unshift(newSegment);

    }


    function checkGotFood(){

        var food = _.find(_this.foodItems, function(food){

            return _.isEqual(head.position,food.position);
        });

        if(food){

            var index = _this.foodItems.indexOf(food);
            _this.foodItems.splice(index, 1);

            _this.speed++;

            addNewSnakeSegment();

            _this.foodItems.push(generateRandomFoodItem());

            _this.score++;
        }
    }

    function generateRandomFoodItem(){

        var position;

        do{

            position = generateRandomPosition();

        } while(_.isEqual(position,head.position));
    
        return new FoodItem(position);
    }

    function generateRandomPosition(){

        return new Position(_.random(1, boardLengthX - 1),_.random(1,boardLengthY - 1));         
    }

    function checkGameOver(){

        _.each(_this.snakeSegments,function(seg){

            if(head !== seg && _.isEqual(seg.position,head.position)){

                _this.gameOver = true;
            }
        });

        if(head.position.x === boardLengthX -1 || 
            head.position.x === 0 || 
            head.position.y === boardLengthY -1 || 
            head.position.y === 0){

            _this.gameOver = true;
        }
    }

    function advanceSnake(){

        if(_this.gameOver){

            return;
        }

        for(var i = 0; i < _this.snakeSegments.length; i++){

            var cur = _this.snakeSegments[i];

            if(i !== _this.snakeSegments.length - 1){

                var next = _this.snakeSegments[i + 1];

                cur.direction = next.direction;
            }
            else if(newDirection !== null){

                if(isValidDirectionChange(cur.direction,newDirection)){

                    cur.direction = newDirection;
                }
                
                newDirection = null;
            }

            moveSegment(cur);
        }
    }

    function moveSegment(seg){

        if(seg.direction === 'up'){

            seg.position.y--;
        }
        else if(seg.direction === 'down'){
            
            seg.position.y++;
        }
        else if(seg.direction === 'left'){
            
            seg.position.x--;
        }
        else if(seg.direction === 'right'){

            seg.position.x++;
        }
    }

    function isValidDirectionChange(orginalDir,newDir){

        var validUp = (newDir === 'up') && (orginalDir === 'left' || orginalDir === 'right');
        var validDown = (newDir === 'down') && (orginalDir === 'left' || orginalDir === 'right');
        var validLeft = (newDir === 'left') && (orginalDir === 'up' || orginalDir === 'down');
        var validRight = (newDir === 'right') && (orginalDir === 'up' || orginalDir === 'down');

        return validUp || validDown || validLeft || validRight;

    }

    this.requestDirectionChange = function(direction){

        newDirection = direction;
    }
}
