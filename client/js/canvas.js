/**
 * Created by hasan on 6/14/2019.
 */

var canvas = document.querySelector("canvas");
canvas.width = 1500;
canvas.height = window.innerHeight - 20;
canvas.style.left = "10px";
canvas.style.top = "10px";
canvas.style.position = "absolute";
var context = canvas.getContext("2d");
canvas.addEventListener('click', elemClick, false);
window.addEventListener('keyup', keyboard, false);
canvas.addEventListener('mousemove', mousemove, false);
canvas.addEventListener('mousedown', mousedown, false);
canvas.addEventListener('mouseup', mouseup, false);

function keyboard(event){
    if (event.which === 32) { // space
        //Game.drawCard();
    }
}

function mousedown(event){
    //canvas.className = "mouseDown";
    if (Game.animations.length){ // no mouse action allowed when something animating right now
        return false;
    }

    var pos = new Pos(event.clientX, event.clientY);

    if (Game.targetSelectorCard) {
        Game.targetSelectorCard = null;
    }

    if (Game.flyingCard){
        Game.flyingCard.where = "hand";
        Game.flyingCard = null;
    }

    Game.player.ground.cards.forEach(function(card) {
        if (card.intersect(pos) && card.isMine() && card.playableNow) {
            Game.targetSelectorCard = card;
        }
    });

    Game.player.hand.cards.forEach(function(card){
        if (card.intersect(pos) && card.isMine() && card.playableNow){
            if (Game.flyingCard){
                Game.flyingCard.where = "hand";
            }
            card.where = "flying";
            card.x = pos.x - (card.getWidth() / 2);
            card.y = pos.y - (card.getHeight() / 2);
            Game.flyingCard = card;

            if (card.selector){
                Game.targetSelectorCard = card;
            }
        }
    });

}

function mouseup(event){
    var card;
    var pos = new Pos(event.clientX, event.clientY);


    if (Game.flyingCard && !Game.flyingCard.selector){
        card = Game.flyingCard;

        if (card.isCreature()) {
            for (var i = 0; i < Game.player.ground.slots.length; i++){
                var slot = Game.player.ground.slots[i];
                if (slot.intersect(pos)) {
                    Game.player.playCreatureCard(card, slot.no);
                    //actionDone2 = true;
                    Game.flyingCard = null;
                    return false; // means break in forEach?
                }
            }
        } else {
            //actionDone2 = true;
            if (pos.y < Game.player.hand.y) {  // if moved on ground
                Game.player.playSpellCard(card);
                Game.flyingCard = null;
                return false; // means break in forEach?
            }
        }
        card.where = "hand";
        Game.flyingCard = null;
        return false;
    }


    if (Game.targetSelectorCard) {
        Game.opponent.preview.clear();
        card = Game.targetSelectorCard;
        var actionDone = false;

        var lookupCards = null;

        if (card.where === "ground"){
            lookupCards = Game.opponent.ground.cards;
        } else {

            if (card.selector.indexOf("opponent:ground") > -1) { // attacking card does not have selector
                lookupCards = Game.opponent.ground.cards;
            } else if (card.selector.indexOf("player:ground") > -1) {
                lookupCards = Game.player.ground.cards;
            } else if (card.selector.indexOf("both:ground") > -1) {
                lookupCards = Game.player.ground.cards.concat(Game.opponent.ground.cards);
            }
        }

        // targeting a card
        if (lookupCards) {
            lookupCards.forEach(function (target) {
                if (target.intersect(pos) && card.isMine() && card.playableNow) {
                    if (card.isCreature()) {

                        if (card.where === "ground") {  // attacking
                            Game.player.attackFromGround(card, target);
                            actionDone = true;

                        } else {  // playing from hand
                            var slot = Game.player.ground.getAvailableSlot();
                            if (slot > -1) {
                                Game.player.playCreatureCard(card, slot, target);
                                actionDone = true;
                            }
                        }

                    } else {
                        if (!target.immune) {
                            console.log("playing spell card as target selector");
                            Game.player.playSpellCard(card, target);
                        } else {
                            console.log("target is immune!");
                        }
                        actionDone = true;
                    }
                }
            });
        }

        if (!actionDone) {  // check if targeting to player
            console.log("opponent.intersect", Game.opponent.intersect(pos), "card.isMine", card.isMine(), "card.playableNow", card.playableNow);
            if (Game.opponent.intersect(pos) && card.isMine() && card.playableNow){

                if (card.isCreature()) {

                    Game.player.cardAttackToPlayer(card, Game.opponent.uid);
                    actionDone = true;
                } else {
                    console.log("spellTargetToPlayer");
                    Game.player.spellTargetToPlayer(card, Game.opponent);  // TODO implement this
                    actionDone = true;
                }

            } else if (Game.player.intersect(pos) && card.isMine() && card.playableNow){
                // TODO my card targeting me??
            }


        }

        if (!actionDone){
            if (card.isCreature()){
                if (card.where === "flying"){ //battlecry select target
                    card.where = "hand";
                } else {
                    card.where = "ground";  // ground attacked
                }
            } else {
                card.where = "hand";
            }
        }
    }

    if (Game.flyingCard){
        Game.flyingCard = null;
    }
    if (Game.targetSelectorCard){
        Game.targetSelectorCard = null;
    }
}

function mousemove(event){
    var pos = new Pos(event.clientX, event.clientY);

    // if selector under the flying card on hand
    if (Game.flyingCard && Game.targetSelectorCard && Game.flyingCard !== Game.targetSelectorCard){
        Game.targetSelectorCard = null;
    }

    if (Game.flyingCard){
        if (Game.player.preview.card) {
            Game.player.preview.clear();
        }

        if (Game.opponent.preview.card) {
            Game.opponent.preview.clear();
        }

        var card = Game.flyingCard;
        var cardHeight = card.getHeight();
        var cardWidth = card.getWidth();

        if (card.selector) {
            if (pos.y >= Game.player.hand.y - (cardHeight/2)){
                card.y = Game.player.hand.y - (cardHeight/2);

                Game.targetSelectorCard = card;
            }
        } else {
            // max y
            if (pos.y - (cardHeight / 2) >= Game.player.ground.y) {
                card.y = pos.y - (cardHeight / 2);
            }

            // max x
            if (pos.x - (cardWidth / 2) >= Game.player.ground.x && pos.x - (cardWidth / 2) <= Game.player.ground.x + Game.player.ground.width) {
                card.x = pos.x - (cardWidth / 2);
            }
        }

        //console.log("Game.flyingCard moving", Game.flyingCard.x, Game.flyingCard.y, Game.flyingCard.where);
    } else {
        if (!Game.targetSelectorCard && !Game.flyingCard && Game.animations.length === 0) { // if not in action show preview
            var previewing = false;
            Game.opponent.ground.cards.concat(Game.player.ground.cards).forEach(function (card) {
                if (card.intersect(pos)) {
                    Game.opponent.preview.add(card);
                    previewing = true;
                }
            });
            if (!previewing && Game.opponent.preview.card) {
                Game.opponent.preview.clear();
            }

            previewing = false;
            Game.player.hand.cards.forEach(function (card) {
                if (card.intersect(pos) && card.where === "hand") {
                    Game.player.preview.add(card);
                    previewing = true;
                }
            });
            if (!previewing && Game.player.preview.card) {
                Game.player.preview.clear();
            }

        }
    }

    if (Game.targetSelectorCard){
        if (Game.player.preview.card) {
            Game.player.preview.clear();
        }
        if (Game.opponent.preview.card) {
            Game.opponent.preview.clear();
        }
        Game.targetSelectorPos = pos;
    }

}


function elemClick(event){
    var pos = {
        x: event.clientX,
        y: event.clientY
    };

    // DEBUG: Click on player's deck -> draw card
    if (pos.y > Game.player.deck.y && pos.y < Game.player.deck.y + Game.player.deck.height
            && pos.x > Game.player.deck.x && pos.x < Game.player.deck.x + Game.player.deck.width) {

            Game.player.drawCard();
            return null;
    }

    // DEBUG: Click on Turn button -> end turn
    if (pos.y > Turn.button.y && pos.y < Turn.button.y + Turn.button.height
            && pos.x > Turn.button.x && pos.x < Turn.button.x + Turn.button.width) {

        Turn.whosTurn.endTurn();
        return null;
    }
}
