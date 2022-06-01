"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LinearRegression_instances, _LinearRegression_coefficientErrors;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearRegression = exports.trainAndTestSets = void 0;
const utils_1 = require("./utils");
/**
* @param input The input values.
* @param labels The output values.
* @param ratio How many % of the data is for training.
* @description Returns randomly selected train- & test-inputs for use.
* @returns trainValues, testValues, trainLabels, testLabels
*/
const trainAndTestSets = (inputs, labels, ratio) => {
    const { shuffledValues, shuffledLabels } = (0, utils_1.shuffleList)(inputs, labels);
    const { train: trainValues, test: testValues } = (0, utils_1.splitToChunks)(ratio, shuffledValues);
    const { train: trainLabels, test: testLabels } = (0, utils_1.splitToChunks)(ratio, shuffledLabels);
    return { trainValues, testValues, trainLabels, testLabels };
};
exports.trainAndTestSets = trainAndTestSets;
class LinearRegression {
    constructor(inputs, labels) {
        _LinearRegression_instances.add(this);
        (0, utils_1.checkValues)(inputs, labels);
        this.inputs = inputs;
        this.labels = labels;
        this.intercept = Math.random() * 2;
        this.slope = Math.random() * 2;
    }
    /**
     *
     * @param iterations Amount of iterations. (default 1000)
     * @param learningRate Learning rate. (default 0.01)
     * @param maxError If a single cost of intercept/slope is over this threshold, ignore the corresponding value from calculations. (default false)
     * @param setParams Automatically set the intercept and slope of the model. (default true)
     * @description Give iterations and learning rate as a parameter, get the intercept and the slope back. Single-feature only.
     * @returns {Object} { intercept: number, slope: number, error: number }
     */
    fitSimple(iterations = 1000, learningRate = 0.001, maxError, setParams = true) {
        let bestSlope = 0;
        let bestIntercept = 0;
        let slope = 0;
        let intercept = 0;
        let minError = NaN;
        let errors = [];
        const { inputs, labels } = this;
        for (let iteration = 1; iteration <= iterations; iteration++) {
            let error = 0;
            for (const a in inputs) {
                const predicted = slope * inputs[a] + intercept;
                const iterationError = Math.pow((labels[a] - predicted), 2); // MSE
                error += iterationError;
                const { errorIntercept, errorSlope } = __classPrivateFieldGet(this, _LinearRegression_instances, "m", _LinearRegression_coefficientErrors).call(this, slope, intercept);
                if (maxError && (errorIntercept > maxError || errorSlope > maxError))
                    continue;
                slope = slope - learningRate * errorSlope;
                intercept = intercept - learningRate * errorIntercept;
            }
            if (iteration === 1 || error < minError) {
                minError = error;
                bestSlope = slope;
                bestIntercept = intercept;
            }
            errors.push(error);
        }
        if (setParams)
            this.intercept = bestIntercept, this.slope = bestSlope;
        return { intercept: bestIntercept, slope: bestSlope, error: minError };
    }
    /**
     *
     * @param testValues Calculate the predictions based on these inputs.
     * @param testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model.
     * @returns {Object} { mse: number, mae: numer }
     */
    scores(testValues, testLabels) {
        const predictedValues = this.simpleModelPredict(testValues);
        const { intercept, slope } = this;
        const n = testValues.length;
        let mse = 0;
        let mae = 0;
        let i = 0;
        for (const predicted of predictedValues) {
            const real = testLabels[i];
            const mseErr = Math.pow((real - predicted), 2);
            mse += mseErr;
            const maeErr = Math.abs(real - predicted);
            mae += maeErr;
            i++;
        }
        return { mse: (1 / n) * mse, mae: (1 / n) * mae };
    }
    /**
     *
     * @param iterations List of iterations to test.
     * @param learningRates List of learning rates to test.
     * @description Automatically optimizes inputs for iterations and learning rates. Utilizes single-variable model.
     * @returns {Object} { bestIteration: number, bestLearningRate: number }
     */
    optimizedValues(iterations, learningRates) {
        let returned = { iteration: 0, learningRate: 0 };
        let bestError = NaN;
        for (const it of iterations) {
            for (const lr of learningRates) {
                const { error } = this.fitSimple(it, lr);
                if (isNaN(bestError) || error < bestError) {
                    returned = { iteration: it, learningRate: lr };
                }
            }
        }
        return returned;
    }
    /**
     *
     * @param slope Slope.
     * @param intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    simpleModelSet(slope, intercept) {
        this.slope = slope;
        this.intercept = intercept;
    }
    /**
     *
     * @param inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    *simpleModelPredict(inputs) {
        for (const v of inputs) {
            yield this.slope * v + this.intercept;
        }
    }
}
exports.LinearRegression = LinearRegression;
_LinearRegression_instances = new WeakSet(), _LinearRegression_coefficientErrors = function _LinearRegression_coefficientErrors(slope, intercept) {
    const { inputs, labels } = this;
    const n = inputs.length;
    let errorIntercept = 0;
    let errorSlope = 0;
    for (const b in inputs) { // Calculate the gradient of cost function with respect to slope & intercept.
        const singleError = labels[b] - (slope * inputs[b] + intercept);
        const pdIntercept = (-2) / n * singleError;
        const pdSlope = (-2) / n * (inputs[b]) * singleError;
        errorIntercept = errorIntercept + pdIntercept;
        errorSlope = errorSlope + pdSlope;
    }
    return { errorIntercept, errorSlope };
};
//# sourceMappingURL=index.js.map