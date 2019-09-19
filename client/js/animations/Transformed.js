/**
 * Created by hasan on 18/08/19.
 */


var Transformed = function(data) {
    this.key = "transformed";
    this.initialized = false;
    this.completed = false;
    this.firstAnimCompleted = false;
    var player, ocard, ncard, slot;

    this.init = function(){
        console.log("Transformed.data", data);
        player = Game.getPlayerByUid(data.from.uid);
        ocard = player.ground.getCardByUUID(data.from.uuid);

        ncard = CardDB.createCard(data.to.key, data.to.uuid, data.to.uid);
        slot = player.ground.slots[data.to.slot];

        ocard.where = "flying";
        ocard.opacity = 1;
        ocard.x = slot.x;
        ocard.y = slot.y;
        ocard.visible = true;

        ncard.where = "flying";
        ncard.opacity = 0;
        ncard.x = slot.x;
        ncard.y = slot.y;
        ncard.visible = false;

        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){

            if (!this.firstAnimCompleted){
                //console.log("firstanim not completed", ocard.opacity);
                ocard.opacity -= 0.02;
                if (ocard.opacity <= 0) {
                    player.ground.removeCard(ocard);
                    ocard.visible = false;
                    ocard = null;
                    this.firstAnimCompleted = true;
                    ncard.visible = true;
                    console.log("firstanimcompleted", ncard.title);
                }
            } else {
                ncard.opacity += 0.02;
                if (ncard.opacity >= 1) {
                    ncard.opacity = 1;
                    player.ground.addCard(ncard, data.to.slot);

                    this.completed = true;
                }
            }
        }
    };
};