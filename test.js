import test from 'ava';
import delay from 'delay';
import debounceFn from './index.js';

test('debounces a function', async t => {
	let count = 0;

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20
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
		debounceFn(() => null, {
			wait: 20,
			before: false,
			after: false
		});
	}, {
		message: 'Both `before` and `after` are false, function wouldn\'t be called.'
	});
});

test('before:true after:false options', async t => {
	let count = 0;

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: false
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: false,
		after: true
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: true,
		after: true
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: true,
		before: false
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: false,
		before: true
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

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 40,
		maxWait: 50,
		after: true,
		before: true
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
