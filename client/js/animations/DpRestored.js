/**
 * Created by hasan on 7/29/2019.
 */


var DpRestored = function(data){
    this.key = "dp-restored";
    this.initialized = false;
    this.animation = null;
    this.completed = false;

    var player, card;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);
        if (typeof(data.textanim) !== "undefined"){
            this.animation = new CreatureTextAnimation();
            this.animation.init(card, data.textanim);
        }
        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){

            if (this.animation && !this.animation.completed){
                this.animation.update();

            } else {
                card.dp_increased = false;
                card.dp_decreased = false;
                card.setDp(data.dp);
                this.completed = true;
            }
        }
    }

};