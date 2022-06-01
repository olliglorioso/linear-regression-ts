"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumList = void 0;
const isNumList = (values) => {
    if (!values.every(value => typeof value === "number")) {
        throw new Error("Every element in the list must be a number.");
    }
    return true;
};
exports.isNumList = isNumList;
//# sourceMappingURL=typeGuards.js.map