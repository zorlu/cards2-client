function Preview(){
    this.width = 200;
    this.height = 300;
    this.x = undefined;
    this.y = undefined;
    this.card = undefined;
    this.opacity = 1;
}

Preview.prototype.add = function(card){
    var newCard = CardDB.createCard(card.key, card.uuid + "-preview", card.uid);

    newCard.hp = card.hp;
    newCard.dp = card.dp;
    newCard.hp_increased = card.hp_increased;
    newCard.hp_decreased = card.hp_decreased;
    newCard.dp_increased = card.dp_increased;
    newCard.dp_decreased = card.dp_decreased;


    this.card = newCard;
    this.card.where = "preview";
};

Preview.prototype.clear = function(){
    this.card = undefined;
};

Preview.prototype.draw = function(x, y){
    this.x = x;
    this.y = y;

    context.globalAlpha = this.opacity;
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(this.x, this.y, this.width, this.height);

    if (this.card){
        this.card.x = this.x;
        this.card.y = this.y;
        this.card.where = "preview";
        this.card.draw();
    }
    //context.globalAlpha = 1;
};