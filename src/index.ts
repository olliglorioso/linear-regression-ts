import { ClassProps, FitSimpleParams, MultiModel, OptimizedValues, OptimizedValuesParams, ScoreParams, Scores, SimpleModel, TrainAndTestForPrediction, WeightsMultiple, WeightsSimple, WeightsToUpdate, WeightsToUpdateMultiple } from "./types"
import { shuffleList, splitToChunks, checkMultiValues, isSingleVariable } from "./utils"


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
    inputs: any
    labels: number[]
    intercept: number
    slope: number

    constructor({ inputs, labels }: ClassProps) {
        const singleVar = isSingleVariable(inputs, labels)
        this.intercept = 0
        this.slope = singleVar ? 0 : inputs[0].map(_a => 0)
        this.inputs = inputs
        this.labels = labels
    }

    #meanSquaredErrorSimple({ slope , intercept }: WeightsSimple): number {
        const { inputs, labels } = this
        const n = labels.length

        const mse = (1 / n) * inputs.reduce((acc: number, curr: number, currIdx: number): number => {
            const predicted = slope * curr + intercept
            const error = (predicted - labels[currIdx]) ** 2
            return acc + error
        })

        return mse
    }

    #calculateStartingWeightsSimple(): WeightsSimple {
        const { inputs, labels } = this
        let xy = 1
        let x = 0
        let y = 0
        let x2 = 0
        let y2 = 0
        const n = inputs.length
        
        for (let i = 0; i < n; i++) {
            x += inputs[i]
            y += labels[i]
            x2 += inputs[i] ** 2
            y2 += labels[i] ** 2
            xy += inputs[i] * labels[i]
        }

        const slope = (n * xy - x * y) / (n * x2 - x ** 2)
        const intercept = (y * x2 - x * xy) / (n * x2 - x ** 2)
        return { intercept, slope }
    }

    #updateWeights({ slope, intercept }: WeightsSimple): WeightsToUpdate {
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

    #meanSquaredErrorMultiple({ slopes, intercept }: WeightsMultiple): number {
        const { inputs, labels } = this
        const n = labels.length
        let error = 0
        for (const a in inputs) {
            let predicted = 0
            for (const b in inputs[a]) {
                predicted += slopes[b] * inputs[a][b] + intercept
            }
            error += (labels[a] - predicted) ** 2
        }
        return (1 / (2 * n)) * error
    }

    #updateWeightsMultiple({ slopes, intercept }: WeightsMultiple): WeightsToUpdateMultiple {
        const { inputs, labels } = this
        const n = inputs.length
        let deltaIntercept = 0
        let deltaSlopes = inputs[0].map(a => 0)
        for (const a in inputs) {
            let totalPredicted = intercept

            for (const b in inputs[a]) {
                const x = inputs[a][b]
                const predicted = slopes[b] * x
                totalPredicted += predicted
            }
            for (const c in inputs[a]) {
                const err = (totalPredicted - labels[a]) * inputs[a][c] * (2 / n)
                deltaSlopes[c] += err
            }
            

            const err = totalPredicted - labels[a]
             
            deltaIntercept += (2 / n) * err
        }
        return { deltaIntercept, deltaSlopes }
    }

    fitMultiple({ iterations= 1000, learningRate = 0.001, optimizeStartingWeights = false, logging = false }: FitSimpleParams): MultiModel {
        let bestSlopes = []
        let bestIntercept = 0
        let minError = NaN
        let { labels, inputs } = this

        let slopes = inputs[0].map(a => 0)
        let intercept = 0

        for (let iteration = 1; iteration <= iterations; iteration++) {
            
            const { deltaIntercept, deltaSlopes } = this.#updateWeightsMultiple({ slopes, intercept })
            intercept -= learningRate * deltaIntercept
            for (const idx in deltaSlopes) {
                slopes[idx] -= learningRate * deltaSlopes[idx]
            }
            
            const iterationError = this.#meanSquaredErrorMultiple({ slopes, intercept }) 
            if (logging && (iteration % (iterations / 10) === 0)) console.info(`iteration ${iteration}, error ${iterationError}, slopes ${slopes}, intercept ${intercept}`)

            if (iteration === 1 || iterationError < minError) {
                bestSlopes = slopes
                bestIntercept = intercept
                minError = iterationError
            }
        }
        return { intercept: bestIntercept, slopes: bestSlopes, error: minError }
    }

    /**
     * 
     * @param fitSimple.iterations? Amount of iterations. (default 1000)
     * @param fitSimple.learningRate? Learning rate. (default 0.01)
     * @param fitSimple.optimizeStartingWeights? Optimize the starting weights, also slope and intercept. If you are using this, you might have to give very small learningRate. (default 0 and 0)
     * @description Give iterations and learning rate as a parameter, get the intercept and the slope back. Single-feature only.
     * @returns {Object} { intercept: number, slope: number, error: number }
     */
    fitSimple({ iterations = 1000, learningRate = 0.001, optimizeStartingWeights = false, logging = false }: FitSimpleParams): SimpleModel {
        let bestSlope = 0
        let bestIntercept = 0
        let minError = 0

        let { intercept, slope } = optimizeStartingWeights ? this.#calculateStartingWeightsSimple() : { intercept: 0, slope: 0 }
       
        let errors = []
        for (let iteration = 1; iteration <= iterations; iteration++) {
            const { deltaIntercept, deltaSlope } = this.#updateWeights({ slope, intercept })

            const iterationError = this.#meanSquaredErrorSimple({ slope, intercept }) // Calculate the total MSE.
            slope -= learningRate * deltaSlope
            intercept -= learningRate * deltaIntercept
            if (logging && (iteration % (iterations / 10) === 0)) console.info(`iteration ${iteration}, error ${iterationError}, slope ${slope}, intercept ${intercept}`)
            if (iteration === 1 || iterationError < minError) {
                minError = iterationError
                bestIntercept = intercept
                bestSlope = slope
            }
        }
        
        return { intercept: bestIntercept, slope: bestSlope, error: minError }
    }

    /**
     * 
     * @param scores.testValues Calculate the predictions based on these inputs.
     * @param scores.testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model. 
     * @returns {Object} { mse: number, mae: numer }
     */
    scores({ testValues, testLabels }: ScoreParams): Scores {
        const predictedValues = this.simpleModelPredict({ inputs: testValues })
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

    /**
     * 
     * @param optimizedHyperparams.iterations The list of iterations/epochs to test.
     * @param optimizedHyperparams.learningRate The list of learning rates to test.
     * @returns {Object} { iteration: number, learningRate: number } Best possible epoch and learning rate combination.
     */
    optimizeHyperparams({ iterations, learningRates }: OptimizedValuesParams): OptimizedValues  {
        let returned = { iteration: 0, learningRate: 0 }
        let bestError = NaN
        const isSingle = isSingleVariable(this.inputs, this.labels)
        for (const it of iterations) {
            for (const learningRate of learningRates) {
                const { error } = isSingle ? this.fitSimple({ learningRate, iterations: it }) : this.fitMultiple({ learningRate, iterations: it })
                if (isNaN(bestError) || error < bestError) {
                    returned = { iteration: it, learningRate }
                }
            }
        }
        return returned
    }

    /**
     * 
     * @param simpleModelSet.slope Slope.
     * @param simpleModelSet.intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    simpleModelSet({ slope, intercept }: WeightsSimple): void {
        this.slope = slope
        this.intercept = intercept
    }

    /**
     * 
     * @param simpleModelPredict.inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    * simpleModelPredict({ inputs }: { inputs: number[]}): Generator<number> {
        for (const v of inputs) {
            yield this.slope * v + this.intercept
        }
    }
}