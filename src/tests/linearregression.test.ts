import { LinearRegression, trainAndTestSets } from "../index"

describe("Test simple linear regression", () => {
    let x = []
    let y = []
    for (let i = 0; i < 100; i++) x.push(i)
    for (const i of x) y.push(2 * parseInt(i) + 2)
    const { trainValues, trainLabels, testLabels, testValues } = trainAndTestSets(x, y, 70)
    const lr = new LinearRegression({ inputs: trainValues, labels: trainLabels })

    it ("Should return correct slope and intercept.", () => {
        
        const { slope, intercept } = lr.fitSimple(300000, 0.00001)
        
        expect(slope).toBeCloseTo(2, 0)
        expect(intercept).toBeCloseTo(2, 0)
    })
    it ("Test if the best iteration & learning rate are correct.", () => {
        const { iteration, learningRate } = lr.optimizedValues([10, 20, 100, 1000, 6000], [1, 0.1, 0.001, 0.0001])
        expect(iteration).toBe(6000)
        expect(learningRate).toBe(0.0001)
    })
    it ("Test that the predicted values are realistic.", () => {
        const predicted = lr.simpleModelPredict(testValues)
        for (const i in predicted) {
            expect(predicted[i]).toBeCloseTo(testLabels[i])
        }
    })
})