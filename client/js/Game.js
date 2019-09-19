/**
 * Created by hasan on 6/14/2019.
 */

var Game = {
    started: false,
    fps: 5,
    type: "with-ai",
    attackingCard: null,
    whosTurn: null,
    player: null,
    opponent: null,
    attacking: {'attacker': null, 'target': null},

    targetSelectorCard: null,
    targetSelectorPos: new Pos(0, 0),

    flyingCard: null,
    flyingCardPos: new Pos(0, 0),

    previewCard: null,
    cards: [],
    fireball: null,
    animations: [],

    stars: null,
    dungeon: null,
    cardBack: null
};

Game.init = function(data){
    var i, j;
    CardDB.init(data['carddb']);

    Game.cardBack = new Image();
    if (data.dungeon){
        Game.cardBack.src = "img/cardbacks/" + data.dungeon.cardback;
    } else {
        Game.cardBack.src = "img/cardbacks/card_back_optimized.jpg";
    }


    for (i = 0; i < data['players'].length; i++){

        var player = new Player(data['players'][i].uid);
        player.name = data['players'][i].name;

        player.hand = new Hand();
        player.deck = new Deck();
        player.ground = new Ground();
        player.graveyard = new Graveyard();
        player.turn = new PlayerTurn();
        player.preview = new Preview();
        player.deck.cardCount = data['players'][i].deck_count;
        player.portrait = new Image();

        if (player.isMe()) {
            player.position = "bottom";
            player.portrait.src = "img/portraits/portrait79.png";  // default player1
            this.player = player;

        } else {
            player.position = "top";
            if (data.dungeon){
                player.portrait.src = "img/portraits/" + data.dungeon.boss.portrait;
                player.hp = data.dungeon.boss.hp;
                player.baseHp = data.dungeon.boss.hp;
                player.name = data.dungeon.boss.name;
            } else {
                player.portrait.src = "img/portraits/portrait79.png"; // default ai
            }
            this.opponent = player;
        }

        if (data.dungeon){
            Game.dungeon = data.dungeon;
        }

    }
    Playback.init(); // initialize animation classes
    
    for (i = 0; i < data['first_cards']['commands'].length; i++){
        var command = data['first_cards']['commands'][i];
        Playback.add(command.key, command.seq, command.data);
    }
    
    send_to_server({
        'uid': userId,
        'type': "acknowleged",
        'key': "load-game"
    });
/*
    // handle first-hand draw cards
    for (i = 0; i < data['cmds']['commands'].length; i++){
        var command = data['cmds']['commands'][i];
        Playback.add(command.key, command.data);
    }

    var whoStarts = this.getPlayerByUid(data['who_starts']);
    if (whoStarts.uid === userId){
        whoStarts.startTurn();  // inform server
    }
*/
    //this.init(data['who_starts'], data['cmds']['commands']);
};

/*
Game.startGame = function(data){
    
    for (var i = 0; i < data['cmds']['commands'].length; i++){
        var command = data['cmds']['commands'][i];
        Playback.add(command.key, command.data);
    }

    var who_starts = this.getPlayerByUid(data['who_starts']);
    if (who_starts.uid === userId){
        who_starts.startTurn();
    }

    Game.init();
};
*/

Game.start = function(){
    Game.loop();
};

Game.getPlayerByUid = function(uid){
    return (this.player.uid === uid) ? this.player : this.opponent;
};

Game.getOppositePlayer = function(uid){
    return (this.player.uid === uid) ? this.opponent : this.player;
};

var animationInterval = 0;

Game.loop = function(){
    animationInterval++;
    //setTimeout(function(){
        requestAnimationFrame(Game.loop);

        context.clearRect(0, 0, canvas.width, canvas.height);

        var player = Game.player;
        var opponent = Game.opponent;

        // PLAYER
        player.hand.draw(
            player.ground.x + (player.ground.width / 2) - (player.hand.width/2),
            canvas.height - player.hand.height
        );
        player.ground.draw(
            player.ground.x,
            player.hand.y - player.hand.height - 75
        );
        player.deck.draw(
            player.ground.x + player.ground.width + 10,
            player.hand.y
        );
        player.graveyard.draw(0, player.deck.y);
        player.turn.draw(
            player.ground.x + player.ground.width + 10,
            player.deck.y - player.turn.height
        );
        player.draw(
            player.hand.x - player.width,
            player.hand.y
        );


        // OPPONENT
        opponent.hand.draw(opponent.ground.x, 0);
        opponent.ground.draw(
            opponent.ground.x,
            opponent.hand.y + opponent.hand.height
        );

        opponent.deck.draw(
            opponent.ground.x + opponent.ground.width + 10,
            0
        );
        opponent.turn.draw(
            opponent.ground.x + opponent.ground.width + 10,
            opponent.deck.y + opponent.deck.height
        );
        opponent.graveyard.draw(0, opponent.deck.y);
        opponent.draw(
            opponent.hand.x + opponent.hand.width + opponent.width,
            opponent.hand.y
        );


        Turn.button.draw(player.ground.x + player.ground.width + 5, (canvas.height / 2) - 20);
        //Turn.rope.draw(player.ground.x, player.ground.y - 8, player.ground.width);


        // ALL CARDS
        var flyingCard = null;
        //Game.cards.slice().reverse().forEach(function(card){
        Game.cards.forEach(function(card){

            if (card.visible) {
                if (card.where === "flying"){
                    flyingCard = card;
                } else {
                    card.update();
                }
            }

        });
        if (flyingCard){
            flyingCard.update();
        }

        player.preview.draw(
            player.hand.x + (player.hand.width / 2) - (player.preview.width / 2),
            player.hand.y - player.preview.height
        );
        opponent.preview.draw(
            //opponent.hand.x,
            //opponent.hand.y + (opponent.hand.height)
            0,0
        );

        

        if (Turn.informer.visible && Turn.whosTurn){
            Turn.informer.draw(
                canvas.width / 2 - (Turn.informer.width / 2),
                canvas.height / 2 - (Turn.informer.height / 2)
            );
        }

        if (Game.targetSelectorCard){
            context.beginPath();
            context.moveTo(
                Game.targetSelectorCard.x + (Game.targetSelectorCard.getWidth() / 2),
                Game.targetSelectorCard.y + (Game.targetSelectorCard.getHeight() / 2)
            );
            context.lineTo(Game.targetSelectorPos.x, Game.targetSelectorPos.y);
            context.strokeStyle = "red";
            context.lineWidth = 4;
            context.stroke();
            context.lineWidth = 1;
        }

        var playback = Playback.next();
        if (playback) {
            console.log("Playback.running", playback.key, "sequence", playback.sequence);
            playback.start();
        }

        //if (Game.animations.length && Game.opponent.preview.card){
        //    Game.opponent.preview.clear();
        //}

        var animIdxToDelete = [];
        for (var i = 0; i < Game.animations.length; i++){
            var animations = Game.animations[i];

            var completedCount = 0;
            for (var k = 0; k < animations.length; k++){
                //try {
                    var animation = animations[k];

                    if (!animation.initialized){
                        animation.init();
                    }
                    if (animation.initialized) {
                        if (!animation.completed) {
                            animation.animate();
                        } else {
                            completedCount++;
                        }
                    }
                //} catch (err){
                //    console.log("notAnArray", animations[k]);
                //}
            }
            if (completedCount === animations.length){ // current playback's animations ends here
                animIdxToDelete.push(i);
                Playback.completed();
            }


        }
        if (animIdxToDelete.length){
            for (var j = 0; j < animIdxToDelete.length; j++){
                Game.animations.splice(animIdxToDelete[j], 1);
                if (playback){
                    playback.completed = true;
                }
            }
            //console.log("some animations removed len:", Game.animations.length);
        }

        /*
        var fireball = Game.fireball;
        if (fireball) {

            if (fireball.x > fireball.targetPos.x){
                fireball.x --;
            } else if (fireball.x < fireball.targetPos.x){
                fireball.x++;
            }

            if (fireball.y > fireball.targetPos.y){
                fireball.y --;
            } else if (fireball.y < fireball.targetPos.y){
                fireball.y ++;
            }

            fireball.update();
            fireball.draw(0, 2, fireball.x, fireball.y);
        }
        */
        /*
        Game.fireball.draw(0, 0, 0, 0);
        Game.fireball.draw(1, 0, 64, 0);
        Game.fireball.draw(0, 0, 64 * 2, 0);
        Game.fireball.draw(2, 0, 64 * 3, 0);
        */
        //}, 1000 / Game.fps);
};

