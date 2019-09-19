/**
 * Created by hasan on 6/22/2019.
 */
var PlayerTurn = function(){
    this.no = 0;
    this.cost = 0;
    this.remainingMana = 0;
    this.x = undefined;
    this.y = undefined;
    this.width = 80;
    this.height = 40;
};

PlayerTurn.prototype.start = function(no, cost){
    this.no = no;
    this.cost = cost;
    this.remainingMana = cost;
};

PlayerTurn.prototype.draw = function (x, y) {
    this.x = x;
    this.y = y;
    context.fillStyle = "rgba(0, 0, 255, 1)";
    context.fillRect(x, y, this.width, this.height);

    context.font = "20px Hearthstone";
    context.fillStyle = "white";
    var fontX = x + (this.width / 2) - 30;
    var fontY = y + (this.height / 2) + 5;
    context.fillText(this.remainingMana + " / " + this.cost, fontX, fontY);
};