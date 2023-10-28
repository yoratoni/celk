import Cache from "helpers/cache";


const cache = Cache.alloc(10);
cache.write("Hello World");

console.log(cache.toString());