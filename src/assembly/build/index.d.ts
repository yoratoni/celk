/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * src/assembly/src/crypto/randomizer/randomFillUint8Array
 * @param arr `~lib/typedarray/Uint8Array`
 */
export declare function randomFillUint8Array(arr: Uint8Array): void;
/**
 * src/assembly/src/crypto/randomizer/randomFillUint16Array
 * @param arr `~lib/typedarray/Uint16Array`
 */
export declare function randomFillUint16Array(arr: Uint16Array): void;
/**
 * src/assembly/src/crypto/randomizer/randomFillUint32Array
 * @param arr `~lib/typedarray/Uint32Array`
 */
export declare function randomFillUint32Array(arr: Uint32Array): void;
/**
 * src/assembly/src/crypto/randomizer/randomFillUint64Array
 * @param arr `~lib/typedarray/Uint64Array`
 */
export declare function randomFillUint64Array(arr: BigUint64Array): void;
