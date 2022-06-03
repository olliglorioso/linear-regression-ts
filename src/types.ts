export interface SimpleModel {
    intercept: number,
    slope: number,
    error: number
}

export interface MultiModel {
    intercept: number,
    slopes: number[],
    error: number
}

export interface WeightsSimple {
    intercept: number,
    slope: number
}

export interface ClassProps {
    inputs: any
    labels: number[],
}

export interface WeightsToUpdateMultiple {
    deltaIntercept: number,
    deltaSlopes: number[],
}

export interface WeightsMultiple {
    intercept: number,
    slopes: number[],
}

export interface WeightsToUpdate {
    deltaIntercept: number,
    deltaSlope: number
}

export interface FitSimpleParams {
    iterations?: number,
    learningRate?: number,
    optimizeStartingWeights?: boolean,
    logging?: boolean
}

export interface ScoreParams {
    testValues: number[],
    testLabels: number[]
}

export interface OptimizedValuesParams {
    iterations: number[],
    learningRates: number[]
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