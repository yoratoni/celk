async function instantiate(module, imports = {}) {
    const adaptedImports = {
        env: Object.assign(Object.create(globalThis), imports.env || {}, {
            abort(message, fileName, lineNumber, columnNumber) {
                // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
                message = __liftString(message >>> 0)
                fileName = __liftString(fileName >>> 0)
                lineNumber = lineNumber >>> 0
                columnNumber = columnNumber >>> 0;
                (() => {
                    // @external.js
                    throw Error(`${ message } in ${ fileName }:${ lineNumber }:${ columnNumber }`)
                })()
            },
        }),
    }
    const { exports } = await WebAssembly.instantiate(module, adaptedImports)
    const memory = exports.memory || imports.env.memory
    const adaptedExports = Object.setPrototypeOf({
        sha256: {
            // src/assembly/src/crypto/SHA256/sha256: (~lib/array/Array<u8>) => ~lib/array/Array<u8>
            valueOf() { return this.value },
            get value() {
                return __liftInternref(exports.sha256.value >>> 0)
            }
        },
    }, exports)
    function __liftString(pointer) {
        if (!pointer) return null
        const
            end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
            memoryU16 = new Uint16Array(memory.buffer)
        let
            start = pointer >>> 1,
            string = ""
        while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024))
        return string + String.fromCharCode(...memoryU16.subarray(start, end))
    }
    class Internref extends Number { }
    const registry = new FinalizationRegistry(__release)
    function __liftInternref(pointer) {
        if (!pointer) return null
        const sentinel = new Internref(__retain(pointer))
        registry.register(sentinel, pointer)
        return sentinel
    }
    const refcounts = new Map()
    function __retain(pointer) {
        if (pointer) {
            const refcount = refcounts.get(pointer)
            if (refcount) refcounts.set(pointer, refcount + 1)
            else refcounts.set(exports.__pin(pointer), 1)
        }
        return pointer
    }
    function __release(pointer) {
        if (pointer) {
            const refcount = refcounts.get(pointer)
            if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer)
            else if (refcount) refcounts.set(pointer, refcount - 1)
            else throw Error(`invalid refcount '${ refcount }' for reference '${ pointer }'`)
        }
    }
    return adaptedExports
}
export const {
    memory,
    __new,
    __pin,
    __unpin,
    __collect,
    __rtti_base,
    sha256,
} = await (async url => instantiate(
    await (async () => {
        try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)) }
        catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)) }
    })(), {
}
))(new URL("index.wasm", import.meta.url))
