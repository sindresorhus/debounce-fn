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

test('immediate option', async t => {
	let count = 0;

	const debounced = debounceFn(value => {
		count++;
		return value;
	}, {
		wait: 20,
		immediate: true
	});

	t.is(debounced(1), 1);
	t.is(debounced(2), 1);
	t.is(debounced(3), 1);

	await delay(100);
	t.is(debounced(4), 4);
	t.is(debounced(5), 4);
	t.is(debounced(6), 4);
	t.is(count, 2);

	await delay(200);
	t.is(count, 2);
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
