/**
 * Created by hasan on 7/15/2019.
 */

var HpRestored = function(data){
    this.key = "hp-restored";
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
                card.hp_increased = false;
                card.hp_decreased = false;
                card.setHp(data.hp);
                this.completed = true;
            }
        }
    }

};