/**
 * Created by hasan on 6/14/2019.
 */
var ground1 = new Ground();
var ground2 = new Ground();


var oHand = new Hand("top");
var myHand = new Hand("bottom");

/*
for (var i = 0; i < 7; i++){

    hand1.addCard(new Card(i+1, "YourMonster" + i.toString(), Math.floor(Math.random()* 29)+1, Math.floor(Math.random() * 29)+1));
    hand2.addCard(new Card(i+1, "MyMonster" + i.toString(), Math.floor(Math.random()* 29)+1, Math.floor(Math.random() * 29)+1));
}
*/

ground1.draw(100, oHand.height + 5);
ground2.draw(100, canvas.height - myHand.height - ground2.height - 5);


oHand.draw(100, 0);
myHand.draw(100, canvas.height - myHand.height);

console.log(oHand);
console.log(myHand);