/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG = {
    // Cycles for the sandbox
    sandboxCycles: [1000, 10_000, 100_000, 1_000_000],

    // Cycles for algorithms & encoders benchmarks
    // cycles: [8, 512, 4096, 65_536],
    cycles: [1],

    // Ranger
    rangerIterations: 1_000_000n,               // Executions
    rangerReportInterval: 200_000n,             // Report interval

    // Generator
    generatorGhostExecutionIterations: 0,       // Ghost executions to warm up the engine
    generatorIterations: 800n,                  // Real executions
    generatorReportInterval: 160n,              // Report interval
};


export default BENCHMARK_CONFIG;