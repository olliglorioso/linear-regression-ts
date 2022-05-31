import { simpleModel } from "./types";

export class LinearRegression {
    values: number[]
    labels: number[]
    intercept: number
    slope: number

    constructor(values: number[], labels: number[]) {
        this.values = values;
        this.labels = labels;
        this.intercept = 0
        this.slope = 0
    }

    /**
     * 
     * @param iterations (default 1000)
     * @param learningRate (default 0.01)
     * @param maxError: If a single cost is over this threshold, ignore the corresponding value from calculations.
     * @description Give iterations and learning rate as a parameter, get the intercept and the slope back. 
     * @returns intercept, slope, error
     */

    simpleModelGenerate(iterations: number = 1000, learningRate: number = 0.01, maxError?: number): simpleModel {
        let bestSlope = 0
        let bestIntercept = 0
        let slope = 0
        let intercept = 0
        let minError: number

        for (let iterationNumber = 1; iterationNumber <= iterations; iterationNumber++) {
            const { values, labels } = this
            let errors = []
            let error = 0
            let errorIntercept = 0
            let errorSlope = 0

            for (const a in values) {
                const predicted = intercept * values[a] + slope 
                error = error + (labels[a] - predicted)**2 // Mean squared error
                for (const b in values) { // Calcul
                    const pdSlope = (-2) * (labels[b] - (intercept * values[b] + slope))
                    const pdIntercept = (-2 * values[b]) * (labels[b] - (intercept * values[b] + slope))
                    errorIntercept = errorIntercept + pdIntercept
                    errorSlope = errorSlope + pdSlope
                }
                intercept = intercept - learningRate * errorIntercept
                slope = slope - learningRate * errorSlope

                if (errors.length === 0 || error < minError) {
                    minError = error
                    bestSlope = slope
                    bestIntercept = intercept
                }
                errors.push(error)
            }
            
            
            
        }
        return { intercept: bestIntercept, slope: bestSlope, error: minError }
    }

    /**
     * 
     * @param slope
     * @param intercept
     * @description Set previously generated slope & intercept, or custom values.
     */

    simpleModelSet(slope: number, intercept: number) {
        this.slope = slope
        this.intercept = intercept
    }

    /**
     * 
     * @param values
     * @description Give values, and return predicted labels as a generator.
     * @returns labels
     */

    * simpleModelPredict(values: number[]): Generator {
        for (const v of values) {
            yield this.intercept * v + this.slope
        }
    }
}