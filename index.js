import mimicFunction from 'mimic-function';

export default function debounceFunction(inputFunction, options = {}) {
	if (typeof inputFunction !== 'function') {
		throw new TypeError(`Expected the first argument to be a function, got \`${typeof inputFunction}\``);
	}

	const {
		wait = 0,
		maxWait = Infinity,
		before = false,
		after = true,
	} = options;

	if (wait < 0 || maxWait < 0) {
		throw new RangeError('`wait` and `maxWait` must not be negative.');
	}

	if (!before && !after) {
		throw new Error('Both `before` and `after` are false, function wouldn\'t be called.');
	}

	let timeout;
	let maxTimeout;
	let result;
	let latestContext;
	let latestArguments;

	const cancel = () => {
		clearTimeout(timeout);
		timeout = undefined;
		clearTimeout(maxTimeout);
		maxTimeout = undefined;
		latestContext = undefined;
		latestArguments = undefined;
	};

	const later = () => {
		const context = latestContext;
		const arguments_ = latestArguments;
		cancel();

		if (after) {
			result = inputFunction.apply(context, arguments_);
		}
	};

	const debouncedFunction = function (...arguments_) {
		latestContext = this; // eslint-disable-line unicorn/no-this-assignment
		latestArguments = arguments_;

		const shouldCallNow = before && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (!maxTimeout && maxWait !== Infinity && maxWait > 0) {
			maxTimeout = setTimeout(later, maxWait);
		}

		if (shouldCallNow) {
			result = inputFunction.apply(this, arguments_);
		}

		return result;
	};

	mimicFunction(debouncedFunction, inputFunction);

	debouncedFunction.cancel = cancel;

	return debouncedFunction;
}
