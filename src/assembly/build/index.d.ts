/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * src/assembly/src/crypto/SHA256/init
 * @param readFromOffset `u64`
 * @param readFromBytes `u64`
 * @param writeToOffset `u64`
 */
export declare function sha256__init(readFromOffset: bigint, readFromBytes: bigint, writeToOffset: bigint): void;
/**
 * src/assembly/src/crypto/SHA256/execute
 */
export declare function sha256__execute(): void;
