import { bigIntPow } from "utils/maths";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG = {
    // Address generation
    addressToFind: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so",           // The address to find.
    compressedPublicKey: true,                                     // Whether to use the compressed public key or not.

    // Private key generation
    privateKeyGenMode: "FULL_RANDOM",                              // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    privateKeyLowRange: bigIntPow(2n, 65n),                        // The private key low range (inclusive).
    privateKeyHighRange: bigIntPow(2n, 66n) - 1n,                  // The private key high range (inclusive).

    // Finder
    tinyBenchmarkGeneratorIterations: 64,                          // The number of iterations for the tiny benchmark generator.
    progressReportInterval: 256n,                                  // The progress report interval (in iterations).
    percentagesPrecision: 2                                        // The percentages precision (in decimal places).
};


export default FINDER_CONFIG;