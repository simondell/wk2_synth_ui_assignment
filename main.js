document.onscroll = function () {};

nx.onload = function () {
	nx.colorize('border', '#000000');
	nx.colorize('fill', '#ff6666');
	nx.colorize('accent', '#000000');

	setupBoom();
	setupSmack();
	setupBip();
};

var ac = window.AudioContext || window.webkitAudioContext;
var con = new ac();
var masterAmp = con.createGain();

masterAmp.gain.value = 0.25;
masterAmp.connect(con.destination);
