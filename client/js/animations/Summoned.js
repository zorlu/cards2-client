/**
 * Created by inovaktif on 18/08/19.
 */

var Summoned = function(data) {
    this.key = "summoned";
    this.initialized = false;
    this.completed = false;
    var player, card, slot;

    this.init = function(){
        //console.log("Summoned.data", data);
        player = Game.getPlayerByUid(data.uid);
        card = CardDB.createCard(data.key, data.uuid, data.uid);
        slot = player.ground.slots[data.slot];

        card.where = "flying";
        card.x = slot.x;
        card.y = slot.y;
        card.opacity = 0;
        card.visible = true;

        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){
            card.opacity += 0.02;
            if (card.opacity >= 1){
                card.opacity = 1;
                player.ground.addCard(card, data.slot);
                this.completed = true;
            }
        }
    };
};