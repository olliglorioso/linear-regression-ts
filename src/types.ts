export interface SimpleModel {
    intercept: number,
    slope: number,
    error: number
}

export interface ClassProps {
    inputs?: number[],
    labels: number[],
    multiInputs?: number[][]
}

export interface OptimizedValues {
    iteration: number,
    learningRate: number
}

export interface TrainAndTest {
    train: number[],
    test: number[]
}

export interface TrainAndTestForPrediction {
    trainValues: number[],
    testValues: number[],
    trainLabels: number[],
    testLabels: number[]
}

export interface Scores {
    mse: number,
    mae: number
}

export interface ParamLists {
    shuffledValues: number[],
    shuffledLabels: number[]
}

export type Values = number[] | Generator