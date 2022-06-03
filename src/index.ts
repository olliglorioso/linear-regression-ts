import { ClassProps, FitParams, Model, OptimizedValues, OptimizedValuesParams, ScoreParams, 
    Scores, TrainAndTestReturn, TrainAndTestParams, Weights, WeightsToUpdate } from "./types"
import { shuffleList, splitToChunks, isSingleVariable, splitToChunksLabels } from "./utils"

/**
* @param TrainAndTestParams.input The input values.
* @param TrainAndTestParams.labels The output values.
* @param TrainAndTestParams.ratio How many % of the data is for training.
* @description Returns randomly selected train- & test-inputs for use.
* @returns trainValues, testValues, trainLabels, testLabels
*/
export const trainAndTestSets = ({ inputs, labels, ratio }: TrainAndTestParams): TrainAndTestReturn => {
   const { shuffledValues, shuffledLabels } = shuffleList(inputs, labels)
   const { train: trainValues, test: testValues } = splitToChunks(ratio, shuffledValues)
   const { train: trainLabels, test: testLabels } = splitToChunksLabels(ratio, shuffledLabels)
   return { trainValues, testValues, trainLabels, testLabels }
}

export class LinearRegression {
    inputs: any
    labels: number[]
    intercept: number
    slopes: number[]

    constructor({ inputs, labels }: ClassProps) {
        this.intercept = 0
        this.slopes = inputs[0].map(_a => 0)
        this.inputs = inputs
        this.labels = labels
    }

    #calculateStartingWeights(): Weights {
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

        const slopes = [(n * xy - x * y) / (n * x2 - x ** 2)]
        const intercept = (y * x2 - x * xy) / (n * x2 - x ** 2)
        return { intercept, slopes }
    }

    #meanSquaredError({ slopes, intercept }: Weights): number {
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

    #updateWeights({ slopes, intercept }: Weights): WeightsToUpdate {
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

    /**
     * 
     * @param FitParams.iterations Amount of iterations. (default 1000)
     * @param FitParams.learningRate Learning rate of iterations. (default 0.0001)
     * @param FitParams.logging Log some output on every {iterations / 10}th iteration. (default false)
     * @param FitParams.optimizeStartingWeights Optimize the starting weights, only for one-variable-regression. (default false)
     * @returns 
     */
    fit({ iterations = 10000, learningRate = 0.0001, logging = false, optimizeStartingWeights = false }: FitParams): Model {
        let bestSlopes = []
        let bestIntercept = 0
        let minError = NaN
        let { inputs, labels } = this
        let slopes = inputs[0].map(_a => 0)
        let intercept = 0

        if (optimizeStartingWeights && isSingleVariable(inputs, labels)) {
            const { slopes: s1, intercept: i1 } = this.#calculateStartingWeights()
            slopes = s1, intercept = i1
        }
        
        for (let iteration = 1; iteration <= iterations; iteration++) {
            const { deltaIntercept, deltaSlopes } = this.#updateWeights({ slopes, intercept })
            intercept -= learningRate * deltaIntercept
            for (const idx in deltaSlopes) {
                slopes[idx] -= learningRate * deltaSlopes[idx]
            }
            const iterationError = this.#meanSquaredError({ slopes, intercept }) 
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
     * @param ScoreParams.testValues Calculate the predictions based on these inputs.
     * @param ScoreParams.testLabels Predefined labels, used in the calculations.
     * @description Calculate mean squared error and mean absolute error for the model. 
     * @returns {Object} { mse: number, mae: numer } Mean squared error and mean absolute error of the model.
     */
    scores({ testValues, testLabels }: ScoreParams): Scores {
        const predictedValues = this.predict({ inputs: testValues })
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
        mse *= (1 / n)
        mae *= (1 / n)
        return { mse, mae }
    }

    /**
     * 
     * @param OptimizedValuesParams.iterations The list of iterations/epochs to test.
     * @param OptimizedValuesParams.learningRate The list of learning rates to test.
     * @returns {Object} { iteration: number, learningRate: number } Best possible epoch and learning rate combination.
     */
    optimizeHyperparams({ iterations, learningRates }: OptimizedValuesParams): OptimizedValues  {
        let returned = { iteration: 0, learningRate: 0 }
        let bestError = NaN
        for (const iteration of iterations) {
            for (const learningRate of learningRates) {
                const { error } = this.fit({ learningRate, iterations: iteration })
                if (isNaN(bestError) || error < bestError) {
                    returned = { iteration, learningRate }
                }
            }
        }
        return returned
    }

    /**
     * 
     * @param Weights.slopes Slope.
     * @param Weights.intercept Intercept.
     * @description Set previously generated slope & intercept to the model, or custom inputs.
     */
    setModel({ slopes, intercept }: Weights): void {
        this.slopes = slopes
        this.intercept = intercept
    }

    /**
     * 
     * @param Inputs.inputs Predict labels for these inputs.
     * @description Give inputs, and return predicted labels as a generator.
     * @returns labels Labels as a generator.
     */
    * predict({ inputs }: { inputs: number[][] }): Generator<number> {
        for (const v of inputs) {
            let sum = this.intercept
            for (const s in this.slopes) {
               sum += this.slopes[s] * v[s] 
            }
            yield sum
        }
    }
}