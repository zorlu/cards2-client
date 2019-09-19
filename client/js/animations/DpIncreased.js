/**
 * Created by hasan on 7/13/2019.
 */

var DpIncreased = function(data){
    this.key = "dp-increased";
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
                    card.dp_decreased = false; // buggy
                    card.dp_increased = true;
                    card.setDp(data.dp);
                } else {
                    console.log("CardNotFound", data);
                }
                this.completed = true;
            }
        }
    }
};