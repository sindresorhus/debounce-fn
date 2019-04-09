'use strict';
const mimicFn = require('mimic-fn');

module.exports = (fn, options = {}) => {
	if (typeof fn !== 'function') {
		throw new TypeError(`Expected the first argument to be a function, got \`${typeof fn}\``);
	}

	let timeout;
	let result;

	const debounced = function (...args) {
		const context = this;

		const later = () => {
			timeout = null;
			if (!options.immediate) {
				result = fn.apply(context, args);
			}
		};

		const callNow = options.immediate && !timeout;
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
