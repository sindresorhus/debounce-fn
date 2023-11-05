import {expectType, expectError} from 'tsd';
import debounceFunction, {type DebouncedFunction} from './index.js';

const stringToBoolean = (_string: string) => true;

const debounced = debounceFunction(stringToBoolean);
expectType<DebouncedFunction<[string], boolean | undefined>>(debounced);
expectType<boolean | undefined>(debounced('foo'));
debounced.cancel();

expectType<boolean | undefined>(debounceFunction(stringToBoolean)('foo'));
expectError<boolean>(debounceFunction(stringToBoolean)('foo'));

expectType<boolean | undefined>(debounceFunction(stringToBoolean, {wait: 20})('foo'));
expectError<boolean>(debounceFunction(stringToBoolean, {wait: 20})('foo'));
expectType<boolean | undefined>(debounceFunction(stringToBoolean, {after: true})('foo'));
expectError<boolean>(debounceFunction(stringToBoolean, {after: true})('foo'));

expectType<boolean>(debounceFunction(stringToBoolean, {before: true})('foo'));
expectType<boolean>(debounceFunction(stringToBoolean, {before: true, after: true})('foo'));

expectType<undefined>(debounceFunction(stringToBoolean, {after: false})('foo'));

expectError<boolean>(debounceFunction(stringToBoolean, {after: false})('foo'));
