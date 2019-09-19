/**
 * Created by hasan on 12/08/19.
 */


var Shuffled = function(data){
    this.key = "shuffled";
    this.initialized = false;
    this.completed = false;
    this.speed = 8;

    var oplayer, ocard, player, card, fromPos, toPos, startPos, toPlayerX, toPlayerY, toPlayerLength;

    this.init = function(){
        player = Game.getPlayerByUid(data.copy.uid);
        player.deck.cardCount = data.deck_count;

        card = CardDB.createCard(data.copy.key, data.copy.uuid, player.uid);
        card.visible = true;


        if (typeof data.original !== "undefined") {
            oplayer = Game.getPlayerByUid(data.original.uid);
            ocard = CardDB.createCard(data.original.key, data.original.uuid, data.original.uid);

            ocard.x = player.hand.x + player.hand.width;
            ocard.y = player.hand.y;

            card.x = ocard.x;
            card.y = ocard.y;
        } else {  // shuffling the card that is not in this game, probably in spell.summon field
            card.x = player.hand.x + player.hand.width;
            card.y = player.hand.y;
        }

        card.where = "flying";
        card.opacity = 0.5;

        fromPos = new Pos(card.x, card.y);
        startPos = fromPos;

        toPos = new Pos(player.deck.x, player.deck.y); // default pos

        if (player.deck.x >= fromPos.x){
            toPos.x = player.deck.x - (player.deck.width / 2);
        } else if (player.deck.x <= fromPos.x){
            toPos.x = player.deck.x + (player.deck.width / 2);
        }

        if (player.deck.y >= fromPos.y){
            toPos.y = player.deck.y - (player.deck.height / 2);
        } else if (player.deck.y >= fromPos.y){
            toPos.y = player.deck.y + (player.deck.height / 2);
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
            if ( (startPos.x < toPos.x && card.x >= toPos.x) || (startPos.x > toPos.x && card.x <= toPos.x)){
                xArrived = true;
            }

            if ( (startPos.y < toPos.y && card.y >= toPos.y) || (startPos.y > toPos.y && card.y <= toPos.y)){
                yArrived = true;
            }

            if (xArrived && !yArrived){
                console.log("Shuffled.js xArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", card.x, card.y);
            }

            if (xArrived && yArrived){
                //player.deck.addCard(card);
                card.where = "deck";
                card.opacity = 1;
                this.completed = true;
                console.log("shuffled", card.uuid);
            }
        }
    };
};