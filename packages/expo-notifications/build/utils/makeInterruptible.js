/**
 * Takes in a generator function and creates a regular function
 * that calls (goes through all the values generated by)
 * the generator function, but it:
 * 1. makes it interruptible on the generator function's `yield`s
 *    (interrupting = stopping generating new values from the generator)
 * 2. makes it automatically interrupted by another call.
 *
 * It always calls the iterator for the next value passing in
 * awaited result of a previous yielded value which makes
 * it easy to create interruptible asynchronous methods.
 *
 * For more information see https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
 *
 * @param func The generator function
 * @return An array of three elements:
 * 1. An async function that triggers "calling" the generator passed in.
 *    It resolves with the final value returned by the generator
 *    or undefined if the call has been interrupted by another call.
 * 2. A function returning whether any call has already been made
 *    to the generator.
 * 3. A function interrupting processing of the generator.
 */
export default function makeInterruptible(func) {
    // We're using Object as nonce.
    // eslint-disable-next-line @typescript-eslint/ban-types
    let globalNonce = null;
    let hasBeenCalled = false;
    function hasBeenCalledAtLeastOnce() {
        return hasBeenCalled;
    }
    function interrupt() {
        // By changing `globalNonce` we interrupt
        // progress for any existing `callFunc` calls.
        // No call will ever use `null` nonce.
        globalNonce = null;
    }
    async function callFunc(...args) {
        hasBeenCalled = true;
        // Interrupt any existing calls
        interrupt();
        // eslint-disable-next-line no-new-object
        globalNonce = {};
        const localNonce = globalNonce;
        const iterator = func(...args);
        let resumeValue;
        while (true) {
            // Guard before .next() await
            if (localNonce !== globalNonce) {
                return; // a new call was made
            }
            // We can use a mix of function generator and asynchronous function
            // as per https://www.pluralsight.com/guides/using-asyncawait-with-generator-functions.
            const element = await iterator.next(resumeValue);
            if (element.done) {
                return element.value; // final return value of passed generator
            }
            // Guard before await
            if (localNonce !== globalNonce) {
                return; // a new call was made
            }
            // whatever the generator yielded, _now_ run await on it
            resumeValue = await element.value;
            // next loop, we'll give resumeValue back to the generator
        }
    }
    return [callFunc, hasBeenCalledAtLeastOnce, interrupt];
}
//# sourceMappingURL=makeInterruptible.js.map