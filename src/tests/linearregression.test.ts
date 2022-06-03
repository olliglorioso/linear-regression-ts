import { LinearRegression, trainAndTestSets } from "../index"
import fs from "fs"

describe("Test simple linear regression", () => {
    let x = []
    let y = []
    for (let i = 0; i < 200; i++) x.push([ i ])
    for (const i of x) y.push(7.76 * parseInt(i) + 2.22)
    const { trainValues, trainLabels, testLabels, testValues } = trainAndTestSets({ inputs: x, labels: y, ratio: 70 })
    const lr = new LinearRegression({ inputs: trainValues, labels: trainLabels })

    it ("Should return correct slope and intercept.", () => {
        
        const { slopes, intercept, error } = lr.fit({ logging: true, iterations: 500000, learningRate: 0.00001 })
        expect(slopes[0]).toBeCloseTo(7.76, 0)
        expect(intercept).toBeCloseTo(2.22, 0)
    })
    it ("Test if the best iteration & learning rate are correct.", () => {
        const { iteration, learningRate } = lr.optimizeHyperparams({ iterations: [10, 20, 100, 1000, 6000], learningRates: [1, 0.1, 0.001, 0.0001]})
        expect(iteration).toBe(6000)
        expect(learningRate).toBe(0.0001)
    })
    it ("Test that the predicted values are realistic.", () => {
        const predicted = lr.predict({ inputs: testValues })
        for (const i in predicted) {
            expect(predicted[i]).toBeCloseTo(testLabels[i])
        }
    })
})

// describe("Test multi-variable linear regression", () => {
//     // biking, smoking, heart-disease
//     fetch("https://raw.githubusercontent.com/olliglorioso/datasets/main/heartdata.csv").then(res => {
//         const lines = (res as unknown as string).split("\n")
//         let dataSet = []
//         let labels = []
//         for (const line of lines) {
//             const values = line.trim().split(",")
//             dataSet.push([parseFloat(values[0]), parseFloat(values[1])])
//             labels.push(parseFloat(values[2]))
//         }
//         const lr = new LinearRegression({ inputs: dataSet, labels })
//         const { intercept, slopes, error } = lr.fitMultiple({ learningRate: 0.000001, iterations: 1000000, logging: true })
//         console.info(intercept, slopes, error)
//     })
    
// })