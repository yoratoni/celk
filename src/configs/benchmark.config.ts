/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG = {
    // Cycles for algorithms & encoders benchmarks
    cycles: [10, 100, 1000],

    // The number of iterations for the tiny benchmark generator used for the finder initialization
    tinyBenchmarkGeneratorIterations: 64,

    // Ranger
    rangerIterations: 1_000_000n,               // Executions
    rangerReportInterval: 200_000n,             // Report interval

    // Generator
    generatorGhostExecutionIterations: 32,      // Ghost executions to warm up the engine
    generatorIterations: 800n,                  // Real executions
    generatorReportInterval: 160n,              // Report interval

    // Reports & display
    percentagesPrecision: 2,                    // Percentages precision
    stuffPerSecondPadding: 11                   // Stuff per second padding
};


export default BENCHMARK_CONFIG;