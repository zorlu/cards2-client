/**
 * Created by hasan on 8/30/2019.
 */

var PlayerDied = function(data){
    this.key = "player-died";
    this.initialized = false;
    this.completed = false;
    this.animation = null;

    var player;

    this.init = function(){
        player = Game.getPlayerByUid(data.uid);
        this.initialized = true;
    };

    this.animate = function(){
        if (!this.completed){
            // TODO do some animation
            if (player.isMe()){
                alert("Game Over, You've Lost!");
            } else {
                alert("Game Over, You Win!");
                if (Game.dungeon.next_stage){
                    location.hash = "stage" + Game.dungeon.next_stage;
                    location.reload();
                }
            }

            window.location.reload();
            this.completed = true;
        }
    };
};