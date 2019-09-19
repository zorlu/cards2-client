/**
 * Created by hasan on 6/14/2019.
 */

var server = new WebSocket("ws://127.0.0.1:5678");

// var userId = (location.hash === "#user1") ? 1 : 2;
var inspector = false;  // make true if you want to watch ai-to-ai game
var userId = 1;
var deckId = 19;  // kara murat
var dungeonId = 1;
var dungeonStageNo = 1;
if (location.hash.indexOf("#stage") > -1){
    dungeonStageNo = location.hash.replace("#stage", "");
}


server.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log("server", data);
    var i;

    if (data['type'] === "load-game") {
        Game.init(data);
    
    } else if (data['type'] === "start-game"){
        for (i = 0; i < data['cmds']['commands'].length; i++){
            var cmd = data['cmds']['commands'][i];
            Playback.add(cmd.key, cmd.seq, cmd.data);
        }
        Game.start();
        
    } else if (data['type'] === "commands"){
        for (i = 0; i < data['commands'].length; i++){
            var command = data['commands'][i];

            if (!command.data.hasOwnProperty("uid")) {
                command.data['uid'] = data['uid']; // force update
            }
            Playback.add(command.key, command.seq, command.data);
        }
    }

};

function send_to_server(data){
    console.log("client", data);
    server.send(JSON.stringify(data));
}

server.onopen = function(){
    //send_to_server({'type': 'load-cards', 'uid': userId});
    send_to_server({
        'type': "hello-" + Game.type,
        'inspector': inspector,
        'uid': userId,
        'deck': deckId,
        'dungeon': dungeonId,
        'stageno': dungeonStageNo
    }); //hello-with-ai

    //CardDB.init(); // handle hello message
    //canvas.opacity = 1;
};

server.onclose = function(){
    console.log("server.onclose");
    //window.location.reload();
};
server.onerror = function(){
    console.log("server.onerror");
    //canvas.opacity = 0;
};