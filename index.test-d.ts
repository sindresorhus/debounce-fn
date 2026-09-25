import {expectTypeOf, expectError} from 'nz';
import debounceFunction, {type DebouncedFunction} from './index.js';

const isString = (_string: string) => true;

const debounced = debounceFunction(isString);
expectTypeOf(debounced).toBe<DebouncedFunction<[string], boolean | undefined>>();
expectTypeOf(debounced('foo')).toBe<boolean | undefined>();
debounced.cancel();

expectTypeOf(debounceFunction(isString)('foo')).toBe<boolean | undefined>();
expectError<boolean>(debounceFunction(isString)('foo'));

expectTypeOf(debounceFunction(isString, {wait: 20})('foo')).toBe<boolean | undefined>();
expectError<boolean>(debounceFunction(isString, {wait: 20})('foo'));
expectTypeOf(debounceFunction(isString, {after: true})('foo')).toBe<boolean | undefined>();
expectError<boolean>(debounceFunction(isString, {after: true})('foo'));

expectTypeOf(debounceFunction(isString, {before: true})('foo')).toBe<boolean>();
expectTypeOf(debounceFunction(isString, {before: true, after: true})('foo')).toBe<boolean>();

expectTypeOf(debounceFunction(isString, {after: false})('foo')).toBe<undefined>();

expectError<boolean>(debounceFunction(isString, {after: false})('foo'));
