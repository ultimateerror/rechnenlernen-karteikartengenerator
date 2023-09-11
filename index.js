const worker = new Worker('worker-calculation-generator.js');
const excludedFields = ['darkmode', 'resultsLimit'];

let config;

function showMessage(text) {
	const output = document.querySelector('output');
	output.value = (text || '').toString();
}

function generateCards() {
	document.querySelector('main').innerHTML = '';

	if (config.fromDigit == config.toDigit) {
		showMessage('Fehler beim Zahlenraum 😮');
		return;
	}

	worker.postMessage(config);

	showMessage('lädt...');
}

function generateCardContentPart(content) {
	const element = document.createElement('span');
	element.classList.add(typeof content == 'number' ? 'digit' : 'symbol');
	element.textContent = content;

	return element;
}

function generateCard(digit1, digit2, symbol) {
	const card = document.createElement('section');

	card.append(
		generateCardContentPart(digit1),
		generateCardContentPart(symbol),
		generateCardContentPart(digit2)
	);

	return card;
}

function renderCards({ data }) {
	const cards = data
		.map(x => generateCard(x.digit1, x.digit2, x.symbol))
		.slice(0, config.resultsLimit);

	document.querySelector('main').append(...cards);

	if (data.length <= config.resultsLimit) {
		showMessage(false);
		return;
	}

	const formatter = new Intl.NumberFormat('de-AT');

	showMessage(
		`Das Ergebnis wurde auf ${formatter.format(
			config.resultsLimit
		)} Einträge beschränkt.`
	);
}

function writeConfig(serializedFormData) {
	config = serializedFormData;
}

function updateUrlParams() {
	const url = new URL(window.location);
	url.searchParams.set(
		'c',
		JSON.stringify(
			Object.fromEntries(
				Object.entries(config).filter(([key]) => !excludedFields.includes(key))
			)
		)
	);

	window.history.replaceState(null, '', url);
}

function getValueFromField(field) {
	switch (field.type) {
		case 'number':
			return field.valueAsNumber;

		case 'checkbox':
			return field.checked;
	}

	return field.value;
}

function getConfig(formEvent) {
	const form = formEvent.target;

	return {
		resultsLimit: 1000,
		...Object.fromEntries(
			Array.from(form.querySelectorAll('input, select')).map(field => {
				return [field.name, getValueFromField(field)];
			})
		)
	};
}

worker.addEventListener('message', renderCards);
worker.addEventListener('error', console.error);
worker.addEventListener('messageerror', console.error);

document.querySelector('form').addEventListener('submit', evnt => {
	evnt.preventDefault();

	config = getConfig(evnt);

	generateCards();
	updateUrlParams();
});

document
	.querySelector('#print')
	.addEventListener('click', () => window.print());
