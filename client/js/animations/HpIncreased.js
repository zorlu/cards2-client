/**
 * Created by hasan on 7/13/2019.
 */

var HpIncreased = function(data){
    this.key = "hp-increased";
    this.initialized = false;
    this.completed = false;
    this.animation = null;

    var player, card;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        card = player.getCardByUUID(data.uuid);

        if (card && card.where === "ground") {
            if (typeof(data.textanim) !== "undefined") {
                this.animation = new CreatureTextAnimation();
                console.log("HpIncreased", data);
                this.animation.init(card, data.textanim);
            }
        }


        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){

            if (this.animation && !this.animation.completed){
                this.animation.update();

            } else {
                if (card) {
                    card.hp_decreased = false;
                    card.hp_increased = true;
                    card.setHp(data.hp);
                } else {
                    console.log("CardNotFound", data);
                }
                this.completed = true;
            }
        }
    };
};