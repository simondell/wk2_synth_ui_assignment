//
// synth
//
var ac = window.AudioContext || window.webkitAudioContext;
var con = new ac();

var masterAmp = con.createGain();
masterAmp.gain.value = 0.3;
masterAmp.connect(con.destination);

// boomOsc
function boom() {
	var booming = false;
	var boomOsc1, boomOsc2, boomOsc3;
	var boomAmp = con.createGain();

	boomOsc1 = con.createOscillator();
	boomOsc2 = con.createOscillator();
	boomOsc3 = con.createOscillator();

	boomOsc1.type = 'sine';
	boomOsc2.type = 'sawtooth';
	boomOsc3.type = 'square';

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
		boomOsc1.frequency.value = data.z * 0.98;
		boomOsc2.frequency.value = data.z * 1.01;
		boomOsc3.frequency.value = data.z * 0.99;

		// x controls level (rotate around charger axis)
		boomAmp.gain.setValueAtTime((data.x + 1) / 4, con.currentTime);
	}

	boomTilt.on('*', boomTiltChanged);

	return function endBoom () {
		booming = false;

		var now = con.currentTime;
		boomAmp.gain.linearRampToValueAtTime(0, now + 0.75);
		// boomAmp.gain.setTargetAtTime(0, 0.5, 0.5);
		boomOsc1.stop(con.currentTime + 0.76);
		boomOsc2.stop(con.currentTime + 0.76);
		boomOsc3.stop(con.currentTime + 0.76);
		setTimeout(function () { 
			boomAmp.disconnect(masterAmp);
			boomAmp = null;
		}, 1000 );
	}
}



//
// controls
//
nx.onload = function () {
	boomButton.on('*', button1Changed);
	boomButton.mode = 'toggle';

	nx.colorize('border', '#666666');
	nx.colorize('fill', '#000000');
	nx.colorize('accent', '#FF0000');
};

var booms = [];
function button1Changed (data) {
	if(!!data.press) booms.push(boom());
	else booms.shift()();
};
