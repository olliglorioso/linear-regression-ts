"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitToChunks = exports.checkValues = exports.shuffleList = void 0;
const typeGuards_1 = require("./typeGuards");
const shuffleList = (inputs, labels) => {
    // Shuffle the given list with the Fisher-Yates algorithm.
    let currentIndex = inputs.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [inputs[currentIndex], inputs[randomIndex]] = [inputs[randomIndex], inputs[currentIndex]];
        [labels[currentIndex], labels[randomIndex]] = [labels[randomIndex], labels[currentIndex]];
    }
    return { shuffledValues: inputs, shuffledLabels: labels };
};
exports.shuffleList = shuffleList;
const checkValues = (inputs, labels) => {
    const valuesTrue = (0, typeGuards_1.isNumList)(inputs);
    const labelsTrue = (0, typeGuards_1.isNumList)(labels);
    if (inputs.length !== labels.length)
        throw new Error("Values and labels must have the same length.");
    return valuesTrue && labelsTrue;
};
exports.checkValues = checkValues;
const splitToChunks = (blockSize, list) => {
    if (blockSize <= 0 || blockSize >= 100)
        throw new Error("The list must be split into two chunks larger than zero elements.");
    const chunkSize = ~~(blockSize / 100 * list.length);
    const chunkOne = list.slice(0, chunkSize);
    const chunkTwo = list.slice(chunkSize, list.length);
    return { train: chunkOne, test: chunkTwo };
};
exports.splitToChunks = splitToChunks;
//# sourceMappingURL=utils.js.map