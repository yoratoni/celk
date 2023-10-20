// Main entry point for the benchmarking of the different algorithms.

import benchmark_base58 from "benchmarks/base58";
import benchmark_ripemd160 from "benchmarks/ripemd160";
import benchmark_secp256k1 from "benchmarks/secp256k1";
import benchmark_sha256 from "benchmarks/sha256";
import logger from "utils/logger";


logger.info("Starting benchmarking of the algorithms.");
console.log("");

benchmark_base58(65536);
console.log("");
benchmark_ripemd160(65536);
console.log("");
benchmark_secp256k1(128);
console.log("");
benchmark_sha256(65536);
console.log("");