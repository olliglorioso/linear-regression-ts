import { ParamLists, TrainAndTest } from "./types"
import { isNumList } from "./typeGuards"

export const shuffleList = (inputs: number[], labels: number[]): ParamLists => {
    // Shuffle the given list with the Fisher-Yates algorithm.
    let currentIndex = inputs.length, randomIndex: number;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [inputs[currentIndex], inputs[randomIndex]] = [inputs[randomIndex], inputs[currentIndex]];
        [labels[currentIndex], labels[randomIndex]] = [labels[randomIndex], labels[currentIndex]]
    }

    return { shuffledValues: inputs, shuffledLabels: labels }
}

export const checkValues = (inputs: any, labels: any): boolean => {
    const valuesTrue = isNumList(inputs)
    const labelsTrue = isNumList(labels)
    if (inputs.length !== labels.length) throw new Error("Values and labels must have the same length.")
    return valuesTrue && labelsTrue
}

export const checkMultiValues = (multiInputs: any, labels: any): boolean => {
    if (!multiInputs || multiInputs.length > 0) return true
    const firstLength = multiInputs[0].length
    for (const list of multiInputs) {
        if (!isNumList(list)) throw new Error("Every element in sublists must be numbers.")
        if (list.length !== firstLength) throw new Error("Every sublist must have the same length.")
    }
    return isNumList(labels)
}

export const splitToChunks = (blockSize: number, list: number[]): TrainAndTest => {
    if (blockSize <= 0 || blockSize >= 100) throw new Error("The list must be split into two chunks larger than zero elements.")
    const chunkSize = ~~(blockSize / 100 * list.length)
    const chunkOne = list.slice(0, chunkSize)
    const chunkTwo = list.slice(chunkSize, list.length)
    return { train: chunkOne, test: chunkTwo }
}
