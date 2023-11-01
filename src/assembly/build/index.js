async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    randomFillUint8Array(arr) {
      // src/assembly/src/crypto/randomizer/randomFillUint8Array(~lib/typedarray/Uint8Array) => void
      arr = __lowerTypedArray(Uint8Array, 4, 0, arr) || __notnull();
      exports.randomFillUint8Array(arr);
    },
    randomFillUint16Array(arr) {
      // src/assembly/src/crypto/randomizer/randomFillUint16Array(~lib/typedarray/Uint16Array) => void
      arr = __lowerTypedArray(Uint16Array, 5, 1, arr) || __notnull();
      exports.randomFillUint16Array(arr);
    },
    randomFillUint32Array(arr) {
      // src/assembly/src/crypto/randomizer/randomFillUint32Array(~lib/typedarray/Uint32Array) => void
      arr = __lowerTypedArray(Uint32Array, 6, 2, arr) || __notnull();
      exports.randomFillUint32Array(arr);
    },
    randomFillUint64Array(arr) {
      // src/assembly/src/crypto/randomizer/randomFillUint64Array(~lib/typedarray/Uint64Array) => void
      arr = __lowerTypedArray(BigUint64Array, 7, 3, arr) || __notnull();
      exports.randomFillUint64Array(arr);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  __new,
  __pin,
  __unpin,
  __collect,
  __rtti_base,
  randomFillUint8Array,
  randomFillUint16Array,
  randomFillUint32Array,
  randomFillUint64Array,
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("index.wasm", import.meta.url));
