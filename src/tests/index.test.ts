import { memory, sha256__execute, sha256__init } from "assembly/build";


const cache = new Uint8Array(memory.buffer);
cache[0] = 0x01;

console.log(" Input:", Buffer.from(cache.subarray(0, 32)).toString("hex"));

sha256__init(0n, 0n, 32n);
sha256__execute();

console.log("Output:", Buffer.from(cache.subarray(32, 64)).toString("hex"));