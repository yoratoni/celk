import Configs from "types/configs";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG: Configs.IsFinderConfig = {
    // The public key to find the private key for if available (supports 0x prefix).
    publicKeyToFind: null,

    // The address to find the private key for.
    addressToFind: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so",

    // Use compressed public key ("COMPRESSED") or uncompressed ("UNCOMPRESSED").
    // BTC addresses generally uses compressed keys.
    // Default: true
    publicKeyGenMode: "COMPRESSED",

    // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    // Default: FULL_RANDOM
    privateKeyGenMode: "FULL_RANDOM",

    // The private key low range (inclusive).
    // Default: 1n
    privateKeyLowRange: 2n ** 65n,

    // The private key high range (inclusive).
    // Default: 2n ** 256n - 0x14551231950B75FC4402DA1732FC9BEBFn
    privateKeyHighRange: 2n ** 66n - 1n,

    // The progress report interval (in number of iterations).
    // Default: 1024n
    progressReportInterval: 7500n
};


export default FINDER_CONFIG;