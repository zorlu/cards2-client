/**
 * Created by hasan on 6/14/2019.
 */
function Hand(){
    this.cards = [];
    //this.width = Math.floor(canvas.width/1.5);
    this.limit = 10;
    this.width = 500;  // (card.width/2) * this.limit
    this.height = 80;
    this.x = undefined;
    this.y = undefined;

}

Hand.prototype.addCard = function(card){
    card.where = "hand";
    this.cards.push(card);
};

Hand.prototype.removeCard = function(card){
    this.cards.splice(this.cards.indexOf(card) ,1);
};

Hand.prototype.getCardByUUID = function(uuid){
    for (var i = 0; i < this.cards.length; i++){
        if (this.cards[i].uuid === uuid){
            return this.cards[i];
        }
    }
    return null;
};

Hand.prototype.draw = function(x, y){
    this.x = x;
    this.y = y;
    context.fillStyle = "rgba(0, 0, 255, 0.1)";
    context.fillRect(this.x, this.y, this.width, this.height);

    var handCenter = this.x + (this.width/2);
    var cardY, cardX;
    for (var i = 0; i < this.cards.length; i++){
        var card = this.cards[i];
        if (card.where === "hand"){
            var margin = i * 25;
            var cardSize = (i * (card.getWidth() / this.cards.length));

            cardX = this.x + cardSize + margin;

            if (!card.isMine()) {
                cardY = this.y - (card.getHeight() / 1.5);
            } else {
                //cardY = this.y + 20; TODO open this
                cardY = this.y;
            }
            card.x = cardX;
            card.y = cardY;
        }
    }
};