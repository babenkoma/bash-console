'use strict';

/**
 * @module
 * @licence MIT
 * @author Marina Babenko <babenkoma@gmail.com>
 */

/**
 * Checks obj is it generator function
 * @param obj
 * @returns {*|boolean}
 */
function isGeneratorFunction (obj) {
	return obj && obj.constructor && (obj.constructor.name === 'GeneratorFunction' || obj.constructor.displayName === 'GeneratorFunction');
}

/**
 * Checks obj is it generator
 * @param obj
 * @returns {*|boolean}
 */
function isGenerator (obj) {
	return obj && typeof obj.next === 'function' && typeof obj.throw === 'function';
}

/**
 * Checks obj is it promise
 * @param obj
 * @returns {*|boolean}
 */
function isPromise (obj) {
	return obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

/**
 * Checks obj is it function
 * @param obj
 * @returns {boolean}
 */
function isFunction (obj) {
	return typeof obj === 'function';
}

/**
 * Transform arguments of function into array or value
 * @param args
 * @returns {*}
 */
function getArguments (args) {
	let result = null;
	if (args.length > 1) {
		result = [];
		for(let i = 0; i < args.length; i++) {
			result.push(args[i]);
		}
	} else if (args.length === 1) {
		result = args[0];
	}

	return result;
}


/**
 * Super Co function
 * @param generator - generator function or generator
 * @returns {Promise}
 */
function superCo (generator) {
	return new Promise((resolve, reject) => {
		let gen = null;
		if (isGeneratorFunction(generator)) {
			gen = generator();
		} else if (isGenerator(generator)) {
			gen = generator;
		} else {
			resolve(generator);
		}

		function next () {
			let args = getArguments(arguments);
			let item = {};

			try {
				item = gen.next(args);
			} catch (error) {
				reject(error);
			}

			if (!item.done) {
				if (isGeneratorFunction(item.value) || isGenerator(item.value)) {
					superCo(item.value).then(next).catch(reject);
				} else if (isPromise(item.value)) {
					item.value.then(next).catch(reject);
				} else if (isFunction(item.value)) {
					try {
						item.value(next);
					} catch (error) {
						reject(error);
					}
				} else {
					next(item.value);
				}
			} else {
				resolve(item.value);
			}
		}

		if (gen) {
			next();
		}
	});
}

/**
 * asynchronous loop which return Promise
 * @param arr - array of elements
 * @param func - function with an element that as its attribute, which return Promise
 */
superCo.forEach = (arr = [], func) => {
	let run = (i = 0) => {
		return superCo(function* () {
			if (arr.length >= i + 1) {
				yield func(arr[i]);
				yield run(i + 1);
			}
		});
	};

	if (Array.isArray(arr)) {
		return run();
	} else {
		return new Promise();
	}
};

/**
 * Exports
 */
module.exports = superCo;
