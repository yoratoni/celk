import Configs from "types/configs";


/**
 * Benchmarks configuration.
 */
const BENCHMARKS_CONFIG: Configs.IsBenchmarksConfig = {
    // Cycles for the sandbox
    sandboxCycles: [1000, 10_000, 100_000, 1_000_000],

    // Private Key Generator (PKG)
    pkgIterations: 1_000_000n,               // Executions
    pkgReportInterval: 200_000n,             // Report interval

    // Cycles for algorithms & encoders benchmarks
    cycles: [1, 16, 128, 1024],

    // Generator
    generatorGhostExecutionIterations: 1024,     // Ghost executions to warm up the engine
};


export default BENCHMARKS_CONFIG;