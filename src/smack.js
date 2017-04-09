function Smack (data) {
	var smackSource = null;
	var boomAmp = con.createGain();

	boomOsc1 = con.createOscillator();

	return function endSmack () {}
}

var smacks = [];
function smackPadChanged (data) {
	if(!!data.press) booms.push(boom());
	else booms.shift()();
};


function setupSmack () {
	smackButton.on('*', button1Changed);
	smackButton.mode = 'impulse';
	// smackDecayDial.on('*', smackDecayChanged);
	// smackDecayDial.set({value: smackDecay});
}