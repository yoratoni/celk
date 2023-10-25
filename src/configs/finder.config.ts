import { bigIntPow } from "helpers/maths";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG = {
    // Address generation
    addressToFind: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so",           // The address to find.
    useCompressedPublicKey: true,                                  // Whether to use the compressed public key or not.

    // Private key generation
    privateKeyGenMode: "FULL_RANDOM",                              // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    privateKeyLowRange: bigIntPow(2n, 65n),                        // The private key low range (inclusive).
    privateKeyHighRange: bigIntPow(2n, 66n) - 1n,                  // The private key high range (inclusive).

    // Finder itself
    progressReportInterval: 55_000n,                                  // The progress report interval (in iterations).
};


export default FINDER_CONFIG;