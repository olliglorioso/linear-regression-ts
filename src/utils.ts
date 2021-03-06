
import { ParamLists, TrainAndTest, TrainAndTestLabels } from "./types"

export const shuffleList = (inputs: number[][], labels: number[]): ParamLists => {
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

export const isSingleVariable = (inputs: any, labels: any): boolean => {
    let type = true
    if (inputs && labels && (inputs.length !== labels.length)) throw new Error("Values and labels must have the same length.")
    if (inputs.length === 0 || labels.length === 0) throw new Error("Values and labels must have at least one element.")

    if (inputs[0] instanceof Array) {
        type = false
        const firstLength = inputs[0].length
        if (firstLength === 1) return true
        for (const list of inputs) {
            if (!isNumList(list)) throw new Error("Every element in sublists must be numbers.")
            if (list.length !== firstLength) throw new Error("Every sublist must have the same length.")
        }
        return false
    } else {
        throw new Error("Every element in inputs-list must be a list itself.")
    }
}

export const checkMultiValues = (multiInputs: any, labels: any): boolean => {
    if (!multiInputs || multiInputs.length > 0) return true
    return isNumList(labels)
}

export const isNumList = (values: any): values is number[] => {
    if (!values.every(value => typeof value === "number")) {
        throw new Error("Every element in the list must be a number.")
    }
    return true
}


export const splitToChunks = (blockSize: number, list: number[][]): TrainAndTest => {
    if (blockSize <= 0 || blockSize >= 100) throw new Error("The list must be split into two chunks larger than zero elements.")
    const chunkSize = ~~(blockSize / 100 * list.length)
    const chunkOne = list.slice(0, chunkSize)
    const chunkTwo = list.slice(chunkSize, list.length)
    return { train: chunkOne, test: chunkTwo }
}

export const splitToChunksLabels = (blockSize: number, list: number[]): TrainAndTestLabels => {
    if (blockSize <= 0 || blockSize >= 100) throw new Error("The list must be split into two chunks larger than zero elements.")
    const chunkSize = ~~(blockSize / 100 * list.length)
    const chunkOne = list.slice(0, chunkSize)
    const chunkTwo = list.slice(chunkSize, list.length)
    return { train: chunkOne, test: chunkTwo }
} 
