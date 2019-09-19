/**
 * Created by hasan on 8/4/2019.
 */

var ReturnedHand = function(data){
    this.key = "returned-hand";
    this.initialized = false;
    this.completed = false;
    this.speed = 4;

    var player, card, fromPos, toPos, startPos, toPlayerX, toPlayerY, toPlayerLength;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);

        card.where = "flying";

        fromPos = new Pos(card.x, card.y);
        startPos = fromPos;

        toPos = new Pos(player.hand.x, player.hand.y); // default pos

        if (player.hand.x >= fromPos.x){
            toPos.x = player.hand.x - (player.hand.width / 2);
        } else if (player.hand.x <= fromPos.x){
            toPos.x = player.hand.x + (player.hand.width / 2);
        }

        if (player.hand.y >= fromPos.y){
            toPos.y = player.hand.y - (player.hand.height / 2);
        } else if (player.hand.y >= fromPos.y){
            toPos.y = player.hand.y + (player.hand.height / 2);
        }

        // DIAGONAL MOVING
        // Calculate direction towards player
        toPlayerX = toPos.x - card.x;
        toPlayerY = toPos.y - card.y;
        // Normalize
        toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
        toPlayerX = toPlayerX / toPlayerLength;
        toPlayerY = toPlayerY / toPlayerLength;

        this.initialized = true;
    };

    this.animate = function(){

        if (!this.completed){
            // Move towards the player
            card.x += toPlayerX * this.speed;
            card.y += toPlayerY * this.speed;

            var xArrived = false;
            var yArrived = false;
            if ( (startPos.x <= toPos.x && card.x >= toPos.x) || (startPos.x >= toPos.x && card.x <= toPos.x)){
                xArrived = true;
            }

            if ( (startPos.y <= toPos.y && card.y >= toPos.y) || (startPos.y >= toPos.y && card.y <= toPos.y)){
                yArrived = true;
            }

            if (xArrived && !yArrived){
                console.log("ReturnedHand.js xArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", card.x, card.y);
            } else if (!xArrived && yArrived){
                console.log("ReturnedHand.js yArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", card.x, card.y);
            }

            if (xArrived && yArrived){
                player.ground.removeCard(card);
                // we have to create a new card to prevent changes (hp_decreased, buffed etc)
                var newCard = CardDB.createCard(card.key, card.uuid, player.uid);
                newCard.visible = true;
                Game.cards.unshift(newCard);  // TODO not working properly put the beginning of the array, when drawing cards, this array running reverse(), look at Game.loop()
                player.hand.addCard(newCard);

                player.refreshCardAvailability();

                this.completed = true;
            }
        }
    };
};