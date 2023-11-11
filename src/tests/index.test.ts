import { AS__sha256__execute, memory } from "assembly/build";
import Cache from "helpers/cache";


const cache = Cache.fromArrayBuffer(memory.buffer);

const input = "0x01";

if ((input.length - 2) % 2 !== 0) throw new Error("Invalid input length");
const inputBytesLength = (input.length - 2) / 2;

cache.writeHex(input);
AS__sha256__execute(0n, BigInt(inputBytesLength), 1000n);
console.log("Output 0:", Buffer.from(cache.subarray(1000, 1032)).toString("hex"));

cache.writeHex("0x01");
AS__sha256__execute(0n, BigInt(inputBytesLength), 1000n);
console.log("Output 1:", Buffer.from(cache.subarray(1000, 1032)).toString("hex"));