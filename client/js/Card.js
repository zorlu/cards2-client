/**
 * Created by hasan on 6/14/2019.
 */

function Card(key, uid, uuid, type, family, title, desc, mana, hp, dp, auraowner, img){
    this.uid = uid;  // user id
    this.uuid = uuid; // universal unique id
    this.key = key;
    this.type = type;
    this.family = family;
    this.where = "deck";
    /*
    this.revenge = null;
    this.sacrifice = null;
    this.avengeme = null;
    this.defender = null;
    */
    this.selector = null;
    this.immune = false;
    this.buffs = [];
    this.visible = false;
    this.opacity = 1;
    this.title = title;
    this.titleVisual = new CardTitle(this);
    this.desc = desc;
    this.descVisual = new CardDesc(this);

    if (type === "creature") {
        this.hp = hp;
        this.dp = dp;
        this.hpVisual = new CardHp(this);
        this.dpVisual = new CardDp(this);
        this.familyVisual = new CardFamily(this);
    }
    this.mana = mana;
    this.manaVisual = new CardMana(this);

    var portraitImg;
    portraitImg = new Image();
    portraitImg.src = "img/portraits/" + img;

    this.portraitVisual = new CardPortrait(this, portraitImg);

    this.auraVisual = null;
    this.auraTriggered = false;
    if (auraowner){
        this.auraVisual = new AuraOwnerAnim();
    }

    this.attacking = false;

    if (this.type === "creature") {
        this.templates = {
            'back': Game.cardBack,
            'hand': creatureInHand,
            'ground': creatureInGround,

            'flying': creatureInHand,
            'attacking': creatureInGround,
            'dying': creatureInGround,
            'drawing': Game.cardBack,
            'preview': creatureInHand
        };
    } else if (type === "spell"){
        this.templates = {
            'back': Game.cardBack,
            'hand': spellInHand,
            'flying': spellInHand,
            'dying': spellInHand,
            'drawing': Game.cardBack,
            'preview': spellInHand
        };
    }

    this.sizes = {
        'hand': new Size(150, 225),
        'ground': new Size(100, 135),
        'flying': new Size(120, 169),
        'attacking': new Size(100, 135),
        'dying': new Size(100, 135),
        'preview': new Size(200, 300),
        'drawing': new Size(120, 169)
    };

    this.x = undefined;
    this.y = undefined;

    this.hp_increased = false;
    this.dp_increased = false;
    this.hp_decreased = false;
    this.dp_decreased = false;
    this.mana_increased = false;
    this.mana_decreased = false;

    this.playableNow = false;
    this.inPreview = false;
}

Card.prototype.isMine = function(){
    return this.uid === userId;
};

Card.prototype.setHp = function(hp){
    this.hp = hp;
};

Card.prototype.setDp = function(dp){
    this.dp = dp;
};

Card.prototype.isCreature = function(){ return this.type === "creature"; };

Card.prototype.getTemplate = function(specify){
    return (typeof specify !== "undefined") ? this.templates[specify] : this.templates[this.where];
};

Card.prototype.getWidth = function(){
    return this.sizes[this.where].width;
};

Card.prototype.getHeight = function(){
    return this.sizes[this.where].height;
};

Card.prototype.intersect = function(pos){
    return (pos.y > this.y && pos.y < this.y + this.getHeight() && pos.x > this.x && pos.x < this.x + this.getWidth());
};

Card.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

function CardHp(card){
    this.card = card;
    this.x = undefined;
    this.y = undefined;
    this.position = new Pos(0, 0);
    this.fontSizes = {
        'preview': 25,
        'hand': 15,
        'ground': 25,
        'flying': 15,
        'dying': 25,
        'attacking': 25
    };
    this.getFontSize = function(){
        return this.fontSizes[this.card.where];
    };
    
    this.update = function(){
        if (this.card.where === "ground" || this.card.where === "flying" || this.card.where === "dying") {
            this.position.x = this.card.x + this.card.getWidth() - 30;
            this.position.y = this.card.y + this.card.getHeight() - 10;

        } else {
            this.position.x = this.card.x + this.card.getWidth() - 40;
            this.position.y = this.card.y + this.card.getHeight() - 20;
        }
    }
}

function CardDp(card){
    this.card = card;
    this.fontSize = 25;
    this.x = undefined;
    this.y = undefined;
    this.position = new Pos();
    this.fontSizes = {
        'preview': 25,
        'hand': 25,
        'ground': 25,
        'flying': 15,
        'dying': 25,
        'attacking': 25
    };
    this.getFontSize = function(){
        return this.fontSizes[this.card.where];
    };
    this.update = function(){
        if (this.card.where === "ground" || this.card.where === "flying" || this.card.where === "dying"){
            this.position.x = this.card.x + 10;
            this.position.y = this.card.y + this.card.getHeight() - 10;
        } else {
            this.position.x = this.card.x + 20;
            this.position.y = this.card.y + this.card.getHeight() - 20;
        }
    }
}

function CardMana(card){
    this.card = card;

    this.fontSizes = {
        'preview': 40,
        'hand': 25,
        'ground': 25,
        'flying': 25,
        'dying': 25
    };
    this.positions = {
        'preview': new Pos(0, 0),
        'dying': new Pos(0, 0),
        'hand': new Pos(0, 0),
        'flying': new Pos(0, 0)
    };
    this.getFontColor = function() {
        if (this.card.playableNow && Turn.whosTurn.uid === userId){
            return "rgb(70, 148, 222)";
        }
        else if (this.card.mana_increased){
            return "red";
        } else if (this.card.mana_decreased){
            return "green";
        } else {
            return "rgb(224, 162, 79)";
        }
    };

    this.getFontSize = function(){
        return this.fontSizes[this.card.where];
    };

    this.getPosition = function(){
        return this.positions[this.card.where];
    };

    this.update = function(){
        var pos = new Pos(0, 0);
        if (this.card.where === "dying" || this.card.where === "flying"){
            pos.x = this.card.x + 15;
            pos.y = this.card.y + 25;
        } else if (this.card.where === "preview"){
            pos.x = this.card.x + 20;
            pos.y = this.card.y + 40;
        } else if (this.card.where === "hand"){
            pos.x = this.card.x + 15;
            pos.y = this.card.y + 30;
        }
        this.positions[this.card.where] = pos;

    };
}

function CardTitle(card){
    this.card = card;

    this.x = undefined;
    this.y = undefined;
    this.width = 100;
    this.height = 30;
    this.positions = {
        'preview': new Pos(0, 0),
        'hand': new Pos(0, 0),
        'flying': new Pos(0, 0)
    };
    this.sizes = {
        'preview': new Size(200, 50),
        'hand': new Size(100, 30),
        'flying': new Size(100, 30),
        'dying': new Size(100, 30)
    };
    this.getSize = function(){
        return this.sizes[this.card.where];
    };

    this.fontSizes = {
        'preview': 18,
        'hand': 12,
        'flying': 12
    };
    this.getFontSize = function(){
        var result = this.fontSizes[this.card.where];
        if (this.card.where === "preview") {
            if (this.card.title.length > 15) {
                result = 15;
            }
        }
        return result;
    };


    this.getPosition = function(){
        return this.positions[this.card.where];
    };
    this.update = function(){
        this.positions[this.card.where].x = this.card.x + 15;
        this.positions[this.card.where].y = this.card.y + this.card.portraitVisual.sizes[this.card.where].height + 5;
    };
}

function CardDesc(card){
    this.card = card;
    this.x = undefined;
    this.y = undefined;
    this.width = 150;
    this.height = 30;
    this.fontSize = 12;

    this.positions = {};

}

function CardPortrait(card, img){
    this.card = card;
    this.img = img;
    this.x = undefined;
    this.y = undefined;
    this.positions = {};
    this.sizes = {
        'ground': new Size(95, 120),
        'hand': new Size(140, 130),
        'flying': new Size(115, 100),
        'preview': new Size(190, 180)
    };
}

CardPortrait.prototype.getSize = function(){
    var size = this.sizes[this.card.where];
    if (!size){
        size = this.sizes['ground'];
    }
    return size;
};

function CardFamily(card){
    this.card = card;
    this.fontSizes = {
        'hand': 12,
        'flying': 10,
        'preview': 15,
        'dying': 10,
        'ground': 10
    };
    this.position = undefined;
}
CardFamily.prototype.getFontSize = function(){
    var size = this.fontSizes[this.card.where];
    if (!size){
        size = this.fontSizes['hand'];
    }
    return size;
};
CardFamily.prototype.update = function(){
    if (this.card.where === "preview"){
        this.position = new Pos(  //TODO maybe just change the current variable?
            this.card.x + (this.card.getWidth() / 2),
            this.card.y + this.card.getHeight() - 25
        );
    } else if (this.card.where === "ground"){
        this.position = new Pos(
            this.card.x + (this.card.getWidth() / 2),
            this.card.y + this.card.getHeight() - 15
        );
    } else if (this.card.where === "flying"){
        this.position = new Pos(
            this.card.x + (this.card.getWidth() / 2),
            this.card.y + this.card.getHeight() - 15
        );
    }
};