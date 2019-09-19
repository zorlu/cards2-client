/**
 * Created by hasan on 7/13/2019.
 */

var PlayCreature = function(data){
    this.key = "play-creature";
    this.initialized = false;
    this.completed = false;
    this.isMyCreatureCard = false;
    this.speed = 10;
    this.tickInterval = 0;
    this.previewDelay = 150;
    
    var player, card, toPlayerX, toPlayerY, toPlayerLength, slot, toPos, startPos;

    this.init = function(){
        player = Game.getPlayerByUid(data['uid']);
        card = player.hand.getCardByUUID(data['uuid']);
        slot = data['slot'];

        player.hand.removeCard(card);

        startPos = new Pos(card.x, card.y);
        toPos = new Pos(player.ground.slots[slot].x, player.ground.slots[slot].y);

         // DIAGONAL MOVING
        // Calculate direction towards player
        toPlayerX = toPos.x - card.x;
        toPlayerY = toPos.y - card.y;
        // Normalize
        toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY)+1;
        toPlayerX = toPlayerX / toPlayerLength;
        toPlayerY = toPlayerY / toPlayerLength;

        this.isMyCreatureCard = card.isMine();
        if (!this.isMyCreatureCard){
            player.preview.add(card);
        }

        this.initialized = true;
    };

    this.animate = function(){
        if (!this.isMyCreatureCard){
            this.tick();
        }
        if (!this.completed) {

            if ( (!this.isMyCreatureCard && this.timesUp()) || this.isMyCreatureCard) {

                if (!this.isMyCreatureCard) {
                    player.preview.clear();
                }

                // Move towards the player
                card.x += toPlayerX * this.speed;
                card.y += toPlayerY * this.speed;

                var xArrived = false;
                var yArrived = false;
                if ((startPos.x <= toPos.x && card.x >= toPos.x) || (startPos.x >= toPos.x && card.x <= toPos.x)) {
                    xArrived = true;
                }

                if ((startPos.y <= toPos.y && card.y >= toPos.y) || (startPos.y >= toPos.y && card.y <= toPos.y)) {
                    yArrived = true;
                }
                /*
                 if (xArrived && !yArrived){
                 console.log("PlayCreature.js xArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", card.x, card.y);
                 } else if (yArrived && !xArrived){
                 console.log("PlayCreature.js yArrived True startPos:", startPos.x, startPos.y, "toPos: ", toPos.x, toPos.y, "cardPos:", card.x, card.y);
                 }
                 */

                if (xArrived && yArrived) {
                    player.ground.addCard(card, slot);
                    player.turn.remainingMana = data.remaining_mana;
                    player.refreshCardAvailability();

                    this.completed = true;
                }
            }

        }
    };

    this.tick = function(){
        this.tickInterval++;
    };
    this.timesUp = function () {
        return this.tickInterval >= this.previewDelay;
    };
};