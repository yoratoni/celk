import Cache from "helpers/cache";
import PKG_ENGINE from "lib/crypto/generators/PKG";


const pkg = new PKG_ENGINE("DESCENDING", 32, 0n, 2n ** 256n - 1n);

const cache = Cache.alloc(32);
const slot = {
    readFrom: { offset: -1, bytes: -1, end: -1 },
    writeTo: { offset: 0, bytes: 32, end: 32 },
};

const test = pkg.execute(cache, slot);

console.log("0x" + cache.toString("hex"));
console.log(test.toString());