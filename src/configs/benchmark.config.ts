/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG = {
    // Cycles for main benchmark
    cycles: [
        10,
        100,
        1000
    ],

    // Iterations & report per benchmark
    generatorIterations: 8_192n,
    generatorReportInterval: 128n,
    rangerIterations: 5_000_000n,
    rangerReportInterval: 1_000_000n,

    // Display
    percentagesPrecision: 2,
    stuffPerSecondPadding: 12
};


export default BENCHMARK_CONFIG;