export interface TrainAndTestParams {
    inputs: number[][];
    labels: number[];
    ratio: number;
}
export interface TrainAndTestReturn {
    trainValues: number[][];
    testValues: number[][];
    trainLabels: number[];
    testLabels: number[];
}
export interface ClassProps {
    inputs: number[][];
    labels: number[];
}
export interface Model {
    intercept: number;
    slopes: number[];
    error: number;
}
export interface Weights {
    intercept: number;
    slopes: number[];
}
export interface WeightsToUpdate {
    deltaIntercept: number;
    deltaSlopes: number[];
}
export interface FitParams {
    iterations?: number;
    learningRate?: number;
    optimizeStartingWeights?: boolean;
    logging?: boolean;
}
export interface ScoreParams {
    testValues: number[][];
    testLabels: number[];
}
export interface OptimizedHyperparamsParams {
    iterations: number[];
    learningRates: number[];
}
export interface OptimizedHyperparams {
    iteration: number;
    learningRate: number;
}
export interface TrainAndTest {
    train: number[][];
    test: number[][];
}
export interface TrainAndTestLabels {
    train: number[];
    test: number[];
}
export interface Scores {
    mse: number;
    mae: number;
}
export interface ParamLists {
    shuffledValues: number[][];
    shuffledLabels: number[];
}
