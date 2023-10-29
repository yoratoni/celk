import Cache from "helpers/cache";


// const cache = Cache.alloc(10);
// cache.write("0xF0FF");

// console.log(cache.toString());

const cache = Cache.fromString("0xF0FF");

console.log(cache.toString());