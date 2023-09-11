document.querySelector('#darkmode').checked = window.matchMedia(
	'(prefers-color-scheme:dark)'
).matches;

function getShareData() {
	return {
		title: document.title,
		url: window.location.href
	};
}

document.querySelector('#share').hidden = !navigator.canShare(getShareData());
document.querySelector('#share').addEventListener('click', () => {
	navigator.share(getShareData());
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
