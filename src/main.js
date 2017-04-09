nx.onload = function () {
	nx.colorize('border', '#990000');
	nx.colorize('fill', '#660000');
	nx.colorize('accent', '#FF0000');

	setupBoom();
	setupSmack();
};

var ac = window.AudioContext || window.webkitAudioContext;
var con = new ac();
var masterAmp = con.createGain();

masterAmp.gain.value = 0.25;
masterAmp.connect(con.destination);
