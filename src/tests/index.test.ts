import { memory , test } from "assembly/build";


const buf = new Uint8Array(memory.buffer);
buf[0] = 0x01;

let val = "";
for (let i = 1; i <= 16; i++) {
    val += test(i).toString(2).padStart(32, "0") + "\n";
}

console.log(val);