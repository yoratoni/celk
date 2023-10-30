/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/** src/assembly/src/crypto/SHA256/sha256 */
export declare const sha256: {
  /** @type `(~lib/array/Array<u8>) => ~lib/array/Array<u8>` */
  get value(): __Internref13
};
/** ~lib/function/Function<%28~lib/array/Array<u8>%29=>~lib/array/Array<u8>> */
declare class __Internref13 extends Number {
  private __nominal13: symbol;
  private __nominal0: symbol;
}
