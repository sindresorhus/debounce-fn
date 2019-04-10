declare namespace debounce {
	interface Options {
		/**
		Time to wait until the `input` function is called.

		@default 0
		*/
		readonly wait?: number;

		/**
		Trigger the function on the leading edge instead of the trailing edge of the `wait` interval. For example, can be useful for preventing accidental double-clicks on a "submit" button from firing a second time.

		@default false
		*/
		readonly immediate?: boolean;
	}
}

/**
[Debounce](https://davidwalsh.name/javascript-debounce-function) a function.

@param input - Function to debounce.
@returns A debounced function that delays calling the `input` function until after `wait` milliseconds have elapsed since the last time the debounced function was called.

It comes with a `.cancel()` method to cancel any scheduled `input` function calls.

@example
```
import debounceFn = require('debounce-fn');

window.onresize = debounceFn(() => {
	// Do something on window resize
}, {wait: 100});
```
*/
declare function debounceFn<ArgumentsType extends unknown[], ReturnType>(
	input: (...arguments: ArgumentsType) => ReturnType,
	options?: debounce.Options
): ((...arguments: ArgumentsType) => ReturnType | undefined) & {cancel(): void};

export = debounceFn;
