document.querySelector('#darkmode').checked = window.matchMedia(
	'(prefers-color-scheme:dark)'
).matches;

document.querySelector('#share').hidden = !navigator.canShare();
document.querySelector('#share').addEventListener('click', () => {
	navigator.share(window.location.href);
});

(function loadSettingsFromUrlParams() {
	const rawConfig = new URL(window.location.href).searchParams.get('c');
	if (!rawConfig) return;

	try {
		const config = JSON.parse(rawConfig);

		Object.entries(config).forEach(([id, value]) => {
			document.querySelector(`#${id}`).value = value;
		});
	} catch {}
})();
