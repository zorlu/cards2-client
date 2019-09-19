/**
 * Created by hasan on 6/15/2019.
 */
var Playback = {
    playbacks: [],
    previousAnimationCompleted: true,
    animationDelay: 1000 /Game.fps,
    animationClassMap: null
};

Playback.init = function(){
    this.animationClassMap = {
        'turn-begin': TurnBegin,
        'drawed': DrawCard,
        'discarded': DiscardCard,
        'creature_card_played': PlayCreature,
        'spell_card_played': PlaySpell,
        'hp_increased': HpIncreased,
        'hp_decreased': HpDecreased,
        'dp_increased': DpIncreased,
        'dp_decreased': DpDecreased,
        'hpdp_swapped': HpDpSwapped,
        'hp_restored': HpRestored,
        'dp_restored': DpRestored,
        'attacked': CardAttacked,
        'card_died': CardDied,
        'aura_triggered': AuraTriggered,
        'buffed': Buffed,
        'debuffed': DeBuffed,
        'dummy': Dummy,
        'side_switched': SideSwitched,
        'returned_hand': ReturnedHand,
        'shuffled': Shuffled,
        'summoned': Summoned,
        'transformed': Transformed,
        'player_died': PlayerDied
    };
};

Playback.add = function(key, seq, data){
    //console.log("Playback.add", key, data);
    if (key === "list"){
        //console.log("Playback list.add", data);
        this.playbacks.push(new PlaybackListItem(seq, data));
    } else {
        this.playbacks.push(new PlaybackItem(key, seq, data));
    }
};

Playback.next = function(){
    if (this.previousAnimationCompleted && this.playbacks.length) {
        return this.playbacks.shift();  //return & remove first item
    }
    return null;
};

Playback.completed = function(){
    this.previousAnimationCompleted = true;
};

Playback.started = function(){
    this.previousAnimationCompleted = false;
};


function PlaybackListItem(seq, items){
    this.animations = [];
    this.key = "list";

    for (var i = 0; i < items.length; i++){
        if (items[i]) {
            var key = Object.keys(items[i])[0];
            var item = items[i][key];
            this.animations.push(new PlaybackItem(key, seq.toString()+"-"+i.toString(), item));
            //console.log("AnimationList.added", key, item);
        }
    }

    this.start = function(){
        var ganimations = [];
        for (var i = 0; i < this.animations.length; i++){
            for (var j = 0; j < this.animations[i].items.length; j++) {
                ganimations.push(this.animations[i].items[j]);
            }
        }
        Game.animations.push(ganimations);
        Playback.started();
    };
}


function PlaybackItem(key, seq, data){
    this.key = key;
    this.data = data;
    this.items = [];
    this.sequence = seq;

    this.init = function(){
        var item = null;

        if (Object.keys(Playback.animationClassMap).indexOf(this.key) > -1){
            item = new Playback.animationClassMap[this.key](data);
            this.items.push(item);
            //console.log("PlaybackItem.initialized: ", this.key, seq);
        } else {
            throw new Error("invalid PlaybackItem " + this.key);
        }
    };

    this.start = function(){
        Game.animations.push(this.items);
        Playback.started();
    };

    this.init();
}
