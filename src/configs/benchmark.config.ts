/**
 * Benchmark configuration.
 */
const BENCHMARK_CONFIG = {
    // Cycles for algorithms & encoders benchmarks
    cycles: [10, 100, 1000],

    // The number of iterations for the tiny benchmark generator used for the finder initialization
    tinyBenchmarkGeneratorIterations: 64,

    // Iterations & report per benchmark
    rangerIterations: 1_000_000n,
    rangerReportInterval: 200_000n,
    generatorIterations: 1000n,
    generatorReportInterval: 100n,

    // Reports & display
    percentagesPrecision: 2,
    stuffPerSecondPadding: 12
};


export default BENCHMARK_CONFIG;