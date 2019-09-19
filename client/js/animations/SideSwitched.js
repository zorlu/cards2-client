/**
 * Created by hasan on 8/4/2019.
 */
/**
 * Created by hasan on 7/13/2019.
 */

var SideSwitched = function(data){
    this.key = "side-switched";
    this.initialized = false;
    this.completed = false;
    this.speed = 4;

    var fromPlayer, fromCard, toPlayer, toCard, toSlot, fromPos, toPos, startPos, toPlayerX, toPlayerY, toPlayerLength;

    this.init = function(){
        fromPlayer = Game.getPlayerByUid(data.from['uid']);
        fromCard = fromPlayer.ground.getCardByUUID(data.from['uuid']);

        toPlayer = Game.getPlayerByUid(data.to['uid']);

        toSlot = toPlayer.ground.slots[data.to['slot']];

        //toCard = toPlayer.ground.getCardByUUID(data.target['uuid']);

        fromCard.where = "flying";

        fromPos = new Pos(fromCard.x, fromCard.y);
        startPos = fromPos;

        toPos = new Pos(toSlot.x, toSlot.y); // default pos

        if (toSlot.x >= fromPos.x){
            toPos.x = toSlot.x - (toSlot.width / 2);
        } else if (toSlot.x <= fromPos.x){
            toPos.x = toSlot.x + (toSlot.width / 2);
        }

        if (toSlot.y >= fromPos.y){
            toPos.y = toSlot.y - (toSlot.height / 2);
        } else if (toSlot.y >= fromPos.y){
            toPos.y = toSlot.y + (toSlot.height / 2);
        }

        // DIAGONAL MOVING
        // Calculate direction towards player
        toPlayerX = toPos.x - fromCard.x;
        toPlayerY = toPos.y - fromCard.y;
        // Normalize
        toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
        toPlayerX = toPlayerX / toPlayerLength;
        toPlayerY = toPlayerY / toPlayerLength;

        this.initialized = true;
    };

    this.animate = function(){

        if (!this.completed){
            // Move towards the player
            fromCard.x += toPlayerX * this.speed;
            fromCard.y += toPlayerY * this.speed;

            var xArrived = false;
            var yArrived = false;
            if ( (startPos.x < toPos.x && fromCard.x >= toPos.x) || (startPos.x > toPos.x && fromCard.x <= toPos.x)){
                xArrived = true;
            }

            if ( (startPos.y < toPos.y && fromCard.y >= toPos.y) || (startPos.y > toPos.y && fromCard.y <= toPos.y)){
                yArrived = true;
            }

            if (xArrived && !yArrived){
                console.log("SideSwitched.js xArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", fromCard.x, fromCard.y);
            }

            if (xArrived && yArrived){
                fromPlayer.ground.removeCard(fromCard);
                fromCard.uuid = data.to['uuid'];
                fromCard.uid = toPlayer.uid;
                toPlayer.ground.addCard(fromCard, data.to['slot']);


                toPlayer.refreshCardAvailability();
                fromPlayer.refreshCardAvailability();

                this.completed = true;
            }
        }
    };
};