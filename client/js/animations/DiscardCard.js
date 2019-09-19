/**
 * Created by inovaktif on 11/08/19.
 */


var DiscardCard = function(data) {
    this.key = "discard-card";
    this.completed = false;
    this.initialized = false;

    this.previewAnimCompleted = false;
    this.isMySpellCard = false;
    this.delay = 100;
    this.tickInterval = 0;

    var player, card;

    this.init = function() {
        player = Game.getPlayerByUid(data.uid);
        player.deck.cardCount = data.deck_count;
        card = CardDB.createCard(data.ckey, data.uuid, data.uid);
        card.x = parseInt(player.preview.x);
        //if (card.isMine()) {
        card.where = "preview";
        player.preview.add(card);
        //}
        //player.deck.removeCard(card);
        
        this.initialized = true;
    };

    this.animate = function () {

        if (!this.completed) {
            if (!this.previewAnimCompleted) {

                this.tick();
                if (this.timesUp()) {
                    this.previewAnimCompleted = true;
                }
            } else {
                player.preview.card.opacity -= 0.05;
                if (player.preview.card.opacity <= 0){
                    player.preview.clear();

                    player.graveyard.addCard(card);
                    player.refreshCardAvailability();
                    this.completed = true;
                }
            }
        }
    };

    this.tick = function(){
        this.tickInterval++;
    };
    this.timesUp = function () {
        return this.tickInterval >= this.delay;
    };
};