/**
 * Created by hasan on 6/19/2019.
 */

var Turn = {
    whosTurn: null,
    cost: null,
    duration: 20,
    time: null,
    interval: undefined
};

/*
Turn.begin = function(cost){
    console.log("TurnStartFor", this.whosTurn.uid);
    this.time = this.duration;
    this.cost = cost;
    this.whosTurn.setRemainingTurnMana(this.cost);


    if (!this.interval) {
        this.interval = setInterval(function () {
            if (Turn.time === 0) {
                 clearInterval(Turn.interval);
                Turn.interval = undefined;
                if (Turn.whosTurn.uid === userId) {
                    Turn.whosTurn.endTurn();
                    console.log("TurnEndFor", Turn.whosTurn.uid);
                }

            } else {
                Turn.time--;
            }
        }, 1000);
    }

};
*/

Turn.button = {
    width: 80,
    height: 40,
    x: undefined,
    y: undefined,
    draw: function(x, y){
        this.x = x;
        this.y = y;

        if (Turn.whosTurn && Turn.whosTurn.uid === userId){
            context.fillStyle = "rgb(76, 107, 74)";
        } else {
            context.fillStyle = "rgb(34, 60, 102)";
        }
        context.fillRect(x, y, this.width, this.height);

        context.font = "20px Hearthstone";
        context.fillStyle = "white";
        var fontX = x + 2;
        var fontY = y + (this.height / 2) + 5;
        context.fillText("TURN", fontX, fontY);
    }
};

Turn.rope = {
    height: 8,
    draw: function(x, y, width){
        context.fillStyle = "rgba(0, 255, 0, 1)";
        context.fillRect(x, y, width, this.height);
    }
};

Turn.informer = {
    title: "",
    visible: false,
    width: 400,
    height: 150,
    x: undefined,
    y: undefined,

    draw: function(x, y){
        this.title = ((Turn.whosTurn.uid === userId) ? "YOUR": "OPPONENT'S") + " TURN";

        this.x = x;
        this.y = y;
        context.fillStyle = "rgb(34, 60, 102)";
        context.fillRect(x, y, this.width, this.height);

        context.font = "20px Hearthstone";
        context.fillStyle = "white";

        context.fillText(
            this.title,
            x + (this.width/2) - 100,
            y + (this.height / 2) + 5
        );
    }
};
