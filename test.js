import test from 'ava';
import delay from 'delay';
import debounceFn from '.';

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

test('before:false after:false options', async t => {
	let count = 0;

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20,
		before: false,
		after: false
	});

	t.is(debounced(1), undefined);
	t.is(debounced(2), undefined);
	t.is(debounced(3), undefined);
	t.is(count, 0);

	await delay(100);
	t.is(debounced(4), undefined);
	t.is(debounced(5), undefined);
	t.is(debounced(6), undefined);
	t.is(count, 0);

	await delay(200);
	t.is(count, 0);
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
