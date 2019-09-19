/**
 * Created by hasan on 7/6/2019.
 */

var fireballImage = new Image();
fireballImage.src = "img/fireball_0.png";

var Fireball = function(fromPos, toPos) {
    this.initialized = false;
    this.completed = false;

    this.image = fireballImage;

    this.width = 64;
    this.height = 64;
    this.x = undefined;
    this.y = undefined;

    this.startX = undefined;
    this.startY = undefined;

    //this.tick = 0;
    this.speed = 6;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.numberOfFrames = 8;
    this.sides = {
        'L': 0,
        'LU': 1,
        'U': 2,
        'RU': 3,
        'R': 4,
        'RD': 5,
        'D': 6,
        'LD': 7
    };
    this.side = "";
    var toPlayerX, toPlayerY, toPlayerLength;

    this.init = function () {

        this.x = fromPos.x;
        this.y = fromPos.y;
        this.startX = this.x;
        this.startY = this.y;

        // DIAGONAL MOVING
        // Calculate direction towards player
        toPlayerX = toPos.x - this.x;
        toPlayerY = toPos.y - this.y;
        // Normalize
        toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
        toPlayerX = toPlayerX / toPlayerLength;
        toPlayerY = toPlayerY / toPlayerLength;


        var sideStr = "";
        if (this.x > toPos.x){
            sideStr = "L";
        } else if (this.x < toPos.x){
            sideStr = "R";
        } else {
            sideStr = "";
        }

        if (this.y > toPos.y){
            sideStr += "U";
        } else if (this.y < toPos.y){
            sideStr += "D";
        } else {
            sideStr = "";
        }
        console.log("fireball.side: ", sideStr);
        this.side = this.sides[sideStr];

        /*
         0 left
         1 left-up
         2 up
         3 right-up
         4 right
         5 right-down
         6 down
         7 left-down
        * */

    };

    this.animate = function () {
        if (!this.completed) {
            this.update();
            this.draw(0, 2);

            // Move towards the player
            this.x += toPlayerX * this.speed;
            this.y += toPlayerY * this.speed;

            var xArrived, yArrived = false;
            if ( (this.startX < toPos.x && this.x >= toPos.x) || (this.startX > toPos.x && this.x <= toPos.x)){
                xArrived = true;
            }

            if ( (this.startY < toPos.y && this.y >= toPos.y) || (this.startY > toPos.y && this.y <= toPos.y)){
                yArrived = true;
            }

            if (xArrived && yArrived){
                this.completed = true;
                return false;
            }
        }
    };

    this.draw = function () {
        context.drawImage(
            this.image,
            //frameX * this.width,
            this.frameIndex * this.width,
            this.side * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    };
    this.update = function () {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;

            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {
                // Go to the next frame
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }
    };
};

