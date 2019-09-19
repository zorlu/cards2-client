/**
 * Created by hasan on 7/13/2019.
 */

var CardAttacked = function(data){
    this.key = "card-attacked";
    this.initialized = false;
    this.completed = false;
    this.speed = 15;

    var attackerPlayer, attackerCard, targetPlayer, targetCharacter, fromPos, toPos, startPos, toPlayerX, toPlayerY, toPlayerLength;

    this.init = function(){
        attackerPlayer = Game.getPlayerByUid(data.attacker['uid']);
        attackerCard = attackerPlayer.ground.getCardByUUID(data.attacker['uuid']);
        if (!attackerCard){
            console.error("AttackerNotFound", data.attacker, attackerPlayer.ground.cards)
        }


        targetPlayer = Game.getPlayerByUid(data.target['uid']);
        targetCharacter = targetPlayer;
        if (typeof(data.target['uuid']) !== "undefined") {
            targetCharacter = targetPlayer.ground.getCardByUUID(data.target['uuid']);
        }

        attackerCard.where = "attacking";
        if (typeof(data.attacker['attacked_this_turn']) !== "undefined"){
            attackerCard.playableNow = false;  // prevent multiple attack in one turn
        }

        fromPos = new Pos(attackerCard.x, attackerCard.y);
        startPos = new Pos(attackerCard.x, attackerCard.y);

        toPos = new Pos(targetCharacter.x, targetCharacter.y); // default pos

        if (targetCharacter.x >= fromPos.x){
            toPos.x = targetCharacter.x - (targetCharacter.getWidth() / 2);
        } else if (targetCharacter.x <= fromPos.x){
            toPos.x = targetCharacter.x + (targetCharacter.getWidth() / 2);
        }

        if (targetCharacter.y >= fromPos.y){
            toPos.y = targetCharacter.y - (targetCharacter.getHeight() / 2);
        } else if (targetCharacter.y >= fromPos.y){
            toPos.y = targetCharacter.y + (targetCharacter.getHeight() / 2);
        }

        // DIAGONAL MOVING
        // Calculate direction towards player
        toPlayerX = toPos.x - attackerCard.x;
        toPlayerY = toPos.y - attackerCard.y;
        // Normalize
        toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
        toPlayerX = toPlayerX / toPlayerLength;
        toPlayerY = toPlayerY / toPlayerLength;

        this.initialized = true;
    };

    this.animate = function(){

        if (!this.completed){
            // Move towards the player
            attackerCard.x += toPlayerX * this.speed;
            attackerCard.y += toPlayerY * this.speed;

            var xArrived = false;
            var yArrived = false;
            if ( (startPos.x < toPos.x && attackerCard.x >= toPos.x) || (startPos.x > toPos.x && attackerCard.x <= toPos.x)){
                xArrived = true;
            }

            if ( (startPos.y < toPos.y && attackerCard.y >= toPos.y) || (startPos.y > toPos.y && attackerCard.y <= toPos.y)){
                yArrived = true;
            }

            if (xArrived && !yArrived){
                console.log("CardAttacked.js xArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", attackerCard.x, attackerCard.y);
            }

            if (xArrived && yArrived){
                attackerCard.where = "ground";
                attackerPlayer.refreshCardAvailability();

                this.completed = true;
            }
        }
    };
};