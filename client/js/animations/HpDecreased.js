/**
 * Created by hasan on 7/13/2019.
 */

var HpDecreased = function(data){
    this.key = "hp-decreased";
    this.initialized = false;
    this.animation = null;
    this.completed = false;

    var player, character;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        character = player;
        if (typeof(data.uuid) !== "undefined") {
            character = player.ground.getCardByUUID(data.uuid);
        }
        
        if (typeof(data.textanim) !== "undefined"){
            this.animation = new CreatureTextAnimation();
            this.animation.init(character, data.textanim);
        }
        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){

            if (this.animation && !this.animation.completed){
                this.animation.update();

            } else {
                character.hp_increased = false;
                character.hp_decreased = true;
                character.setHp(data.hp);

                this.completed = true;
            }
        }
    };
};