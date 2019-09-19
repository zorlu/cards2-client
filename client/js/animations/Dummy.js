/**
 * Created by hasan on 7/31/2019.
 */

var Dummy = function(data){
    this.key = "dummy";
    this.initialized = false;
    this.completed = false;
    this.animation = null;

    var player, character;

    this.init = function() {
        player = Game.getPlayerByUid(data.uid);
        character = player;
        if (typeof (data.uuid) !== "undefined") {
            character = player.ground.getCardByUUID(data.uuid);
        }

        if (typeof(data.textanim) !== "undefined"){
            this.animation = new CreatureTextAnimation();
            this.animation.init(character, data.textanim);
        }

        this.initialized = true;
    };

    this.animate = function(){
         if (!this.completed) {

             if (this.animation && !this.animation.completed) {
                 this.animation.update();

             } else {
                 this.completed = true;
             }
         }
    }
};