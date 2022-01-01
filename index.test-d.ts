import {expectType, expectError} from 'tsd';
import debounceFn, {DebouncedFunction} from './index.js';

const stringToBoolean = (_string: string) => true;

const debounced = debounceFn(stringToBoolean);
expectType<DebouncedFunction<[string], boolean | undefined>>(debounced);
expectType<boolean | undefined>(debounced('foo'));
debounced.cancel();

expectType<boolean | undefined>(debounceFn(stringToBoolean)('foo'));
expectError<boolean>(debounceFn(stringToBoolean)('foo'));

expectType<boolean | undefined>(debounceFn(stringToBoolean, {wait: 20})('foo'));
expectError<boolean>(debounceFn(stringToBoolean, {wait: 20})('foo'));
expectType<boolean | undefined>(debounceFn(stringToBoolean, {after: true})('foo'));
expectError<boolean>(debounceFn(stringToBoolean, {after: true})('foo'));

expectType<boolean>(debounceFn(stringToBoolean, {before: true})('foo'));
expectType<boolean>(debounceFn(stringToBoolean, {before: true, after: true})('foo'));

expectType<undefined>(debounceFn(stringToBoolean, {after: false})('foo'));

expectError<boolean>(debounceFn(stringToBoolean, {after: false})('foo'));
