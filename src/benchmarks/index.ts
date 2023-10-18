// Main entry point for the benchmarking of the different algorithms.

import benchmark_sha256 from "benchmarks/sha256";
import logger from "utils/logger";


logger.info("Starting benchmarking of the algorithms.");
console.log("");

benchmark_sha256(131072);