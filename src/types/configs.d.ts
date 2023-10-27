import General from "types/general";


declare namespace Configs {
    /**
     * Benchmarks configuration interface.
     */
    interface IsBenchmarksConfig {
        iterations: bigint;
        reportInterval: bigint;
        generatorGhostExecutionIterations: number;
    }

    /**
     * Bitcoin private key finder configuration interface.
     */
    interface IsFinderConfig {
        publicKeyToFind: string | null;
        addressToFind: string | null;
        publicKeyGenMode: General.IsPublicKeyGenMode;
        privateKeyGenMode: General.IsPrivateKeyGenMode;
        privateKeyLowRange: bigint;
        privateKeyHighRange: bigint;
        progressReportInterval: bigint;
    }
}


export default Configs;