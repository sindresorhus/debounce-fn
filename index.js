'use strict';
const mimicFn = require('mimic-fn');

module.exports = (fn, options = {}) => {
	if (typeof fn !== 'function') {
		throw new TypeError(`Expected the first argument to be a function, got \`${typeof fn}\``);
	}

	const before = (options.before === undefined) ? false : options.before;
	const after = (options.after === undefined) ? true : options.after;

	if (!before && !after) {
		throw new Error('Both `before` and `after` are false, function wouldn\'t be called.');
	}

	let timeout;
	let result;

	const debounced = function (...args) {
		const context = this;

		const later = () => {
			timeout = null;
			if (after) {
				result = fn.apply(context, args);
			}
		};

		const callNow = before && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, options.wait || 0);

		if (callNow) {
			result = fn.apply(context, args);
		}

		return result;
	};

	mimicFn(debounced, fn);

	debounced.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
};
