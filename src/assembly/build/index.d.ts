/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * src/assembly/src/crypto/SHA256/execute
 * @param readOffset `u64`
 * @param readBytes `u64`
 * @param writeOffset `u64`
 */
export declare function sha256__execute(readOffset: bigint, readBytes: bigint, writeOffset: bigint): void;
