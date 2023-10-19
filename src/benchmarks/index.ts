// Main entry point for the benchmarking of the different algorithms.

import benchmark_secp256k1 from "benchmarks/secp256k1";
import benchmark_sha256 from "benchmarks/sha256";
import logger from "utils/logger";


logger.info("Starting benchmarking of the algorithms.");
console.log("");

benchmark_secp256k1(128);
console.log("");
benchmark_sha256(65536);
console.log("");