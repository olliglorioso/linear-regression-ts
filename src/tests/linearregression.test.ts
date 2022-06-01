import { LinearRegression } from "../index"

describe("Test simple linear regression", () => {
    let x = []
    let y = []
    for (let i = 0; i < 100; i++) x.push(i)
    for (let i = 2; i < 102; i++) y.push(i)
    const lr = new LinearRegression(x, y)
    it ("Should return correct slope and intercept.", () => {
        const { slope, intercept, error } = lr.fitSimple(6000, 0.0001)
        expect(slope).toBeCloseTo(1)
        expect(intercept).toBeCloseTo(2)
        expect(error).toBeCloseTo(0)
        lr.simpleModelSet(slope, intercept)
    })
    it ("Test if the best iteration & learning rate are correct.", () => {
        const { iteration, learningRate } = lr.optimizedValues([10, 20, 100, 1000, 6000], [1, 0.1, 0.001, 0.0001])
        expect(iteration).toBe(6000)
        expect(learningRate).toBe(0.0001)
    })
    it ("Test that the predicted values are realistic.", () => {
        const predicted = lr.simpleModelPredict(x)
        let a = 2
        for (const i of predicted) {
            expect(i).toBeCloseTo(a)
            a++
        }
    })
})