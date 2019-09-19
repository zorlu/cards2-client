/**
 * Created by hasan on 7/13/2019.
 */

var PlaySpell = function(data){
    this.key = "play-spell";
    this.initialized = false;
    this.completed = false;
    this.extraAnimation = null;

    this.isMySpellCard = false;
    this.delay = 150;
    this.tickInterval = 0;

    var player, card, targetX, targetY, targetCard;

    this.init = function(){

        player = Game.getPlayerByUid(data.uid);
        card = player.hand.getCardByUUID(data.uuid);

        if (data.target){
            targetCard = Game.getOppositePlayer(data.uid).ground.getCardByUUID(data.target);
            // TODO make it programatic
            if (data.animation) {
                var func = window[data.animation];

                try {
                    this.extraAnimation = new func(
                        new Pos(card.x, card.y),
                        new Pos(targetCard.x + (targetCard.getWidth() / 2), (targetCard.y + (targetCard.getHeight() / 2)))
                    );
                    this.extraAnimation.init();
                } catch (e){
                    // probably data.animation class not found in js/animations/xxx.js
                    console.error(e);
                }
            }
        }

        if (card.isMine()) {
            card.where = "dying";
            this.isMySpellCard = true;
        } else {
            player.preview.add(card);
        }

        card.opacity = 1;

        card.x = parseInt(card.x);
        card.y = parseInt(card.y);

        targetX = parseInt(player.graveyard.x + (player.graveyard.width / 2));
        targetY = parseInt(player.graveyard.y);

        this.initialized = true;
    };

    this.animate = function(){
        if (!this.isMySpellCard){
            this.tick();
        }
        if (!this.completed){

            if ( (!this.isMySpellCard && this.timesUp()) || this.isMySpellCard) {

                if (!this.isMySpellCard){
                    player.preview.clear();
                }

                if (this.extraAnimation && !this.extraAnimation.completed) {
                    this.extraAnimation.animate();

                } else {
                    //console.log("spell card dying", card.opacity);
                    card.opacity -= 0.05;
                    if (card.opacity <= 0) {
                        player.hand.removeCard(card);
                        player.graveyard.addCard(card);
                        player.turn.remainingMana = data.remaining_mana;
                        player.refreshCardAvailability();
                        this.completed = true;
                    }
                }
            }
        }
    };
    this.tick = function(){
        this.tickInterval++;
    };
    this.timesUp = function () {
        return this.tickInterval >= this.delay;
    };
};
