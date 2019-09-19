
var AuraOwnerAnim = function(){
    this.stars = [];
    this.numStars = 100;
    this.speed = 3;

    for (var i = 0; i < this.numStars; i++) {
        this.stars[i] = this.makeStar();
    }
};


AuraOwnerAnim.prototype.makeStar = function(){
    return {
		x: Math.random(),
        y: Math.random(),
		distance: Math.sqrt(Math.random()),
		color: 'hsl('+Math.random()*40+',100%,'+(70+Math.random()*30)+'%)',
        activeColor: "hsl(115, 97%, " + (40+Math.random()*10) + "%)"
        //color: "hsl(115, 97%, " + (40+Math.random()*10) + "%)"
	};
};

AuraOwnerAnim.prototype.draw = function(card){
	// Draw each star
	for (var i = 0; i < this.numStars; i++) {
		// Move the star first
        this.stars[i].y -= Math.pow(this.stars[i].distance, 2) / canvas.height * this.speed;

		// If it's off-screen, reset it
		if (this.stars[i].y <= 0) {
			this.stars[i] = this.makeStar();
			this.stars[i].y = 1; //this.card.y - this.card.height;
		}

		// Draw the star
		context.beginPath();
		context.arc(
            card.portraitVisual.x + (this.stars[i].x * card.portraitVisual.getSize().width),
		    card.portraitVisual.y + (this.stars[i].y * card.portraitVisual.getSize().height),
            //this.stars[i].x * canvas.width,
            //this.stars[i].x * this.card.width,
            //this.stars[i].y * (this.card.y + this.card.height),
            //this.stars[i].y * canvas.height,
            this.stars[i].distance * 2,

            0,
            2 * Math.PI,
            false
        );
		context.lineWidth = this.stars[i].distance * 4;
		context.strokeStyle = "rgba(255,255,255,0.2)";
		context.stroke();
		context.lineWidth = 1; // reset border

		if (card.auraTriggered){
		    context.fillStyle = this.stars[i].activeColor;
        } else {
            context.fillStyle = this.stars[i].color;
        }
		context.fill();
	}
};
