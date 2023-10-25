declare namespace Configs {
    /**
     * Benchmark configuration.
     */
    interface IsBenchmarkConfig {
        sandboxCycles: number[];
        cycles: number[];
        rangerIterations: bigint;
        rangerReportInterval: bigint;
        generatorGhostExecutionIterations: number;
        generatorIterations: bigint;
        generatorReportInterval: bigint;
    }

    /**
     * Bitcoin private key finder configuration interface.
     */
    interface IsFinderConfig {
        publicKeyToFind: string | null;
        addressToFind: string | null;
        useCompressedPublicKey: boolean;
        privateKeyGenMode: "FULL_RANDOM" | "ASCENDING" | "DESCENDING";
        privateKeyLowRange: bigint;
        privateKeyHighRange: bigint;
        progressReportInterval: bigint;
    }
}


export default Configs;