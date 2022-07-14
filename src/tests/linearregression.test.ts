import { LinearRegression, trainAndTestSets } from "../index"

describe("Test simple linear regression", () => {
    let x: number[][] = []
    let y: number[] = []
    for (let i = 0; i < 200; i++) x.push([ i ])
    for (const i of x) y.push(7.76 * i[0] + 2.22)
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

// Works only with Node.js >17.5.0. Test instead of describe, since it supports asynchronous tests.
test("Test multi-variable linear regression", async () => {
    // biking, smoking, heart-disease
    const url = "https://raw.githubusercontent.com/olliglorioso/datasets/main/heartdata.csv"
    const res = await fetch(url)
    const data = await res.text()
    const lines = (data as unknown as string).split("\n")
    let dataSet: number[][] = []
    let labels: number[] = []
    for (const line of lines) {
        const values = line.trim().split(",")
        if (values.length === 3) {
            const biking = parseFloat(values[0])
            const smoking = parseFloat(values[1])
            const heart_disease = parseFloat(values[2])
            dataSet.push([biking, smoking])
            labels.push(heart_disease)
        }
        
    }
    const lr = new LinearRegression({ inputs: dataSet, labels })
    const { intercept, slopes, error } = lr.fit({ learningRate: 0.0001, iterations: 15000, logging: true })
    console.info(intercept, slopes, error)
    expect(error).toBeLessThan(10)
})