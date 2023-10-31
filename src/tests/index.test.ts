import { sha256 } from "assembly/build";


const testArr = new Uint8Array(0);

// for (let i = 0; i < testArr.length; i++) {
//     testArr[i] = i;
// }

const hash = sha256(testArr);


console.log(Buffer.from(hash.buffer).toString("hex"));