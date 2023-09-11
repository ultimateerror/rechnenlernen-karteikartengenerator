function calc(digit1, digit2) {
	switch (self.config.symbol) {
		case '+':
			return digit1 + digit2;

		case '-':
			return digit1 - digit2;

		case '*':
		case '·':
		case '×':
			return digit1 * digit2;

		case '/':
		case ':':
			return digit1 / digit2;
	}
}

function resultIsAllowed(digit1, digit2) {
	const result = calc(digit1, digit2);

	return result >= self.config.minResult && result <= self.config.maxResult;
}

function generateCalculations() {
	const nodes = [];

	const fromDigit = self.config.fromDigit;
	const toDigit = self.config.toDigit;

	bothLoops: for (let digit1 = fromDigit; digit1 <= toDigit; digit1++) {
		for (let digit2 = fromDigit; digit2 <= toDigit; digit2++) {
			if (!resultIsAllowed(digit1, digit2)) break;

			nodes.push({ digit1, digit2, symbol: self.config.symbol });

			if (nodes.length > self.config.resultsLimit) {
				break bothLoops;
			}
		}
	}

	self.postMessage(nodes);
}

self.addEventListener('message', ({ data }) => {
	self.config = data;
	generateCalculations();
});
