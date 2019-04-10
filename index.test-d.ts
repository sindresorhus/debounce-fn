import {expectType} from 'tsd';
import debounceFn = require('.');

const debounced = debounceFn((string: string) => true);
expectType<((string: string) => boolean | undefined) & {cancel(): void}>(debounced);
expectType<boolean | undefined>(debounced('foo'));
debounced.cancel();

debounceFn((string: string) => true);
debounceFn((string: string) => true, {wait: 100});
debounceFn((string: string) => true, {immediate: true});
