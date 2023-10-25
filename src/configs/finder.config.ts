import Configs from "types/configs";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG: Configs.IsFinderConfig = {
    // The public key to find the private key for if available.
    publicKeyToFind: null,

    // The address to find the private key for (if publicKeyToFind is null).
    addressToFind: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so",

    // Use compressed public key (true) or uncompressed (false).
    // BTC addresses generally uses compressed keys.
    useCompressedPublicKey: true,

    // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    privateKeyGenMode: "FULL_RANDOM",

    // The private key low range (inclusive).
    privateKeyLowRange: 1n,

    // The private key high range (inclusive).
    privateKeyHighRange: 2n ** 256n - 0x14551231950B75FC4402DA1732FC9BEBFn,

    // The progress report interval (in number of iterations).
    progressReportInterval: 1024n,
};


export default FINDER_CONFIG;