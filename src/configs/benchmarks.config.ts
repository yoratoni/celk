import Configs from "types/configs";


/**
 * Benchmarks configuration.
 */
const BENCHMARKS_CONFIG: Configs.IsBenchmarksConfig = {
    // Benchmark iterations & report interval
    iterations: 1_000_000n,
    reportInterval: 200_000n,

    // Generator ghost executions to warm up the engine
    generatorGhostExecutionIterations: 1024
};


export default BENCHMARKS_CONFIG;