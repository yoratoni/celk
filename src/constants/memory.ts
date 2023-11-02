/**
 * Interface for the memory table.
 */
interface IsMemoryTable {
    [key: string]: {
        start: number;
        end: number;
        len: number;
    }
}

/**
 * Memory table used for the WASM module & the generator.
 *
 * See [here](https://github.com/yoratoni/celk#about-the-cache) for more information.
 */
const MEMORY_TABLE: IsMemoryTable = {
    PKG: {
        start: 0,
        end: 32,
        len: 32
    },
    PBL: {
        start: 32,
        end: 97,
        len: 65
    },
    SHA: {
        start: 97,
        end: 129,
        len: 32
    },
    RIP: {
        start: 130,
        end: 150,
        len: 20
    },
    SC1: {
        start: 154,
        end: 186,
        len: 32
    },
    SC2: {
        start: 154,
        end: 182,
        len: 32
    },
    FINAL_RIPEMD_HASH: {
        start: 129,
        end: 150,
        len: 21
    },
    FINAL_BTC_HASH: {
        start: 129,
        end: 154,
        len: 25
    }
};

/**
 * The checksum, where to read it from, and where to write it to (Uint32).
 */
export const CHECKSUM = {
    read: 150,
    write: 154
};


export default MEMORY_TABLE;