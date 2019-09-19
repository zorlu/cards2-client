/**
 * Created by hasan on 7/20/2019.
 */

var DeBuffed = function(data) {
    this.key = "debuffed";
    this.initialized = false;
    this.completed = false;
    var player, card;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);
        this.initialized = true;
    };
    this.animate = function(){
        if (!this.completed){
            card.buffs.splice(0, 1);
            this.completed = true;
        }
    };
};