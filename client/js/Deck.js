/**
 * Created by hasan on 6/14/2019.
 */

function Deck(){
    this.cardCount = 0;
    this.x = null;
    this.y = null;
    this.width = 64;
    this.height = 64;
    this.image = new Image();
    this.image.src = "img/deck.png";
}

Deck.prototype.draw = function(x, y) {
    this.x = x;
    this.y = y;
    var oldAlign = context.textAlign;
    var oldBaseline = context.textBaseline;

    context.drawImage(this.image, this.x, this.y);

    context.font = "23px Hearthstone";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";

    var fontX = this.x + (this.width / 2);
    var fontY = this.y + (this.height / 2);
    context.fillText(this.cardCount.toString(), fontX, fontY);

    context.textAlign = oldAlign;
    context.textBaseline = oldBaseline;

};