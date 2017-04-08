//
// synth
//
var ac = window.AudioContext || window.webkitAudioContext;
var con = new ac();

var masterAmp = con.createGain();
masterAmp.gain.value = 0.3;
masterAmp.connect(con.destination);

// boomOsc
var booming = false;
var boomOsc1, boomOsc2, boomOsc3;
var boomAmp = con.createGain();
boomAmp.connect(masterAmp);

function boom() {
	boomOsc1 = con.createOscillator();
	boomOsc2 = con.createOscillator();
	boomOsc3 = con.createOscillator();

	boomOsc1.type = 'sine';
	boomOsc2.type = 'sawtooth';
	boomOsc3.type = 'square';

	boomOsc1.connect(boomAmp);
	boomOsc2.connect(boomAmp);
	boomOsc3.connect(boomAmp);
	boomAmp.gain.value = 0.3;

	boomOsc1.start();
	boomOsc2.start();
	boomOsc3.start();
	booming = true;
}

function endBoom () {
	booming = false;
	boomAmp.gain.linearRampToValueAtTime(0, con.currentTime + 0.75);
	// boomAmp.gain.setTargetAtTime(0, 0.5, 0.5);
	boomOsc1.stop(con.currentTime + 1.5);
	boomOsc2.stop(con.currentTime + 1.5);
	boomOsc3.stop(con.currentTime + 1.5);
}


//
// controls
//
nx.onload = function () {
	boomTilt.on('*', tilt1Changed);

	boomButton.on('*', button1Changed);
	boomButton.mode = 'toggle';

	nx.colorize('border', '#666666');
	nx.colorize('fill', '#000000');
	nx.colorize('accent', '#FF0000');
};

function tilt1Changed(data) {
	if(!booming) return;

	// z controls freq (steer with your phone)
  boomOsc1.frequency.value = data.z * 0.98;
  boomOsc2.frequency.value = data.z * 1.01;
  boomOsc3.frequency.value = data.z * 0.99;

	// x controls level (rotate around charger axis)
	boomAmp.gain.value = (data.x + 1) / 4;
}

function button1Changed (data) {
	if(!!data.press) boom();
	else endBoom();
};
