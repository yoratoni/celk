# Celk
A toolbox to work with Bitcoin addresses & private keys, entirely written in TypeScript, and soon, a bit in AssemblyScript.

Note that, for now, the performance of the toolbox is not the best as I decided to focus on the architecture first,
and only then, on the actual performance.

As for the SECP256K algorithm, I decided to use the `secp256k1-node` module, my own implementation is, for now,
really slow, as it is a simple JS implementation, and for it to be fast, it needs to be either written in AssemblyScript,
either with GPU.js, but I'll see that later, it is not something easy to do.

Commands
--------
### Main commands
- `yarn find`: Executes the main function made to find the private key for a given public key / address.

### Benchmarking
- `yarn benchmark:crypto -m [option]`: Each generators / encoder / algorithm.
    - Options:
        - `all`: All the generators / encoders / algorithms.
        - `pkg`: The private key generator.
        - `algorithms`: The algorithms category.
        - `encoders`: The encoders category.
        - `secp256k1`: The SECP256K1 algorithm.
        - `sha256`: The SHA-256 algorithm.
        - `ripemd160`: The RIPEMD-160 algorithm.
        - `base58`: The BASE58 encoder.
- `yarn benchmark:generator`: Bitcoin address generator (`> Public key`, `> RIPEMD-160 Hash`, `> Address`).
- `yarn benchmark:sandbox`: To compare different techniques while implementing new stuff, empty by default.

Notes about the benchmarking:
- What I call the `ghost execution report` in some of my benchmarks results,
  is a single showed execution of the generator with multiple previous hidden executions.
  It is generally named "warm up" in other benchmarks, but I prefer to call it "ghost execution" (cooler).
  It allows the JIT compiler to optimize the code, and to show the real performance of the generator.

### Other commands
- `yarn test`: An empty test file, just to check some functions.

Configurations
--------------
I chose to use fix configuration files instead of command line arguments, because it is easier to work with, at least in this case.

- `src/configs/benchmarks.config.ts`: Benchmarking config file.
- `src/configs/finder.config.ts`: Finder config file.
- `src/configs/global.config.ts`: Global config file.

#### More about the benchmarks configuration:
```typescript
const BENCHMARKS_CONFIG: Configs.IsBenchmarksConfig = {
    // Total number of reports to display
    nbReports: 5,

    // Number of seconds to wait between each report (> 1)
    reportInterval: 1,

    // Generator ghost executions to warm up the engine
    generatorGhostExecutionIterations: 1024
};
```
As the number of iterations per second really depends of the algorithm / encoder / generator,
I decided to use a report interval instead of a number of iterations.

#### More about the finder configuration:
```typescript
const FINDER_CONFIG: Configs.IsFinderConfig = {
    // The public key to find the private key for if available (supports 0x prefix).
    publicKeyToFind: "0x02e0a8b039682fbf4fe0fd769cfbc4b6b4cf8758ba68220bac420e32b91ddfa673",

    // The address to find the private key for.
    addressToFind: "127z5d2nN7PkCuX5voA4Ys6pmxUYnEy86k",

    // Use compressed public key ("COMPRESSED") or uncompressed ("UNCOMPRESSED").
    // BTC addresses generally uses compressed keys.
    // Default: true
    publicKeyGenMode: "COMPRESSED",

    // The private key generation mode (FULL_RANDOM, ASCENDING, DESCENDING).
    // Default: FULL_RANDOM
    privateKeyGenMode: "FULL_RANDOM",

    // The private key low range (inclusive).
    // Default: 1n
    privateKeyLowRange: 1n,

    // The private key high range (inclusive).
    // Default: 2n ** 256n - 0x14551231950B75FC4402DA1732FC9BEBFn
    privateKeyHighRange: 2n ** 160n - 1n,

    // The progress report interval (in number of iterations).
    // Default: 1024n
    progressReportInterval: 1024n
};
```
- If you fill the `publicKeyToFind` field, the `addressToFind` field will be ignored.
- The public key can start with `0x`, it is supported.
- The `publicKeyGenMode` field is used to specify if the public key should be compressed or not, it is generally compressed.
- The `privateKeyGenMode` can be set to `FULL_RANDOM`, `ASCENDING` or `DESCENDING`. Ascending & descending will start from the beginning
  / end of the private key range, and full random will generate.. a random number in the range.
- If you do not know the private key range, just let them like this, these are the default values for the `SECP256K1` algorithm.
- The report interval is the number of iterations to skip before showing the report, if you produces 55 kK/s, and set it at `55_000n`,
  it will show the report every second.

Performances
------------
Benchmark environment:
- CPU: AMD Ryzen 5 3600x (6 cores / 12 threads) @ 3.8 GHz.
- GPU: NVIDIA GeForce RTX 3070.
- RAM: 32 GB DDR4 @ 3200 MHz.
- OS: Windows 10 64 bits.
- Node.js: v20.9.0.

### Benchmarking of the Bitcoin addresses generator
| Version     | Addresses per second (K/s) | Upgrade description                                          |
|-------------|----------------------------|--------------------------------------------------------------|
| `v1.0.0`    | 396 K/s                    | **Basic algorithm implementations**                          |
| `v1.0.1`    | 792 K/s                    | **Improved benchmarking precision**                          |
| `v1.0.2`    | 850 K/s                    | **Ghost executions + Better benchmark measures**             |
| `v1.0.2b`   | 1.18 kK/s                  | **Upgrading Node.js from v16.20.2 to v20.9.0**               |
| `v1.0.3`    | 1.19 kK/s                  | **Better private key generator (str -> bigint)**             |
| `v1.0.4`    | 1.24 kK/s                  | **Using a single buffer for all operations**                 |
| `v1.0.4b`   | N/D                        | **Allow to use the public key if known**                     |
| `v1.0.5`    | 1.25 kK/s                  | **Reverts the address to its RIPEMD-160 hash**               |
| `v1.0.5b`   | N/D                        | **Better benchmarking & reports per second**                 |
| `v1.0.6`    | 15.42 kK/s                 | **Using secp256k1 module and WASM / JS shared memory space** |

#### About the cache:
> Note that I was previously using Node.js Buffers, but for better compatibility with WASM modules,
> I decided to switch to Uin8Arrays (in `v1.0.6`).
> Now, I still extended Uint8Arrays to add methods similar to the ones that can be found in the Buffer class,
> but I kept the Uint8Array class as the main class, to avoid any need for conversions.
>
> Also note that this cache is an instance of the memory buffer of the WASM module, allowing
> data sharing between JavaScript & the WASM modules.

Here's a table that shows the reserved spaces (in bytes):
| Step           | ID     | Offset | End*  | Bytes |
|----------------|--------|--------|-------|-------|
| `PKG`          | `PKG`  | `000`  | `032` | `32`  |
| `SECP256K1`    | `PBL`  | `032`  | `097` | `65`  |
| `SHA-256`      | `SHA`  | `097`  | `129` | `32`  |
| `NET BYTE`     | `NTB`  | `129`  | `130` | `01`  |
| `RIPEMD-160`   | `RIP`  | `130`  | `150` | `20`  |
| `CHECKSUM`     | `CHK`  | `150`  | `154` | `04`  |
| `SHA-256 CHK1` | `SC1`  | `154`  | `186` | `32`  |
| `SHA-256 CHK2` | `SC2`  | `154`  | `186` | `32`  |

With:
- `129::150` being the final RIPEMD-160 hash before double SHA-256 checksum (21 bytes).
- `129::154` being the final Bitcoin hash before BASE58 (25 bytes).

`*` Note that the `End` index is exclusive.

### Benchmarking of the different steps of the generator
This table is updated with the latest version of the toolbox.

Note that, since `v1.0.5`, the input address is reversed to its RIPEMD-160 hash,
meaning that there's less steps to check if a private key is valid or not. I still
kept all the necessary stuff to generate addresses directly from the private key.

I'm using two of my benchmarks to get the results:
- `yarn benchmark:crypto`: Benchmarking of the algorithms / encoders to get their iterations per second.
- `yarn benchmark:generator`: Benchmarking of the generator to get execution time & workload.

| Step         | Execution time | Workload | Iterations per second |
|--------------|----------------|----------|-----------------------|
| PKG (RANDOM) | 07.5µs         | 12.04%   | 164.87 kIT/s          |
| SECP256K1    | 43.6µs         | 69.98%   | 022.62 kIT/s          |
| SHA-256      | 05.6µs         | 08.99%   | 245.60 kIT/s          |
| RIPEMD-160   | 05.6µs         | 08.99%   | 238.78 kIT/s          |

Note that the private key used to benchmark the `sec256k1` algorithm is 2^255,
which is a pretty high number, and that's why it takes so much time to compute.

1000 BTC Bitcoin Challenge
--------------------------
One thing that made me want to build this toolbox is this challenge.

Introduction about it, from the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx):
> In 2015, in order to show the hugeness of the private key space (or maybe just for fun), someone created a "puzzle" where he chose keys in a certain smaller space and sent increasing amounts to each of those keys.

As mentioned on this website, the best would be to focus on the puzzle #66, which is the following:
- Address: `13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so`.
- Private key range: `2^65...2^66-1`.
- Balance / Price: `6.60036213 BTC`.

Now, another puzzle that is interesting is the puzzle #130, which is the following:
- Address: `1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua `.
- Public key: `03633cbe3ec02b9401c5effa144c5b4d22f87940259634858fc7e59b1c09937852`.
- Private key range: `2^129...2^130-1`.
- Balance / Price: `13 BTC`.

Notes about it:
- This puzzle is a lot more complex than the puzzle #66, with a range from 2^129 to 2^130-1,
but one thing that matters is that some of the public keys has been shared by the author,
and the first available public key in the list (wallet still full) is from the puzzle #130.
- A difference between no public key and an available public key is the computation time, because, to convert the public key
into a valid Bitcoin address, it is necessary to compute `3 * SHA-256 + RIPEMD-160 + BASE58` too, which takes a bit more time.
- Now, the thing that always takes most of the computation time is the SECP256K1 algorithm..

Sources & Credits
-----------------
- [A scheme about public keys to BTC addresses](https://en.bitcoin.it/w/images/en/9/9b/PubKeyToAddr.png).
- [Bitcoin address generation procedure](https://www.crypto-lyon.fr/how-to-get-an-address-from-a-private-key-on-bitcoin.html).
- [More detailed procedure to generate addresses](https://www.oreilly.com/library/view/mastering-bitcoin-2nd/9781491954379/ch04.html).
- [Technical background of v1 Bitcoin addresses](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses).
- [Bitcoin address testing tool from uncompressed private keys](https://gobittest.appspot.com/Address).
- [This post about ECC by Andrea Corbellini](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/?ref=hackernoon.com).