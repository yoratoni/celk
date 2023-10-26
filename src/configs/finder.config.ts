import Configs from "types/configs";


/**
 * Bitcoin private key finder configuration.
 */
const FINDER_CONFIG: Configs.IsFinderConfig = {
    // The public key to find the private key for if available (supports 0x prefix).
    publicKeyToFind: "0x02e0a8b039282faf6fe0fd769cfbc4b6b4cf8758ba68220eac420e32b91ddfa673",

    // The address to find the private key for.
    addressToFind: "128z5d7nN7PkCuX5qoA4Ys6pmxUYnEy86k",

    // Use compressed public key (true) or uncompressed (false).
    // BTC addresses generally uses compressed keys.
    // Default: true
    useCompressedPublicKey: true,

    // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    // Default: FULL_RANDOM
    privateKeyGenMode: "FULL_RANDOM",

    // The private key low range (inclusive).
    // Default: 1n
    privateKeyLowRange: 2n ** 159n,

    // The private key high range (inclusive).
    // Default: 2n ** 256n - 0x14551231950B75FC4402DA1732FC9BEBFn
    privateKeyHighRange: 2n ** 160n - 1n,

    // The progress report interval (in number of iterations).
    // Default: 1024n
    progressReportInterval: 500_000n,
};


export default FINDER_CONFIG;