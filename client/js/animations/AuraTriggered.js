/**
 * Created by hasan on 7/16/2019.
 */

var AuraTriggered = function(data){
    this.key = "aura-triggered";
    this.initialized = false;
    this.completed = false;
    this.delay = 150;
    this.tickInterval = 0;

    var player, card;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);
        card.auraTriggered = true;
        this.initialized = true;
    };

    this.animate = function(){  // TODO do some animation
        this.tick();
        if (!this.completed){
            if (this.timesUp()) {
                card.auraTriggered = false;
                this.completed = true;
            }
        }
    };

    this.tick = function () {
        this.tickInterval++;
    };

    this.timesUp = function () {
        return this.tickInterval >= this.delay;
    };
};
