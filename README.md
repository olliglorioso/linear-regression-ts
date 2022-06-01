# linear-regression-ts
Predict future values with a simple but powerful linear regression algorithm, with JavaScript and TypeScript!
Use this package if you want to make your code greener and need to predict values with linear regression. Instead of
using Tensorflow.js and getting all kind of *useless* and *heavy* functions and classes, you only get what you need with linear-regression-ts!

### Features
- Generate train and test data.
- Train a linear regression model.
- Evaluate the performance of the model.
- Predict unknown values.
- Automate the optimization of hyperparameters, also learning rate and the amount of iterations.
- Set custom intercept and slope, and use them to make the predictions.


### Quick start
```
npm install linear-regression-ts
```

```typescript
import { LinearRegression, trainAndTestSets } from 'linear-regression-ts'

// Create train and test sets.
const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const { trainValues, testValues, trainLabels, testLabels } = trainAndTestSets(x, y)  

// Initialize the untrained model.
const lr = new LinearRegression(trainValues, trainLabels) 

// Train the model.
const iterations = 1000
const learningRate = 0.00001
const { intercept, slope, error } = lr.fitSimple(iterations, learningRate) 

// Test the model, and get the evaluation of its performance.
const { mse, mae } = lr.scores(testValues, testLabels) 

// Optimize the hyperparameters.
const iterationAlternatives = [0, 1, 2, 5, 10, 20, 100, 1000, 5000, 10000]
const learningRateAlternatives = [0.00001, 0.0001, 0.001, 0.01, 0.1, 1]
const { iteration, learningRate } = lr.optimizedValues(iterationAlternatives, learningRateAlternatives) 

// Predict unknown values.
const iDontKnowTheLabels = [23, 43, 98, 82, 8, 76, 1, 2, 3, 4] 
const predictions = lr.predict(iDontKnowTheLabels)

// Set custom intercept and slope.
lr.simpleModelSet(2, 2)

```
