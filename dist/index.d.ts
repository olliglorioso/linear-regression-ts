import { OptimizedValues, Scores, SimpleModel, TrainAndTestForPrediction } from "./types";
/**
* @param input The input values.
* @param labels The output values.
* @param ratio How many % of the data is for training.
* @description Returns randomly selected train- & test-inputs for use.
* @returns trainValues, testValues, trainLabels, testLabels
*/
export declare const trainAndTestSets: (inputs: number[], labels: number[], ratio: number) => TrainAndTestForPrediction;
export declare class LinearRegression {
    #private;
    inputs: number[];
    labels: number[];
    intercept: number;
    slope: number;
    constructor(inputs: number[], labels: number[]);
    /**
     *
     * @param iterations Amount of iterations. (default 1000)
     * @param learningRate Learning rate. (default 0.01)
     * @param maxError If a single cost of intercept/slope is over this threshold, ignore the corresponding value from calculations. (default false)
     * @param setParams Automatically set the intercept and slope of the model. (default true)
     * @description Give iterations and learning rate as a parameter, get the intercept and the slope back. Single-feature only.
     * @returns {Object} { intercept: number, slope: number, error: number }
     */
    fitSimple(iterations?: number, learningRate?: number, maxError?: number, setParams?: boolean): SimpleModel;
    /**
     *
     * @param testValues Calculate the predictions based on these inputs.
     * @param testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model.
     * @returns {Object} { mse: number, mae: numer }
     */
    scores(testValues: number[], testLabels: number[]): Scores;
    /**
     *
     * @param iterations List of iterations to test.
     * @param learningRates List of learning rates to test.
     * @description Automatically optimizes inputs for iterations and learning rates. Utilizes single-variable model.
     * @returns {Object} { bestIteration: number, bestLearningRate: number }
     */
    optimizedValues(iterations: number[], learningRates: number[]): OptimizedValues;
    /**
     *
     * @param slope Slope.
     * @param intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    simpleModelSet(slope: number, intercept: number): void;
    /**
     *
     * @param inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    simpleModelPredict(inputs: number[]): Generator<number>;
}
