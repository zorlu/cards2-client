/**
 * Created by hasan on 6/14/2019.
 */

function Ground(){
    this.limit = 10;
    this.cards = [];
    this.x = 100;
    this.width = canvas.width / 1.5;
    this.height = 150;
    this.slotWidth = parseInt(this.width / this.limit);

    this.slots = [
        new GroundSlot(0, this.slotWidth, this.height, "rgba(66, 135, 245, 0.1)"),
        new GroundSlot(1, this.slotWidth, this.height, "rgba(66, 245, 188, 0.1)"),
        new GroundSlot(2, this.slotWidth, this.height, "rgba(189, 124, 214, 0.1)"),
        new GroundSlot(3, this.slotWidth, this.height, "rgba(199, 167, 115, 0.1)"),
        new GroundSlot(4, this.slotWidth, this.height, "rgba(106, 102, 140, 0.1)"),
        new GroundSlot(5, this.slotWidth, this.height, "rgba(34, 64, 50, 0.1)"),
        new GroundSlot(6, this.slotWidth, this.height, "rgba(34, 75, 84, 0.1)"),
        new GroundSlot(7, this.slotWidth, this.height, "rgba(66, 135, 245, 0.1)"),
        new GroundSlot(8, this.slotWidth, this.height, "rgba(66, 245, 188, 0.1)"),
        new GroundSlot(9, this.slotWidth, this.height, "rgba(189, 124, 214, 0.1)")
    ];

    this.slotOrder = [4, 5, 3, 6, 2, 7, 1, 8, 0, 9];
}

Ground.prototype.isFull = function(){
    return this.cards.length === this.limit;
};

Ground.prototype.addCard = function(card, slot){
    card.playableNow = false;
    card.where = "ground";

    this.slots[slot].card = card;
    this.cards.push(card);
};

Ground.prototype.removeCard = function(card){
    this.cards.splice(this.cards.indexOf(card) ,1);

    this.slots.forEach(function(slot){
        if (slot.card === card){
            slot.card = null;
        }
    });
    card.where = "";

};

Ground.prototype.getCardByUUID = function(uuid){
    for (var i = 0; i < this.cards.length; i++){
        if (this.cards[i].uuid === uuid){
            return this.cards[i];
        }
    }
    return null;
};

Ground.prototype.getAvailableSlot = function(){
    if (this.isFull()){
        return -1;
    }

    for (var i = 0; i < this.slotOrder.length; i++){
        var order = this.slotOrder[i];
        if (!this.slots[order].card){
            return order;
        }
    }
    return -1;

};

Ground.prototype.draw = function(x, y){
    this.x = x;
    this.y = y;
    context.fillStyle = "rgba(255, 0, 0, 0.1)";
    context.fillRect(this.x, this.y, this.width, this.height);

   for (var i = 0; i  < this.slots.length; i++){
       var slotX = this.x + (this.slotWidth * i);
       this.slots[i].draw(slotX, this.y);
   }

};

var GroundSlot = function(no, width, height, color){
    this.no = no;
    this.card = null;
    this.width = width;
    this.height = height;
    this.x = null;
    this.y = null;
    this.color = color;

};
GroundSlot.prototype.draw = function(x, y){
    this.x = x;
    this.y = y;

    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.color;

    if (this.card && this.card.where === "ground"){ //could be attacking
        this.card.x = this.x;
        this.card.y = this.y;
    }

};

GroundSlot.prototype.intersect = function(pos){
    return (pos.y > this.y && pos.y < this.y + this.height && pos.x > this.x && pos.x < this.x + this.width);
};
