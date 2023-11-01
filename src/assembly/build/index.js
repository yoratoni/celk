async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
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
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    generateRandomUint16Array(length) {
      // src/assembly/src/crypto/randomizer/generateRandomUint16Array(i32) => ~lib/typedarray/Uint16Array
      return __liftTypedArray(Uint16Array, exports.generateRandomUint16Array(length) >>> 0);
    },
    generateRandomUint32Array(length) {
      // src/assembly/src/crypto/randomizer/generateRandomUint32Array(i32) => ~lib/typedarray/Uint32Array
      return __liftTypedArray(Uint32Array, exports.generateRandomUint32Array(length) >>> 0);
    },
    generateRandomUint64Array(length) {
      // src/assembly/src/crypto/randomizer/generateRandomUint64Array(i32) => ~lib/typedarray/Uint64Array
      return __liftTypedArray(BigUint64Array, exports.generateRandomUint64Array(length) >>> 0);
    },
    generateRandomUint8Array(length) {
      // src/assembly/src/crypto/randomizer/generateRandomUint8Array(i32) => ~lib/typedarray/Uint8Array
      return __liftTypedArray(Uint8Array, exports.generateRandomUint8Array(length) >>> 0);
    },
    randomFillUint16Array(array) {
      // src/assembly/src/crypto/randomizer/randomFillUint16Array(~lib/typedarray/Uint16Array) => ~lib/typedarray/Uint16Array
      array = __lowerTypedArray(Uint16Array, 4, 1, array) || __notnull();
      return __liftTypedArray(Uint16Array, exports.randomFillUint16Array(array) >>> 0);
    },
    randomFillUint32Array(array) {
      // src/assembly/src/crypto/randomizer/randomFillUint32Array(~lib/typedarray/Uint32Array) => ~lib/typedarray/Uint32Array
      array = __lowerTypedArray(Uint32Array, 5, 2, array) || __notnull();
      return __liftTypedArray(Uint32Array, exports.randomFillUint32Array(array) >>> 0);
    },
    randomFillUint64Array(array) {
      // src/assembly/src/crypto/randomizer/randomFillUint64Array(~lib/typedarray/Uint64Array) => ~lib/typedarray/Uint64Array
      array = __lowerTypedArray(BigUint64Array, 6, 3, array) || __notnull();
      return __liftTypedArray(BigUint64Array, exports.randomFillUint64Array(array) >>> 0);
    },
    randomFillUint8Array(array) {
      // src/assembly/src/crypto/randomizer/randomFillUint8Array(~lib/typedarray/Uint8Array) => ~lib/typedarray/Uint8Array
      array = __lowerTypedArray(Uint8Array, 7, 0, array) || __notnull();
      return __liftTypedArray(Uint8Array, exports.randomFillUint8Array(array) >>> 0);
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
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
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
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  generateRandomUint16Array,
  generateRandomUint32Array,
  generateRandomUint64Array,
  generateRandomUint8Array,
  randomFillUint16Array,
  randomFillUint32Array,
  randomFillUint64Array,
  randomFillUint8Array,
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("index.wasm", import.meta.url));
