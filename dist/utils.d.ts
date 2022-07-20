import { ParamLists, TrainAndTest, TrainAndTestLabels } from "./types";
export declare const shuffleList: (inputs: number[][], labels: number[]) => ParamLists;
export declare const isSingleVariable: (inputs: any, labels: any) => boolean;
export declare const checkMultiValues: (multiInputs: any, labels: any) => boolean;
export declare const isNumList: (values: any) => values is number[];
export declare const splitToChunks: (blockSize: number, list: number[][]) => TrainAndTest;
export declare const splitToChunksLabels: (blockSize: number, list: number[]) => TrainAndTestLabels;
