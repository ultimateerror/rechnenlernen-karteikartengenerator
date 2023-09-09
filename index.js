const worker = new Worker('worker-calculation-generator.js');

let config;

function showMessage(text) {
	const output = document.querySelector('output');
	output.hidden = !text;
	output.value = text;
}

function generateCards() {
	document.querySelector('main').innerHTML = '';

	if (config.fromDigit == config.toDigit) {
		showMessage('Fehler beim Zahlenraum 😮');
		return;
	}

	// worker.terminate();
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
		.slice(0, config.maxResultsCount);

	document.querySelector('main').append(...cards);

	const formatter = new Intl.NumberFormat('de-AT');

	showMessage(
		data.length > config.maxResultsCount
			? `Das Ergebnis wurde auf ${formatter.format(
					config.maxResultsCount
			  )} Einträge beschränkt.`
			: ''
	);
}

function writeConfig() {
	config = {
		symbol: document.querySelector('#symbol').value,
		fromDigit: +document.querySelector('#zahlenraumVon').value || 0,
		toDigit: +document.querySelector('#zahlenraumBis').value || 0,
		minResult: +document.querySelector('#ergebnisraumMin').value || 0,
		maxResult: +document.querySelector('#ergebnisraumMax').value || 0,
		maxResultsCount: 10000
	};
}

worker.addEventListener('message', renderCards);
worker.addEventListener('error', console.error);
worker.addEventListener('messageerror', console.error);

document
	.querySelector('#karteikartenErstellen')
	.addEventListener('click', () => {
		writeConfig();
		generateCards();
	});

document
	.querySelector('#print')
	.addEventListener('click', () => window.print());
