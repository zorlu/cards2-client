/**
 * Created by hasan on 7/7/2019.
 */

var DrawCard = function(data) {
    this.key = "drawcard";
    this.completed = false;
    this.initialized = false;

    this.firstAnimCompleted = false;
    this.isMySpellCard = false;
    this.delay = 100;
    this.tickInterval = 0;

    var player, card, targetX, targetY;

    this.init = function() {
        player = Game.getPlayerByUid(data.uid);
        player.deck.cardCount = data.deck_count;
        card = CardDB.createCard(data.ckey, data.uuid, data.uid);

        if (data.hp_increased){
            card.hp_increased = true;
            card.hp = data.hp;
        }

        if (data.dp_increased){
            card.dp_increased = true;
            card.dp = data.dp;
        }


        //card = player.deck.getCardByUUID(data.uuid);  // todo if card doesn't exist? re-sync data?

        card.where = "drawing";

        //player.deck.removeCard(card);
        /*
        card.x = parseInt(player.deck.x);
        card.y = parseInt(player.deck.y);
        */
        card.x = parseInt(player.preview.x);
        targetX = parseInt(player.preview.x);

        if (card.isMine()) {
            targetY = player.hand.y - card.getHeight();
        } else {
            targetY = player.hand.y + card.getHeight();
        }
        this.initialized = true;
        //console.log("Animation.cardDrawed initialized", data);
    };

    this.animate = function () {
        //console.log("targetX", targetX, "targetY", targetY);

        if (!this.completed) {
            if (!this.firstAnimCompleted) {
                /*
                for (var j = 0; j < 10; j++) { // +speed
                    var xArrived = false;
                    var yArrived = false;
                    if (card.x > targetX) {
                        card.x--;
                    } else if (card.x < targetX) {
                        card.x++;
                    } else {
                        xArrived = true;
                    }

                    if (card.y > targetY) {
                        card.y--;
                    } else if (card.y < targetY) {
                        card.y++;
                    } else {
                        yArrived = true;
                    }

                    if (xArrived && yArrived) {
                        this.firstAnimCompleted = true;
                        if (card.isMine()) {
                            player.preview.add(card);
                            card.visible = false;
                        }
                        break;
                    }
                }
                */
                this.firstAnimCompleted = true;
                if (card.isMine()) {
                    player.preview.add(card);
                    card.visible = false;
                }

            } else {

                if (!card.isMine()){
                    this.tickInterval = this.delay; // do not show opponents drawed card
                } else {
                    this.tick();
                }

                if (this.timesUp()){
                    player.preview.clear();
                    card.visible = true;
                    player.hand.addCard(card);
                    player.refreshCardAvailability();
                    this.completed = true;
                }


            }

        } else {
            console.log("Drawcard.completed = true");
        }
    };

    this.tick = function(){
        this.tickInterval++;
    };
    this.timesUp = function () {
        return this.tickInterval >= this.delay;
    };
};