import { ParamLists, TrainAndTest } from "./types";
export declare const shuffleList: (inputs: number[], labels: number[]) => ParamLists;
export declare const checkValues: (inputs: any, labels: any) => boolean;
export declare const splitToChunks: (blockSize: number, list: number[]) => TrainAndTest;
