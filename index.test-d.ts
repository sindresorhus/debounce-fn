import {expectType, expectError} from 'tsd';
import debounceFn = require('.');

const options: debounceFn.Options = {};
const debounced = debounceFn((string: string) => true);
expectType<debounceFn.DebouncedFunction<[string], boolean | undefined>>(
	debounced
);
expectType<boolean | undefined>(debounced('foo'));
debounced.cancel();

const debouncedWithoutOptions = debounceFn((string: string) => true);
expectType<boolean | undefined>(debouncedWithoutOptions('foo'));
expectError<boolean>(debouncedWithoutOptions('foo'));

const debouncedWithWait = debounceFn((string: string) => true, {wait: 100});
expectType<boolean | undefined>(debouncedWithWait('foo'));
expectError<boolean>(debouncedWithWait('foo'));

const debouncedWithImmediate = debounceFn((string: string) => true, {
	immediate: true
});
expectType<boolean>(debouncedWithImmediate('foo'));
