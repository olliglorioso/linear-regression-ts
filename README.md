# linear-regression-ts

Predict future values with a simple but powerful linear regression algorithm, with JavaScript and TypeScript!
Use this package if you want to make your code greener and need to predict values with linear regression. Instead of
using Tensorflow.js and getting all kind of *useless* and *heavy* functions and classes, you only get what you need with linear-regression-ts!

## Features

- Generate train and test data.
- Train a one-variable & multi-variable linear regression model with gradient descent.
- Evaluate the performance of the model.
- Predict unknown values.
- Automate the optimization of hyperparameters, also learning rate and the amount of iterations.
- Set custom intercept and slope, and use them to make the predictions.
- JSDoc included to help make the use of this library as downright as possible.

## Releases / changelog
[https://github.com/olliglorioso/linear-regression-ts/releases](https://github.com/olliglorioso/linear-regression-ts/releases)

## Quick start

```bash
npm install linear-regression-ts
```

```typescript
import { LinearRegression, trainAndTestSets } from 'linear-regression-ts'

// Create train and test sets. One column for one feature.
const x = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [9, 10], [10, 11]]
const y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const { trainValues, testValues, trainLabels, testLabels } = trainAndTestSets({ x, y, ratio: 0.7 })  

// Initialize the untrained model.
const lr = new LinearRegression({ inputs: trainValues, labels: trainLabels }) 

// Train the model.
const iterations = 1000
const learningRate = 0.00001
const logging = true
const optimizeStartingWeights = true
const { intercept, slopes, error } = lr.fit({ iterations, learningRate, logging, optimizeStartingWeights }) 

// Test the model, and get the evaluation of its performance.
const { mse, mae } = lr.scores({ testValues, testLabels }) 

// Optimize the hyperparameters.
const iterationAlternatives = [0, 1, 2, 5, 10, 20, 100, 1000, 5000, 10000]
const learningRateAlternatives = [0.00001, 0.0001, 0.001, 0.01, 0.1, 1]
const { iteration, learningRate } = lr.optimizeHyperparams({ iterations: iterationAlternatives, learningRates: learningRateAlternatives }) 

// Predict unknown values.
const iDontKnowTheLabels = [23, 43, 98, 82, 8, 76, 1, 2, 3, 4] 
const predictions = lr.predict({ inputs: iDontKnowTheLabels })

// Set custom intercept and slope.
lr.setModel(2, 2)

```


