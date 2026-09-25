import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
import debounceFunction from './index.js';

test('debounces a function', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
	});

	assert.equal(debounced(1), undefined);
	assert.equal(debounced(2), undefined);
	assert.equal(debounced(3), undefined);

	await delay(100);
	assert.equal(debounced(4), 3);
	assert.equal(debounced(5), 3);
	assert.equal(debounced(6), 3);
	assert.equal(count, 1);

	await delay(200);
	assert.equal(count, 2);
});

test('before:false after:false options', () => {
	assert.throws(() => {
		debounceFunction(() => null, {
			wait: 20,
			before: false,
			after: false,
		});
	}, {
		message: 'Both `before` and `after` are false, function wouldn\'t be called.',
	});
});

test('before:true after:false options', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: false,
	});

	assert.equal(debounced(1), 1);
	assert.equal(debounced(2), 1);
	assert.equal(debounced(3), 1);
	assert.equal(count, 1);

	await delay(100);
	assert.equal(debounced(4), 4);
	assert.equal(debounced(5), 4);
	assert.equal(debounced(6), 4);
	assert.equal(count, 2);

	await delay(200);
	assert.equal(count, 2);
});

test('before:false after:true options', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: false,
		after: true,
	});

	assert.equal(debounced(1), undefined);
	assert.equal(debounced(2), undefined);
	assert.equal(debounced(3), undefined);
	assert.equal(count, 0);

	await delay(100);
	assert.equal(debounced(4), 3);
	assert.equal(debounced(5), 3);
	assert.equal(debounced(6), 3);
	assert.equal(count, 1);

	await delay(200);
	assert.equal(count, 2);
});

test('before:true after:true options', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: true,
	});

	assert.equal(debounced(1), 1);
	assert.equal(debounced(2), 1);
	assert.equal(debounced(3), 1);
	assert.equal(count, 1);

	await delay(100);
	assert.equal(count, 2);
	assert.equal(debounced(4), 4);
	assert.equal(debounced(5), 4);
	assert.equal(debounced(6), 4);
	assert.equal(count, 3);

	await delay(200);
	assert.equal(count, 4);
});

test('.cancel() method', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
	});

	assert.equal(debounced(1), undefined);
	assert.equal(debounced(2), undefined);
	assert.equal(debounced(3), undefined);

	debounced.cancel();

	await delay(100);
	assert.equal(debounced(1), undefined);
	assert.equal(debounced(2), undefined);
	assert.equal(debounced(3), undefined);
	assert.equal(count, 0);
});

test('before:false after:true `maxWait` option', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: true,
		before: false,
	});

	assert.equal(debounced(1), undefined);
	assert.equal(count, 0);
	await delay(30);
	assert.equal(count, 0);

	assert.equal(debounced(2), undefined);
	assert.equal(count, 0);
	await delay(30);
	assert.equal(count, 1);

	assert.equal(debounced(3), 1);

	assert.equal(count, 1);
	await delay(200);
	assert.equal(count, 2);
});

test('before:true after:false `maxWait` option', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: false,
		before: true,
	});

	assert.equal(debounced(1), 1);
	assert.equal(count, 1);
	await delay(30);

	assert.equal(debounced(2), 1);
	assert.equal(count, 1);
	await delay(30);
	assert.equal(count, 1);

	assert.equal(debounced(3), 3);
	assert.equal(count, 2);

	await delay(50);
	assert.equal(count, 2);

	assert.equal(debounced(4), 4);
	assert.equal(count, 3);
});

test('before:true after:true `maxWait` option', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: true,
		before: true,
	});

	assert.equal(debounced(1), 1);
	assert.equal(count, 1);
	await delay(30);

	assert.equal(debounced(2), 1);
	assert.equal(count, 1);
	await delay(30);
	assert.equal(count, 2);

	assert.equal(debounced(3), 3);
	assert.equal(count, 3);

	await delay(50);
	assert.equal(count, 4);

	assert.equal(debounced(4), 4);
	assert.equal(count, 5);
});

test('maxWait triggers with after set to false', async () => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		maxWait: 50,
		after: false,
		before: true,
	});

	// Should invoke immediately since before is true
	assert.equal(debounced(1), 1);
	assert.equal(count, 1);

	// `maxWait` should not trigger the function since after is false
	await delay(70);
	assert.equal(count, 1); // No additional calls should have been made
});

test('`wait` and `maxWait` are the same', async () => {
	let count = 0;

	const debounced = debounceFunction(() => {
		count++;
	}, {
		wait: 50,
		maxWait: 50,
		after: true,
	});

	debounced();
	await delay(20);
	debounced();
	await delay(20);
	debounced();
	await delay(60); // Should be invoked once due to maxWait

	assert.equal(count, 1);
});

test('`maxWait` less than `wait`', async () => {
	let count = 0;

	const debounced = debounceFunction(() => {
		count++;
	}, {
		wait: 100,
		maxWait: 50,
		after: true,
	});

	debounced();
	await delay(30);
	debounced();
	await delay(30); // Should be invoked here due to maxWait

	assert.equal(count, 1);
	await delay(100);
	assert.equal(count, 1); // Should not be invoked again
});

test('continuous rapid calls preventing `after` invocation', async () => {
	let count = 0;

	const debounced = debounceFunction(() => {
		count++;
	}, {
		wait: 50,
		after: true,
	});

	const interval = setInterval(debounced, 10);
	await delay(200);
	clearInterval(interval);

	assert.equal(count, 0); // Should never be called due to continuous rapid invocation
});
