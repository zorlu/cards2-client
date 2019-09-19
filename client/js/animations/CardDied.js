/**
 * Created by hasan on 7/13/2019.
 */

var CardDied = function(data){
    this.key = "card-died";
    this.initialized = false;
    this.completed = false;
    this.animation = null;

    var targetX, targetY, player, card;

    this.init = function(){
        console.log("CardDied.init", data);
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);

        card.x = parseInt(card.x);
        card.y = parseInt(card.y);
        targetX = parseInt(player.graveyard.x);
        targetY = parseInt(player.graveyard.y);

        player.ground.removeCard(card);
        card.where = "dying";

         if (typeof(data.textanim) !== "undefined"){
            this.animation = new CreatureTextAnimation();
            this.animation.init(card, data.textanim);
        }

        this.initialized = true;
    };

    this.animate = function(){  // TODO do some animation
        if (!this.completed){
            if (this.animation && !this.animation.completed){
                this.animation.update();

            } else {
                card.opacity -= 0.02;
                if (card.opacity <= 0) {
                    player.graveyard.addCard(card);
                    this.completed = true;
                }
            }
        }
    };
};
