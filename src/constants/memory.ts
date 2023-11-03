/**
 * Interface for a single memory slot.
 */
export interface IsMemorySlot {
    offset: number;
    bytes: number;
    end: number;
}

/**
 * Interface for the memory table.
 */
export interface IsMemoryTable {
    [key: string]: IsMemorySlot
}

/**
 * Memory table used for the WASM module & the generator.
 *
 * See [here](https://github.com/yoratoni/celk#about-the-cache) for more information.
 */
const MEMORY_TABLE: IsMemoryTable = {
    PKG: {
        offset: 0,
        bytes: 32,
        end: 32
    },
    PBL: {
        offset: 32,
        bytes: 65,
        end: 97
    },
    SHA: {
        offset: 97,
        bytes: 32,
        end: 129
    },
    RIP: {
        offset: 130,
        bytes: 20,
        end: 150
    },
    SC1: {
        offset: 154,
        bytes: 32,
        end: 186
    },
    SC2: {
        offset: 154,
        bytes: 32,
        end: 186
    },
    FINAL_RIPEMD_HASH: {
        offset: 129,
        bytes: 21,
        end: 150
    },
    FINAL_BTC_HASH: {
        offset: 129,
        bytes: 25,
        end: 154
    }
};

/**
 * The checksum, where to read it from, and where to write it to (Uint32).
 */
export const CHECKSUM = {
    readFrom: 150,
    writeTo: 154
};


export default MEMORY_TABLE;