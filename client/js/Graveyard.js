/**
 * Created by hasan on 6/19/2019.
 */
var Graveyard = function(){
    this.cards = [];
    this.x = null;
    this.y = null;
    this.width = 64;
    this.height = 64;
    this.image = new Image();
    this.image.src = "img/graveyard.png";
};

Graveyard.prototype.addCard = function(card){
    card.where = "graveyard";
    card.visible = false;
    this.cards.push(card);
};

Graveyard.prototype.removeCard = function(card){
    this.cards.splice(this.cards.indexOf(card) ,1);
};

Graveyard.prototype.getCardByUUID = function(uuid){
    for (var i = 0; i < this.cards.length; i++){
        if (this.cards[i].uuid === uuid){
            return this.cards[i];
        }
    }
    return null;
};

Graveyard.prototype.draw = function(x, y) {
    this.x = x;
    this.y = y;

    var oldAlign = context.textAlign;
    var oldBaseline = context.textBaseline;
    //context.fillStyle = "rgba(0, 0, 0, 1)";
    //context.fillRect(this.x, this.y, this.width, this.height);

    context.drawImage(this.image, this.x, this.y);

    context.font = "23px Hearthstone";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";

    var fontX = this.x + (this.width / 2);
    var fontY = this.y + (this.height / 2);
    context.fillText(this.cards.length.toString(), fontX, fontY);

    context.textAlign = oldAlign;
    context.textBaseline = oldBaseline;

};