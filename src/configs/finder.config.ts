import { bigIntPow } from "utils/conversions";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG = {
    addressToFind: "1L2GM8eE7mJWLdo3HZS6su1832NX2txaac",
    privateKeyRange: {
        low: bigIntPow(2n, 22n),
        high: bigIntPow(2n, 23n) - 1n
    },

    tinyBenchmarkGeneratorIterations: 32,
    progressReportInterval: 1000,
    percentagesPrecision: 2
};


export default FINDER_CONFIG;