/**
 * Created by hasan on 6/22/2019.
 */

Player.prototype.draw = function(x, y){
    this.x = x; //required for CreatuteTextAnimation
    this.y = y; //required for CreatuteTextAnimation

    context.drawImage(this.portrait, x, y, this.width, this.height);

    this.hpVisual.draw(x, y);

    context.fillStyle = "black";
    context.font = "14px Hearthstone";
    if (this.position === "bottom"){
        context.fillText(this.name, x - 50, y + (this.height/2));
    } else {
        var nameX = x + 100;

        if (Game.dungeon){
            context.fillText(Game.dungeon.name + " - Stage " + Game.dungeon.stage, nameX, y + (this.height/2));
            context.fillText(this.name, nameX, y + (this.height/2) + 15);
        } else {
            context.fillText(this.name, nameX, y + (this.height/2));
        }
    }
};

PlayerHp.prototype.draw = function(x, y){
    this.position.x = x;
    this.position.y = y;
    var oldAlign = context.textAlign;
    var oldBaseline = context.textBaseline;

    context.font = "25px Hearthstone";

    context.textAlign = "center";
    context.textBaseline = "middle";
     if (this.player.hp < this.player.baseHp){
        context.fillStyle = "red";
    } else {
         context.fillStyle = "white";
     }

    context.fillText(this.player.hp, x + (this.player.width / 2), y + (this.player.height / 2));

    context.textAlign = oldAlign;
    context.textBaseline = oldBaseline;

};
