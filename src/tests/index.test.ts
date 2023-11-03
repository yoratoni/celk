import PKG_ENGINE from "lib/crypto/generators/PKG";


const pkg = new PKG_ENGINE("FULL_RANDOM", 0n, 2n ** 256n - 1n);

const test = pkg.execute();

console.log(test.dec.toLocaleString("en-US"));
console.log(test.arr.toString("hex"));