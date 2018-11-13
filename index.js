'use strict';

/* eslint-disable no-var, prefer-rest-params */
var mimicFn = require('mimic-fn');

module.exports = function (fn, options) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected the first argument to be a function, got ' + (typeof fn));
	}

	options = options || {};

	var timeout;
	var result;

	var debounced = function () {
		var context = this;
		var args = arguments;

		var later = function () {
			timeout = null;
			if (!options.immediate) {
				result = fn.apply(context, args);
			}
		};

		var callNow = options.immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, options.wait || 0);

		if (callNow) {
			result = fn.apply(context, args);
		}

		return result;
	};

	mimicFn(debounced, fn);

	debounced.cancel = function () {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
};
