import { ClassProps, FitParams, Model, OptimizedHyperparams, OptimizedHyperparamsParams, ScoreParams, Scores, TrainAndTestReturn, TrainAndTestParams, Weights } from "./types";
/**
* @param TrainAndTestParams.input The input values.
* @param TrainAndTestParams.labels The output values.
* @param TrainAndTestParams.ratio How many % of the data is for training.
* @description Returns randomly selected train- & test-inputs for use.
* @returns trainValues, testValues, trainLabels, testLabels
*/
export declare const trainAndTestSets: ({ inputs, labels, ratio }: TrainAndTestParams) => TrainAndTestReturn;
export declare class LinearRegression {
    #private;
    inputs: any;
    labels: number[];
    intercept: number;
    slopes: number[];
    constructor({ inputs, labels }: ClassProps);
    /**
     *
     * @param FitParams.iterations Amount of iterations. (default 1000)
     * @param FitParams.learningRate Learning rate of iterations. (default 0.0001)
     * @param FitParams.logging Log some output on every {iterations / 10}th iteration. (default false)
     * @param FitParams.optimizeStartingWeights Optimize the starting weights, only for one-variable-regression. (default false)
     * @returns
     */
    fit({ iterations, learningRate, logging, optimizeStartingWeights }: FitParams): Model;
    /**
     *
     * @param ScoreParams.testValues Calculate the predictions based on these inputs.
     * @param ScoreParams.testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model.
     * @returns {Object} { mse: number, mae: numer } Mean squared error and mean absolute error of the model.
     */
    scores({ testValues, testLabels }: ScoreParams): Scores;
    /**
     *
     * @param OptimizedHyperparamsParams.iterations The list of iterations/epochs to test.
     * @param OptimizedHyperparamsParams.learningRate The list of learning rates to test.
     * @returns {Object} { iteration: number, learningRate: number } Best possible epoch and learning rate combination.
     */
    optimizeHyperparams({ iterations, learningRates }: OptimizedHyperparamsParams): OptimizedHyperparams;
    /**
     *
     * @param Weights.slopes Slope.
     * @param Weights.intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    setModel({ slopes, intercept }: Weights): void;
    /**
     *
     * @param Inputs.inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    predict({ inputs }: {
        inputs: number[][];
    }): Generator<number>;
}
