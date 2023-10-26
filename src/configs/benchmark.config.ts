import Configs from "types/configs";


/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG: Configs.IsBenchmarkConfig = {
    // Cycles for the sandbox
    sandboxCycles: [1000, 10_000, 100_000, 1_000_000],

    // Cycles for algorithms & encoders benchmarks
    cycles: [1, 16, 128, 1024],
    // cycles: [1],

    // Ranger
    rangerIterations: 1_000_000n,               // Executions
    rangerReportInterval: 200_000n,             // Report interval

    // Generator
    generatorGhostExecutionIterations: 1024,     // Ghost executions to warm up the engine
};


export default BENCHMARK_CONFIG;