document.querySelector('#darkmode').checked = window.matchMedia(
	'(prefers-color-scheme:dark)'
).matches;
