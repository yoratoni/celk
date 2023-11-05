/**
 * Interface for a single memory slot.
 */
export interface IsMemorySlot {
    readFrom: {
        offset: number;
        bytes: number;
        end: number;
    },
    writeTo: {
        offset: number;
        bytes: number;
        end: number;
    };
}

/**
 * Interface for the memory table.
 */
export interface IsMemoryTable {
    [key: string]: IsMemorySlot;
}

/**
 * Memory table used for the WASM module & the generator.
 *
 * See [here](https://github.com/yoratoni/celk#about-the-cache) for more information.
 */
const MEMORY_TABLE: IsMemoryTable = {
    PKG: {
        readFrom: { offset: -1, bytes: -1, end: -1 },  // Unused
        writeTo: { offset: 0, bytes: 32, end: 32 }
    },
    PBL: {
        readFrom: { offset: 0, bytes: 32, end: 32 },
        writeTo: { offset: 32, bytes: 65, end: 97 }
    },
    SHA: {
        readFrom: { offset: 32, bytes: -1, end: 97 },  // Bytes vary depending if the PBL is compressed or not
        writeTo: { offset: 97, bytes: 32, end: 129 }
    },
    RIP: {
        readFrom: { offset: 97, bytes: 32, end: 129 },
        writeTo: { offset: 130, bytes: 20, end: 150 }
    },
    CHECKSUM: {
        readFrom: { offset: 154, bytes: 4, end: 158 },
        writeTo: { offset: 150, bytes: 4, end: 154 }
    },
    SC1: {
        readFrom: { offset: 129, bytes: 20, end: 150 },
        writeTo: { offset: 154, bytes: 32, end: 186 }
    },
    SC2: {
        readFrom: { offset: 154, bytes: 32, end: 186 },
        writeTo: { offset: 154, bytes: 32, end: 186 }
    },
    FINAL_RIPEMD_HASH: {
        readFrom: { offset: 129, bytes: 21, end: 150 },
        writeTo: { offset: -1, bytes: -1, end: -1 }  // Unused
    },
    FINAL_BTC_HASH: {
        readFrom: { offset: 129, bytes: 25, end: 154 },
        writeTo: { offset: -1, bytes: -1, end: -1 }  // Unused
    }
};

export default MEMORY_TABLE;