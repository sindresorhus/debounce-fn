import {expectType} from 'tsd';
import debounceFn = require('.');

const debounced = debounceFn((s: string) => true);
expectType<((s: string) => boolean | undefined) & {cancel(): void}>(debounced);
expectType<boolean | undefined>(debounced('foo'));
debounced.cancel();

debounceFn((s: string) => true);
debounceFn((s: string) => true, {wait: 100});
debounceFn((s: string) => true, {immediate: true});
