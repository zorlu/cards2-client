/**
 * Created by hasan on 7/12/2019.
 */

var TurnBegin = function(data) {
    this.key = "turn-begin";
    this.delay = 100;
    this.tickInterval = 0;
    this.completed = false;
    this.initialized = false;

    var player;

    this.init = function () {
        this.tickInterval = 0;
        player = Game.getPlayerByUid(data.whos);
        player.turn.start(data.no, data.cost);
        Turn.whosTurn = player;
        Turn.informer.visible = true;
        this.initialized = true;
        //console.log("Animation.turnBegin initialized", data);
    };

    this.animate = function () {
        this.tick();
        if (!this.completed) {
            if (this.timesUp()) {
                Turn.informer.visible = false;
                player.refreshCardAvailability(data.attackables);

                this.completed = true;
                //console.log("Animation.turnBegin completed!");
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