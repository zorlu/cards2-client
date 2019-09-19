/**
 * Created by hasan on 6/14/2019.
 */

var creatureInHand = new Image();
creatureInHand.src = "img/handedv2.png";

var creatureInGround = new Image();
creatureInGround.src = "img/groundedv2.png";

//var glowingTemplate = new Image();
//glowingTemplate.src = "img/handed.png";

var spellInHand = new Image();
spellInHand.src = "img/handedv2.png";


var portraitBackground = new Image();
portraitBackground.src = "img/portrait_background.jpg";

var buffImage = new Image();
buffImage.src = "img/buff.png";

var attackImage = new Image();
attackImage.src = "img/attack.png";

Card.prototype.draw = function(){
    // context.fillStyle = "rgba(0, 255, 0, 0.5)";
    //context.beginPath();
    //context.rect(this.x, this.y, this.width, this.height);

    var glowing = false;
    var hideComponents = false;
    if (this.playableNow && this.isMine() && Turn.whosTurn.uid === userId){
        glowing = true;
    }

    switch (this.where) {
        case 'preview':
            //this.x = 0;
            //this.y = Game.player.ground.y - (this.getHeight() / 2);
            context.globalAlpha = this.opacity;  // activate opacity -> card may have discarding
            if (this.opacity !== 1){
                console.log("card.opacity", this.opacity);
            }
            this.portraitVisual.draw();

            if (glowing){
                //context.shadowColor = 'green';
                //context.shadowBlur = 15;
            }
            context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());
            //context.shadowBlur = 0;
            this.titleVisual.draw();
            this.descVisual.draw();
            this.manaVisual.draw();
            if (this.hpVisual) {
                this.hpVisual.draw();
                this.dpVisual.draw();
                this.familyVisual.draw();
            }
            context.globalAlpha = 1;
            break;

        case 'flying':

            context.globalAlpha = this.opacity;  // activate opacity -> card may have shuffling
            // shadow
            context.fillStyle = "rgba(0, 0, 0, 0.3)";
            context.fillRect(this.x-5, this.y + 10, this.getWidth(), this.getHeight());

            this.portraitVisual.draw();

            if (glowing){
                //context.shadowColor = 'green';
                //context.shadowBlur = 15;
            }
            context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());
            context.shadowBlur = 0;

            this.titleVisual.draw();
            if (this.hpVisual) {
                this.hpVisual.draw();
                this.dpVisual.draw();
                this.familyVisual.draw();
            }
            // this.manaVisual.draw();
            context.globalAlpha = 1;
            break;

        case 'dying':
            context.globalAlpha = this.opacity;

            this.portraitVisual.draw();
            context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());

            if (this.hpVisual) {
                this.hpVisual.draw();
                this.dpVisual.draw();
            }
            context.globalAlpha = 1;
            break;

        case 'attacking':
        case 'ground':
            this.portraitVisual.draw();
            if (glowing){
                //context.shadowColor = 'green';
                //context.shadowBlur = 15;
            }
            context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());
            context.shadowBlur = 0;

            if (this.auraVisual){
                this.auraVisual.draw(this);
            }
            this.hpVisual.draw();
            this.dpVisual.draw();
            //this.featVisual.draw();

            if (this.buffs.length){
                var buffY;
                //if (this.isMine()){
                buffY = this.y + (this.getHeight() - 30);
                //}
                context.drawImage(buffImage,
                    this.x + (this.getWidth() /2 ) - 15,
                    buffY
                );
            }
            if (glowing){
                context.drawImage(attackImage, this.x + (this.getWidth()/2) - 16, this.y - 16, 32, 32)
            }

            break;

        case 'hand':
            if (this.isMine()) {
                this.portraitVisual.draw();

                if (glowing){
                    //context.shadowColor = 'green';
                    //context.shadowBlur = 15;
                }
                context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());
                context.shadowBlur = 0;

                this.titleVisual.draw();
                this.manaVisual.draw();

            } else {
                context.drawImage(this.getTemplate('back'), this.x, this.y, this.getWidth(), this.getHeight());
            }
            break;
        case 'drawing':
            context.drawImage(this.getTemplate(), this.x, this.y, this.getWidth(), this.getHeight());
            break;
    }
};

Card.prototype.update = function(){
    this.draw();
};


CardHp.prototype.draw = function(){
    this.update();
    var hpX = this.position.x;
    if (this.card.hp > 9){
        hpX -= 8;
    }

    context.font = this.getFontSize().toString() + "px Hearthstone";

    if (this.card.hp_decreased){
        context.fillStyle = "red";
    } else if (this.card.hp_increased) {
        context.fillStyle = "rgb(76, 196, 65)";
    } else {
        context.fillStyle = "rgb(224, 162, 79)";
    }
    context.fillText(this.card.hp, hpX, this.position.y);
};

CardDp.prototype.draw = function(){
    this.update();
    var dpX = this.position.x;

    if (this.card.dp > 9){
        dpX -= 1;
    }

    context.font = this.getFontSize().toString() + "px Hearthstone";
    if (this.card.dp_decreased){
        context.fillStyle = "red";
    } else if (this.card.dp_increased){
        context.fillStyle = "rgb(76, 196, 65)";
    } else {
        context.fillStyle = "rgb(224, 162, 79)";
    }

    context.fillText(this.card.dp, dpX, this.position.y);
};


CardMana.prototype.draw = function(){
    this.update();

    if (this.card.mana > 9){
        this.x -= 10;
    }

    context.font = this.getFontSize() + "px Hearthstone";
    context.fillStyle = this.getFontColor();

    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.strokeText(this.card.mana, this.getPosition().x, this.getPosition().y);
    context.lineWidth = 1;

    context.fillText(this.card.mana, this.getPosition().x, this.getPosition().y);
};

CardTitle.prototype.draw = function(){
    this.update();
    context.font = this.getFontSize() + "px Hearthstone";
    context.fillStyle = "rgb(83, 186, 79)";
    context.fillText(this.card.title, this.getPosition().x, this.getPosition().y, this.getSize().width);
};

CardDesc.prototype.draw = function(){
    context.font = this.fontSize + "px Hearthstone";
    //context.fillStyle = "rgb(230, 236, 222)";

    var fontY = this.card.titleVisual.getPosition().y + 20;
    //this.x = this.card.x + 18;
    this.x = this.card.x + (this.card.getWidth()/2);


    var oldAlign = context.textAlign;
    var oldBaseline = context.textBaseline;

    var descs = this.card.desc.split("\\n");
    //descs.unshift("FEAT:Sacrifice +2");

    context.textAlign = "center";
    context.textBaseline = "middle";

    for (var i = 0; i < descs.length; i++) {
        var isFeat = false;
        var desc = descs[i];
        var myY = fontY + (i * (this.fontSize+3));

        if (desc.indexOf("FEAT:") > -1){
            desc = desc.replace("FEAT:", "");
            isFeat = true;
            context.fillStyle = "rgb(224, 162, 79)";
        } else {
            context.fillStyle = "rgb(230, 236, 222)";
        }

        context.fillText(
            desc.trim(),
            this.x,
            myY,
            this.width
        )
    }
    context.textAlign = oldAlign;
    context.textBaseline = oldBaseline;
};

CardFamily.prototype.draw = function(){
    if (this.card.family){
        this.update();

        var oldAlign = context.textAlign;
        var oldBaseline = context.textBaseline;

        context.font = this.getFontSize() + "px Hearthstone";
        context.textAlign = "center";
        context.textBaseline = "middle";
        //context.fillStyle = "rgba(224, 162, 79, 0.5)";
        context.fillStyle = "rgba(230, 236, 222, 0.4)";
        context.fillText(this.card.family, this.position.x, this.position.y);
        context.textAlign = oldAlign;
        context.textBaseline = oldBaseline;
    }
};

CardPortrait.prototype.draw = function(){
    if (this.card.where === "ground" || this.card.where === "dying"){
        this.x = this.card.x;
        this.y = this.card.y;
    } else {
        this.x = this.card.x + 2;
        this.y = this.card.y + 5;
    }

    context.drawImage(portraitBackground, this.x, this.y, this.getSize().width, this.getSize().height);
    context.drawImage(this.img, this.x, this.y, this.getSize().width, this.getSize().height);
};
