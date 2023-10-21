/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG = {
    cycles: [
        10,
        100,
        1000
    ],
    rangerIterations: 5_000_000n,
    progressReportInterval: 1_000_000n,
    percentagesPrecision: 2,
    stuffPerSecondPadding: 12
};


export default BENCHMARK_CONFIG;