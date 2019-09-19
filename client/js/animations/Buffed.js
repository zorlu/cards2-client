/**
 * Created by hasan on 7/20/2019.
 */

var Buffed = function(data) {
    this.key = "buffed";
    this.initialized = false;
    this.completed = false;
    var player, card;

    this.init = function(){
        console.log("CardBuffed.init");
        player = Game.getPlayerByUid(data.uid);
        card = player.ground.getCardByUUID(data.uuid);
        this.initialized = true;
    };
    this.animate = function(){
        if (!this.completed){

            card.buffs.push({
                'type': data.buff_type,
                'desc': data.desc,
                'anim': data.buff_anim
            });
            this.completed = true;
        }
    };
};