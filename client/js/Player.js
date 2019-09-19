/**
 * Created by hasan on 6/18/2019.
 */
function Player(uid){
    this.uid = uid;
    this.name = null;
    this.baseHp = 30;
    this.hp = 30;
    this.hpVisual = new PlayerHp(this);
    this.hp_increased = false;
    this.hp_decreased = false;
    this.dp_increased = false;
    this.dp_decreased = false;
    this.hand = null;
    this.deck = null;
    this.ground = null;
    this.graveyard = null;
    this.turn = null;
    this.preview = null;
    this.position = undefined;
    this.x = undefined;
    this.y = undefined;
    this.width = 80;
    this.height = 80;
    this.portrait = undefined;
}

// required for CreatureTextAnimation.js
Player.prototype.getWidth = function(){
    return this.width;
};
Player.prototype.getHeight = function(){
    return this.height;
};
Player.prototype.setHp = function(hp){
    this.hp = hp;
};

Player.prototype.intersect = function(pos){
    console.log("player.intersect", this.x, this.y, pos.x, pos.y);
    return (pos.y > this.y && pos.y < this.y + this.height && pos.x > this.x && pos.x < this.x + this.width);
};

Player.prototype.refreshCardAvailability = function(attackableCards){
    var player = this;

    // check mana requirements for cards in hand
    player.hand.cards.forEach(function(card){
        card.playableNow = card.mana <= player.turn.remainingMana;
    });


    if (attackableCards) {
        player.ground.cards.forEach(function (card) {
            card.playableNow = attackableCards.indexOf(card.uuid) > -1;
        });
    }
};

Player.prototype.isMe = function(){
    return this.uid === userId;
};

Player.prototype.visibleCards = function(){
    return this.hand.cards.concat(this.ground.cards);  // TODO what about cards in the graveyard?
};

Player.prototype.startTurn = function(){
    //Turn.informer.visible = true;
    send_to_server({
        'uid': this.uid,
        'type': "start-turn"
    })
};

Player.prototype.endTurn = function(){
    send_to_server({
        'uid': this.uid,
        'type': "end-turn"
    });
};

Player.prototype.drawCard = function(){
    send_to_server({
        'uid': this.uid,
        'type': "draw-a-card"
    });
};

Player.prototype.playCreatureCard = function(card, slot, target){
    if (card.playableNow) {
        send_to_server({
            'uid': card.uid,
            'type': "play-creature-card",
            'uuid': card.uuid,
            'slot': slot,
            'target': (target) ? target.uuid : null,
            'title': card.title
        });
    } else {
        console.log("Player.playFromHand card is not playable at the moment!", card);
    }
};

Player.prototype.playSpellCard = function(card, target){
    if (card.playableNow){
        send_to_server({
            'uid': card.uid,
            'type': "play-spell-card",
            'uuid': card.uuid,
            'target': (target) ? target.uuid: null,
            'title': card.title
        });
    }
};

Player.prototype.attackFromGround = function(attacker, target){
    // TODO check attackable?
    if (attacker.playableNow) {
        send_to_server({
            'type': "card-attack-from-ground",
            'uid': attacker.uid,
            'attacker': attacker.uuid,
            'target': target.uuid,
            'attacker-title': attacker.title,
            'target-title': target.title
        });
    }
};

Player.prototype.cardAttackToPlayer = function(attacker, target_uid){
    if (attacker.playableNow){
        send_to_server({
            'type': "card-attack-to-player",
            'uid': attacker.uid,
            'attacker': attacker.uuid,
            'target': target_uid,
            'attacker-title': attacker.title
        })
    }
};

Player.prototype.getCardByUUID = function(uuid){
    var card;
    card = this.ground.getCardByUUID(uuid);
    if (!card){
        card = this.hand.getCardByUUID(uuid);
        if (!card){
            card = this.graveyard.getCardByUUID(uuid);
        }
    }
    return card;
};

function PlayerHp(player){
    this.player = player;
    this.position = new Pos(0, 0);
}
