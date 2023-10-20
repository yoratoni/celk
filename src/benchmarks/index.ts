// Main entry point for the benchmarking of the different encoders / algorithms.

import benchmark_crypto from "benchmarks/crypto";
import logger from "utils/logger";


logger.info("Starting benchmarking of the encoders / algorithms.");
console.log("");

benchmark_crypto();