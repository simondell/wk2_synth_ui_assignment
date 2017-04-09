// make white noise sample
var bufferSize = 2 * con.sampleRate;
var noiseBuffer = con.createBuffer(1, bufferSize, con.sampleRate);
var output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}


function Smack (data) {
	var smackSource = con.createBufferSource();
	smackSource.buffer = noiseBuffer;
	smackSource.loop = true;

	var smackAmp = con.createGain();
	smackAmp.gain.setValueAtTime(0.3, con.currentTime);

	smackSource.connect(smackAmp);
	smackAmp.connect(masterAmp);

	smackSource.start(0);
	var now = con.currentTime;
	var smackDecay = 0.3;
	smackAmp.gain.linearRampToValueAtTime(0, now + smackDecay);

	return function endSmack () { }
}

var smacks = [];
function smackPadChanged (data) {
	if(!!data.press) smacks.push(Smack());
	else smacks.shift()();
};


function setupSmack () {
	smackPad.on('*', smackPadChanged);
	smackPad.mode = 'impulse';
	// smackDecayDial.on('*', smackDecayChanged);
	// smackDecayDial.set({value: smackDecay});
}