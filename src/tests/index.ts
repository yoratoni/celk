const buffer = new Uint8Array(8);


const test = (buf: Uint8Array) => {
    console.log("Internal buffer value", buf.toString());
    console.log("Internal buffer value", buf.toString());
};


console.log("External buffer value", buffer.toString());
test(buffer);
console.log("External buffer value", buffer.toString());