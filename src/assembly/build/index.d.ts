/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * src/assembly/src/crypto/randomizer/randomFill
 * @param offset `usize`
 * @param length `usize`
 */
export declare function randomFill(offset: number, length: number): void;
