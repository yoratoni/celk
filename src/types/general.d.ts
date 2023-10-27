declare namespace General {
    type IsCryptoBenchmarkMode = "all" | "pkg" | "algorithms" | "encoders" | "secp256k1" | "sha256" | "ripemd160" | "base58";
    type IsPrivateKeyGenMode = "FULL_RANDOM" | "ASCENDING" | "DESCENDING";
    type IsPublicKeyGenMode = "UNCOMPRESSED" | "COMPRESSED";
    type IsGeneratorGenMode = "PUBLIC_KEY" | "RIPEMD-160" | "ADDRESS";
}


export default General;