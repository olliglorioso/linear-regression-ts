export interface SimpleModel {
    intercept: number;
    slope: number;
    error: number;
}
export interface OptimizedValues {
    iteration: number;
    learningRate: number;
}
export interface TrainAndTest {
    train: number[];
    test: number[];
}
export interface TrainAndTestForPrediction {
    trainValues: number[];
    testValues: number[];
    trainLabels: number[];
    testLabels: number[];
}
export interface Scores {
    mse: number;
    mae: number;
}
export interface ParamLists {
    shuffledValues: number[];
    shuffledLabels: number[];
}
export declare type Values = number[] | Generator;
