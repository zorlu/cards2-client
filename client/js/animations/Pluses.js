/**
 * Created by hasan on 8/30/2019.
 */

var Pluses = function(fromPos, toPos){
    this.initialized = false;
    this.completed = false;
    this.delay = 150;
    this.tickInterval = 0;

    this.pluses = [];
    this.count = 100;
    this.tickCount = 3;
    this.tickMax = 3;

    this.init = function(){
        this.initialized = true;
    };
    this.createPluses = function(){
        if(this.pluses.length < this.count){
            if(this.tickCount >= this.tickMax){
                this.pluses.push(new Plus(toPos));
                this.tickCount = 0;
            } else {
                this.tickCount++;
            }
        }
    };

    this.updatePluses = function(){
        var i = this.pluses.length;
        while(i--){
            this.pluses[i].update(i);
        }
    };

    this.renderPluses = function(){
        var i = this.pluses.length;
        while(i--){
            this.pluses[i].render();
        }
    };

    this.animate = function(){
        this.tick();
        if (!this.completed) {
            if (!this.timesUp()) {
                this.createPluses();
                this.updatePluses();
                this.renderPluses();
            } else {
                this.pluses = [];
                this.completed = true;
            }
        }
    };
    this.tick = function () {
        this.tickInterval++;
    };

    this.timesUp = function () {
        return this.tickInterval >= this.delay;
    };

};


//var cw = 200; //context.width = window.innerWidth;
var ch = 150; //context.height = window.innerHeight;
var rand = function(a,b){return ~~((Math.random()*(b-a+1))+a);};

var Plus = function(pos){
    this.pos = pos;
    this.init();
};

Plus.prototype.init = function(){
  //this.x = cw / 2;
  //this.y = ch * .7;
    this.x = this.pos.x;
    this.y = this.pos.y;
    this.vx = (rand(25, 50)-25)/12;
    this.vy = -(rand(0, 50))/9;
    this.lightness = rand(0, 50);
    this.alpha = .1;
    this.fade = .015;
    this.scale = 1;
    this.growth = .06;
    this.rotation = rand(0, Math.PI*2);
    this.spin = (rand(0, 100)-50)/300;
};

Plus.prototype.update = function(i){
  this.x += this.vx;
  this.y += this.vy;
  this.vy += .15 * this.scale;
  if(this.alpha < 1){
    this.alpha += this.fade;
  }
  this.scale += this.growth;
  this.rotation += this.spin;

  if(this.y - 30 >= ch){
    this.init(this.pos);
  }
};

Plus.prototype.render = function(){
  context.save();
  context.translate(this.x, this.y);
  context.scale(this.scale, this.scale);
  context.rotate(this.rotation);

  context.fillStyle = 'hsla(12, 100%, 50%, '+this.alpha+')';
  context.beginPath();
  context.rect(-3, -1, 6, 2);
  context.rect(-1, -3, 2, 6);
  context.fill();
  context.restore();
};
