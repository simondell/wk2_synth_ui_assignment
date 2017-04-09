function Boom() {
	var booming = false;
	var boomOsc1, boomOsc2, boomOsc3;
	var boomAmp = con.createGain();

	boomOsc1 = con.createOscillator();
	boomOsc2 = con.createOscillator();
	boomOsc3 = con.createOscillator();

	boomOsc1.type = 'sine';
	boomOsc2.type = 'sawtooth';
	boomOsc3.type = 'square';
	boomOsc2.detune.value = 50;
	boomOsc3.detune.value = 50;

	boomOsc1.connect(boomAmp);
	boomOsc2.connect(boomAmp);
	boomOsc3.connect(boomAmp);
	boomAmp.gain.setValueAtTime(0.3, con.currentTime);

	boomAmp.connect(masterAmp);
	boomOsc1.start();
	boomOsc2.start();
	boomOsc3.start();
	booming = true;

	function boomTiltChanged (data) {
		if(!booming) return;

		// z controls freq (steer with your phone)
		boomOsc1.frequency.value = data.z;
		boomOsc2.frequency.value = data.z;
		boomOsc3.frequency.value = data.z;

		// x controls level (rotate around charger axis)
		boomAmp.gain.setValueAtTime((data.x + 1) / 4, con.currentTime);
	}

	boomTilt.on('*', boomTiltChanged);

	return function endBoom () {
		var boomEnd = boomDecay * 2;
		booming = false;

		var now = con.currentTime;
		boomAmp.gain.linearRampToValueAtTime(0, now + boomDecay);
		boomOsc1.stop(now + boomEnd);
		boomOsc2.stop(now + boomEnd);
		boomOsc3.stop(now + boomEnd);
		setTimeout( function () {
			boomAmp.disconnect(masterAmp);
		}, 1000 * boomEnd);
	}
}

var boomDecay = 0.75;
function boomDecayChanged (data) {
	boomDecay = data.value;
}

var booms = [];
function button1Changed (data) {
	if(!!data.press) booms.push(Boom());
	else booms.shift()();
};

//
// begin
function setupBoom(){
	boomButton.on('*', button1Changed);
	boomButton.mode = 'toggle';
	boomDecayDial.on('*', boomDecayChanged);
	boomDecayDial.set({value: boomDecay});
}
