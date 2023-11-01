/**
 * Memory table used for the WASM module & the generator.
 *
 * See [here](https://github.com/yoratoni/celk#about-the-cache) for more information.
 */
export const MEMORY_TABLE: {
    [key: string]: {
        start: number;
        end: number;
        len: number;
    }
} = {
    pkg: {
        start: 0,
        end: 32,
        len: 32
    },
    pbl: {
        start: 32,
        end: 97,
        len: 65
    },
    sha: {
        start: 97,
        end: 129,
        len: 32
    },
    rip: {
        start: 129,
        end: 161,
        len: 32
    },
};