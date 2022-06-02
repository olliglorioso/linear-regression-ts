import { ClassProps, OptimizedValues, Scores, SimpleModel, TrainAndTest, TrainAndTestForPrediction } from "./types"
import { shuffleList, checkValues, splitToChunks, checkMultiValues } from "./utils"


/**
* @param input The input values.
* @param labels The output values.
* @param ratio How many % of the data is for training.
* @description Returns randomly selected train- & test-inputs for use.
* @returns trainValues, testValues, trainLabels, testLabels
*/
export const trainAndTestSets = (inputs: number[], labels: number[], ratio: number): TrainAndTestForPrediction => {
   const { shuffledValues, shuffledLabels } = shuffleList(inputs, labels)
   const { train: trainValues, test: testValues } = splitToChunks(ratio, shuffledValues)
   const { train: trainLabels, test: testLabels } = splitToChunks(ratio, shuffledLabels)
   return { trainValues, testValues, trainLabels, testLabels }
}

export class LinearRegression {
    inputs: number[]
    labels: number[]
    intercept: number
    slope: number
    multiIntercept: number
    multiSlopes: number[]
    multiInputs: number[][]

    constructor({ inputs, labels }: ClassProps) {
        if (inputs) {
            checkValues(inputs, labels)
            this.intercept = 0
            this.slope = 0
            this.inputs = inputs;
        }

        this.labels = labels
    }

    #updateWeights(slope: number, intercept: number) {
        const { inputs, labels } = this
        const n = inputs.length
        let deltaIntercept = 0
        let deltaSlope = 0
        for (let i = 0; i < n; i++) {
            const x = inputs[i]
            const real = labels[i]
            const predicted = slope * x + intercept
            const err = predicted - real
            deltaIntercept += err
            deltaSlope += err * x
        }
        return { deltaIntercept: (2 / n) * deltaIntercept, deltaSlope: (2 / n) * deltaSlope }
    }

    #meanSquaredError(slope: number, intercept: number) {
        const { inputs, labels } = this
        const n = labels.length

        const mse = (1 / n) * inputs.reduce((acc, curr, currIdx) => {
            const predicted = slope * curr + intercept
            const error = (predicted - labels[currIdx]) ** 2
            return acc + error
        })

        return mse
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
    fitSimple(iterations: number = 1000, learningRate: number = 0.001, maxError: number = 0, setParams: boolean = true): SimpleModel {
        let bestSlope = 0
        let bestIntercept = 0
        let minError = 0

        let slope = this.slope
        let intercept = this.intercept
        let errors = []
        for (let iteration = 1; iteration <= iterations; iteration++) {
            const { deltaIntercept, deltaSlope } = this.#updateWeights(slope, intercept)

            const iterationError = this.#meanSquaredError(slope, intercept) // Calculate the total MSE.
            slope -= learningRate * deltaSlope
            intercept -= learningRate * deltaIntercept
            
            if (iteration === 1 || iterationError < minError) {
                minError = iterationError
                bestIntercept = intercept
                bestSlope = slope
            }
        }
        
        if (setParams) this.intercept = bestIntercept, this.slope = bestSlope
        return { intercept: bestIntercept, slope: bestSlope, error: minError }
    }

    /**
     * 
     * @param testValues Calculate the predictions based on these inputs.
     * @param testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model. 
     * @returns {Object} { mse: number, mae: numer }
     */
    scores(testValues: number[], testLabels: number[]): Scores {
        const predictedValues = this.simpleModelPredict(testValues)
        const n = testValues.length
        let mse = 0
        let mae = 0
        let i = 0

        for (const predicted of predictedValues) { 
            const real = testLabels[i]

            const mseErr = (real - predicted) ** 2
            mse += mseErr

            const maeErr = Math.abs(real - predicted)
            mae += maeErr
            i++
        }

        return { mse: (1 / n) * mse, mae: (1 / n) * mae }
    }

    
    optimizedValues(iterations: number[], learningRates: number[]): OptimizedValues  {
        let returned = { iteration: 0, learningRate: 0 }
        let bestError = NaN
        for (const it of iterations) {
            for (const lr of learningRates) {
                const { error } = this.fitSimple(it, lr)
                if (isNaN(bestError) || error < bestError) {
                    returned = { iteration: it, learningRate: lr }
                }
            }
        }
        return returned
    }

    /**
     * 
     * @param slope Slope.
     * @param intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    simpleModelSet(slope: number, intercept: number) {
        this.slope = slope
        this.intercept = intercept
    }

    /**
     * 
     * @param inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    * simpleModelPredict(inputs: number[]): Generator<number> {
        for (const v of inputs) {
            yield this.slope * v + this.intercept
        }
    }
}