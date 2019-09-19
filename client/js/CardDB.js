/**
 * Created by hasan on 6/15/2019.
 */
var CardDB = {
    cards: {}
};

/*
CardDB.init = function(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            for (var i = 0; i < data['items'].length; i++){
                var item = data['items'][i];
                CardDB.cards[item['key']] = item;
            }
            console.log("CardDB loaded: ", Object.keys(CardDB.cards).length);
            server.send(JSON.stringify({'type': "hello-" + Game.type, 'uid': userId})); //hello-with-ai
        }
    };
    xmlhttp.open("GET", "http://127.0.0.1:8000/card-list?uid=" + userId, true);
    xmlhttp.send();
};
*/
CardDB.init = function(items){
    for (var i = 0; i < items.length; i++){
        var item = items[i];
        CardDB.cards[item['key']] = item;
    }
    console.log("CardDB loaded: ", Object.keys(CardDB.cards).length);
};
CardDB.createCard = function(cardKey, uuid, uid){
    var template = this.cards[cardKey];
    var hp, attack = undefined;
    if (typeof template === "undefined"){
        console.log(cardKey);
    }
    if (template['type'] === "creature"){
        hp = template['hp'];
        attack = template['attack'];
    }

    var card = new Card(cardKey, uid, uuid, template['type'], template['family'], template['title'], template['desc'], template['mana'],
        hp, attack, template['auraowner'], template['img']);

    /*
    card.revenge = template['revenge'];
    card.sacrifice = template['sacrifice'];
    card.avengeme = template['avengeme'];
    card.defender = template['defender'];
    card.together = template['together'];
    */
    card.selector = template['selector'];
    card.immune = template['immune'];

    Game.cards.push(card);
    return card;
};