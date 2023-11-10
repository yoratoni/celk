import { memory, sha256__execute } from "assembly/build";
import Cache from "helpers/cache";


const cache = Cache.fromArrayBuffer(memory.buffer);

const input = "0x02B23790A42BE63E1B";
if ((input.length - 2) % 2 !== 0) throw new Error("Invalid input length");
const inputBytesLength = (input.length - 2) / 2;

cache.writeHex(input);
console.log(" Input:", Buffer.from(cache.subarray(0, inputBytesLength)).toString("hex"));

sha256__execute(0n, BigInt(inputBytesLength), 1000n);
console.log("Output:", Buffer.from(cache.subarray(1000, 1032)).toString("hex"));