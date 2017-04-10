// make white noise sample
var bufferSize = 2 * con.sampleRate;
var noiseBuffer = con.createBuffer(1, bufferSize, con.sampleRate);
var output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}

var smackRate = 0.001;
var smackDepth = 0.001;
var smackFilter = con.createBiquadFilter()
var smackLFO = con.createOscillator();
var smackLFOAmp = con.createGain();
smackFilter.type = 'bandpass';
smackFilter.frequency.value = 3000;
smackFilter.Q.value = 1;

smackLFO.frequency.value = smackRate * 200;
smackLFOAmp.gain.value = smackDepth * 10;

smackLFO.connect(smackLFOAmp);
smackLFOAmp.connect(smackFilter.frequency);

smackFilter.gain.value = 8;
smackFilter.connect(masterAmp);
smackLFO.start();

function Smack (data) {
	var smackSource = con.createBufferSource();
	smackSource.buffer = noiseBuffer;
	smackSource.loop = true;

	var now = con.currentTime;
	var smackAmp = con.createGain();
	smackAmp.gain.setValueAtTime(0, now);

	smackSource.connect(smackAmp);
	smackAmp.connect(smackFilter);

	smackSource.start();
	var A = now + adsr[0] / 2.5; // max 0.4s
	var D = A + adsr[1] * 2; // max 2s
	var S = adsr[2] / 2; // max 0.5
	var R = D + adsr[3] * 4; // max 4s
	smackAmp.gain.linearRampToValueAtTime(1, A);
	smackAmp.gain.linearRampToValueAtTime(S, D);
	smackAmp.gain.linearRampToValueAtTime(0, R);
}


var adsr = [
	0, 0.04, 0.5, 0.1
]
function smackADSRChanged (data) {
	if(data[0]) adsr[0] = data[0];
	if(data[1]) adsr[1] = data[1];
	if(data[2]) adsr[2] = data[2];
	if(data[3]) adsr[3] = data[3];
}

function smackFilterRateChanged (data) {
	smackRate = data.value;
	smackLFO.frequency.value = smackRate * 20;
}

function smackFilterDepthChanged (data) {
	smackDepth = data.value;
	smackLFOAmp.gain.value = smackDepth * 2000;
}

var smacks = [];
function smackPadChanged (data) {
	if(!!data.press) smacks.push(Smack());
};


function setupSmack () {
	smackPad.on('*', smackPadChanged);
	smackPad.mode = 'impulse';

	smackADSR.setNumberOfSliders(4);
	smackADSR.set(adsr);
	smackADSR.on('*',smackADSRChanged)

	smackFilterRate.on('*', smackFilterRateChanged)
	smackFilterRate.set({value: smackRate});
	smackFilterDepth.on('*', smackFilterDepthChanged)
	smackFilterDepth.set({value: smackDepth});
}