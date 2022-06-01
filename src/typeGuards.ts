export const isNumList = (values: any): values is number[] => {
    if (!values.every(value => typeof value === "number")) {
        throw new Error("Every element in the list must be a number.")
    }
    return true
}
