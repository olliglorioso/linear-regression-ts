"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitToChunksLabels = exports.splitToChunks = exports.isNumList = exports.checkMultiValues = exports.isSingleVariable = exports.shuffleList = void 0;
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
const isSingleVariable = (inputs, labels) => {
    let type = true;
    if (inputs && labels && (inputs.length !== labels.length))
        throw new Error("Values and labels must have the same length.");
    if (inputs.length === 0 || labels.length === 0)
        throw new Error("Values and labels must have at least one element.");
    if (inputs[0] instanceof Array) {
        type = false;
        const firstLength = inputs[0].length;
        if (firstLength === 1)
            return true;
        for (const list of inputs) {
            if (!(0, exports.isNumList)(list))
                throw new Error("Every element in sublists must be numbers.");
            if (list.length !== firstLength)
                throw new Error("Every sublist must have the same length.");
        }
        return false;
    }
    else {
        throw new Error("Every element in inputs-list must be a list itself.");
    }
};
exports.isSingleVariable = isSingleVariable;
const checkMultiValues = (multiInputs, labels) => {
    if (!multiInputs || multiInputs.length > 0)
        return true;
    return (0, exports.isNumList)(labels);
};
exports.checkMultiValues = checkMultiValues;
const isNumList = (values) => {
    if (!values.every(value => typeof value === "number")) {
        throw new Error("Every element in the list must be a number.");
    }
    return true;
};
exports.isNumList = isNumList;
const splitToChunks = (blockSize, list) => {
    if (blockSize <= 0 || blockSize >= 100)
        throw new Error("The list must be split into two chunks larger than zero elements.");
    const chunkSize = ~~(blockSize / 100 * list.length);
    const chunkOne = list.slice(0, chunkSize);
    const chunkTwo = list.slice(chunkSize, list.length);
    return { train: chunkOne, test: chunkTwo };
};
exports.splitToChunks = splitToChunks;
const splitToChunksLabels = (blockSize, list) => {
    if (blockSize <= 0 || blockSize >= 100)
        throw new Error("The list must be split into two chunks larger than zero elements.");
    const chunkSize = ~~(blockSize / 100 * list.length);
    const chunkOne = list.slice(0, chunkSize);
    const chunkTwo = list.slice(chunkSize, list.length);
    return { train: chunkOne, test: chunkTwo };
};
exports.splitToChunksLabels = splitToChunksLabels;
//# sourceMappingURL=utils.js.map