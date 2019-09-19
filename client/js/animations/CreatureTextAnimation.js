/**
 * Created by hasan on 7/30/2019.
 */

var CreatureTextAnimation = function() {
    this.initialized = false;
    this.completed = false;
    this.card = null;
    this.text = null;
    this.x = null;
    this.y = null;
    this.opacity = 1;
    this.color = null;

    this.defaultBaseline = context.textBaseline;
    this.defaultAlign = context.textAlign;

    this.fontSize = 20;

    this.tickCount = 0;
    this.speed = 2;

    this.init = function (card, textanim) {
        if (!card){
             console.error("CardNotFound!", textanim);
        }
        this.card = card;
        this.text = textanim.text;

        if (textanim.harmful) {
            this.color = "red";
        } else {
            this.color = "rgb(83, 186, 79)";
        }

        if (textanim.onhp) {
            this.x = card.hpVisual.position.x;
        } else if (textanim.ondp) {
            this.x = card.dpVisual.position.x;
        } else {
            this.x = card.x + (card.getWidth() / 2);
        }
        this.y = card.y + (card.getHeight() / 2);

        this.initialized = true;

    };

    this.update = function () {
        for (var i = 0; i < this.speed; i++) {
            this.y--;

            if (this.y < this.card.y - 5) {
                this.y = this.card.y - 5;

                this.opacity -= 0.1;
                if (this.opacity < 0) {
                    this.completed = true;
                }
            }
            if (!this.completed) {
                context.globalAlpha = this.opacity;
                context.font = "30px Hearthstone";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = this.color;
                context.fillText(this.text, this.x, this.y);

                context.strokeStyle = "rgb(34, 75, 84)";
                context.strokeText(this.text, this.x, this.y);
                context.globalAlpha = 1;
                context.textAlign = this.defaultAlign;
                context.textBaseline = this.defaultBaseline;
            }
        }
    }
};