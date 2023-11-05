import test from 'ava';
import delay from 'delay';
import debounceFunction from './index.js';

test('debounces a function', async t => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
	});

	t.is(debounced(1), undefined);
	t.is(debounced(2), undefined);
	t.is(debounced(3), undefined);

	await delay(100);
	t.is(debounced(4), 3);
	t.is(debounced(5), 3);
	t.is(debounced(6), 3);
	t.is(count, 1);

	await delay(200);
	t.is(count, 2);
});

test('before:false after:false options', t => {
	t.throws(() => {
		debounceFunction(() => null, {
			wait: 20,
			before: false,
			after: false,
		});
	}, {
		message: 'Both `before` and `after` are false, function wouldn\'t be called.',
	});
});

test('before:true after:false options', async t => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: false,
	});

	t.is(debounced(1), 1);
	t.is(debounced(2), 1);
	t.is(debounced(3), 1);
	t.is(count, 1);

	await delay(100);
	t.is(debounced(4), 4);
	t.is(debounced(5), 4);
	t.is(debounced(6), 4);
	t.is(count, 2);

	await delay(200);
	t.is(count, 2);
});

test('before:false after:true options', async t => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: false,
		after: true,
	});

	t.is(debounced(1), undefined);
	t.is(debounced(2), undefined);
	t.is(debounced(3), undefined);
	t.is(count, 0);

	await delay(100);
	t.is(debounced(4), 3);
	t.is(debounced(5), 3);
	t.is(debounced(6), 3);
	t.is(count, 1);

	await delay(200);
	t.is(count, 2);
});

test('before:true after:true options', async t => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: true,
	});

	t.is(debounced(1), 1);
	t.is(debounced(2), 1);
	t.is(debounced(3), 1);
	t.is(count, 1);

	await delay(100);
	t.is(count, 2);
	t.is(debounced(4), 4);
	t.is(debounced(5), 4);
	t.is(debounced(6), 4);
	t.is(count, 3);

	await delay(200);
	t.is(count, 4);
});

test('.cancel() method', async t => {
	let count = 0;

	const debounced = debounceFunction(value => {
		count++;
		return value;
	}, {
		wait: 20,
	});

	t.is(debounced(1), undefined);
	t.is(debounced(2), undefined);
	t.is(debounced(3), undefined);

	debounced.cancel();

	await delay(100);
	t.is(debounced(1), undefined);
	t.is(debounced(2), undefined);
	t.is(debounced(3), undefined);
	t.is(count, 0);
});

test('before:false after:true `maxWait` option', async t => {
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

	t.is(debounced(1), undefined);
	t.is(count, 0);
	await delay(30);
	t.is(count, 0);

	t.is(debounced(2), undefined);
	t.is(count, 0);
	await delay(30);
	t.is(count, 1);

	t.is(debounced(3), 1);

	t.is(count, 1);
	await delay(200);
	t.is(count, 2);
});

test('before:true after:false `maxWait` option', async t => {
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

	t.is(debounced(1), 1);
	t.is(count, 1);
	await delay(30);

	t.is(debounced(2), 1);
	t.is(count, 1);
	await delay(30);
	t.is(count, 1);

	t.is(debounced(3), 3);
	t.is(count, 2);

	await delay(50);
	t.is(count, 2);

	t.is(debounced(4), 4);
	t.is(count, 3);
});

test('before:true after:true `maxWait` option', async t => {
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

	t.is(debounced(1), 1);
	t.is(count, 1);
	await delay(30);

	t.is(debounced(2), 1);
	t.is(count, 1);
	await delay(30);
	t.is(count, 2);

	t.is(debounced(3), 3);
	t.is(count, 3);

	await delay(50);
	t.is(count, 4);

	t.is(debounced(4), 4);
	t.is(count, 5);
});

test('maxWait triggers with after set to false', async t => {
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
	t.is(debounced(1), 1);
	t.is(count, 1);

	// `maxWait`` should not trigger the function since after is false
	await delay(70);
	t.is(count, 1); // No additional calls should have been made
});

test('`wait` and `maxWait` are the same', async t => {
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

	t.is(count, 1);
});

test('`maxWait` less than `wait`', async t => {
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

	t.is(count, 1);
	await delay(100);
	t.is(count, 1); // Should not be invoked again
});

test('continuous rapid calls preventing `after` invocation', async t => {
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

	t.is(count, 0); // Should never be called due to continuous rapid invocation
});
