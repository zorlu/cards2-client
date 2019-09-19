/**
 * Created by hasan on 7/15/2019.
 */

var HpDpSwapped = function(data){
    this.key = "hpdp-swapped";
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
            card.dp_increased = false;
            card.dp_decreased = false;
            card.hp_increased = false;
            card.hp_decreased = false;

            card.setHp(data.hp);
            card.setDp(data.dp);
            this.completed = true;
        }
    }

};