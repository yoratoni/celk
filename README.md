# Celk
A toolbox to work with Bitcoin addresses & private keys, entirely written in TypeScript, and soon, a bit in AssemblyScript.

Note that, for now, the performance of the toolbox is not the best as I decided to focus on the entire architecture first,
and then, to focus on the performance.

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
- `yarn benchmark:generator`: Bitcoin address generator.
- `yarn benchmark:sandbox`: To compare different techniques while implementing new stuff.

Notes about the benchmarking:
- What I call the "ghost execution report" is a single showed execution of the generator with multiple previous hidden executions.
  It allows the JIT compiler to optimize the code, and to show the real performance of the generator.
- It's the same thing for the other benchmarking, the goal is to run the functions a lot of times to get the real performance.
  Or the JIT compiler will not really optimize the code, it's even more important when we want to check the workload of the different functions.

### Other commands
- `yarn test`: An empty test file, just to check some functions.

Configurations
-------------_
I chose to use fix configuration files instead of command line arguments, because it is easier to work with, at least in this case.

- `src/configs/benchmarks.config.ts`: Benchmarking config file.
- `src/configs/finder.config.ts`: Finder config file.
- `src/configs/global.config.ts`: Global config file.

#### More about the benchmarking configuration:
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

Now, it is not perfect, it reduces a bit the number of iterations per second, but it is not a big deal,
as it better matches the real performance of the algorithm / encoder / generator. That's why I decided
to use a corrector (estimated at 1.45 for now) to get the real number of iterations per second.

I still separated them in the reports, that's what the `THEORETICAL` field means, it is the theoretical number of iterations per second,
without all the other stuff going on in the background.

#### More about the finder configuration:
```typescript
const FINDER_CONFIG: Configs.IsFinderConfig = {
    // The public key to find the private key for if available (supports 0x prefix).
    publicKeyToFind: "0x02e0a8b039282faf6fe0fd769cfbc4b6b4cf8758ba68220eac420e32b91ddfa673",

    // The address to find the private key for.
    addressToFind: "128z5d7nN7PkCuX5qoA4Ys6pmxUYnEy86k",

    // Use compressed public key ("COMPRESSED") or uncompressed ("UNCOMPRESSED").
    // BTC addresses generally uses compressed keys.
    // Default: true
    publicKeyGenMode: "COMPRESSED",

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
    progressReportInterval: 1024n,
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
| Version     | Addresses per second (K/s) | Upgrade description                                               |
|-------------|----------------------------|-------------------------------------------------------------------|
| `v1.0.0`    | 396 K/s                    | **Basic algorithm implementations**                               |
| `v1.0.1`    | 792 K/s                    | **Improved benchmarking precision**                               |
| `v1.0.2`    | 850 K/s                    | **Ghost executions + Better benchmark measures**                  |
| `v1.0.2b`   | 1.18 kK/s                  | **Upgrading Node.js from v16.20.2 to v20.9.0**                    |
| `v1.0.3`    | 1.19 kK/s                  | **Better private key generator (str -> bigint)**                  |
| `v1.0.4`    | 1.24 kK/s                  | **Using a single buffer**                                         |
| `v1.0.4b`   | N/D                        | **Allow to use the public key if known**                          |
| `v1.0.5`    | 1.25 kK/s                  | **Reverts the address to its RIPEMD-160 hash**                    |
| `v1.0.5b`   | N/D                        | **Better benchmarking & reports per second**                      |

#### About the single buffer:
The cache itself is a 154 bytes buffer, which is enough to store all the steps of the generator.

The goal of the single buffer update is not to directly improve the performance of the generator (for now),
as the bottleneck is still the SECP256K1 algorithm, but to at least, not make it the bottleneck later,
when the SECP256K1 algorithm will be improved.

Here's a table that shows the reserved spaces (in bytes):
| Step           | ID     | Start index | End index   | Length |
|----------------|--------|-------------|-------------|--------|
| `SECP256K1`    | `PBL`  | `000`       | `065`       | `65`   |
| `SHA-256`      | `SHA`  | `065`       | `097`       | `32`   |
| `NET BYTE`     | `---`  | `097`       | `098`       | `01`   |
| `RIPEMD-160`   | `RIP`  | `098`       | `118`       | `20`   |
| `CHECKSUM`     | `CHK`  | `118`       | `122`       | `04`   |
| `SHA-256 CHK`  | `SC1`  | `122`       | `154`       | `32`   |
| `SHA-256 CHK`  | `SC2`  | `122`       | `154`       | `32`   |

### Benchmarking of the algorithms / encoders (512 ghost executions)
This table is updated with the latest version of the toolbox.

Note that all the normal generator steps are not included anymore, since `v1.0.5`,
because I simply reversed the address to its RIPEMD-160 hash.
Meaning that there's less steps to check if a private key is valid or not.

| Algorithm / encoder | Execution time (ms) | Workload |
|---------------------|---------------------|----------|
| SECP256K1           | 1.96ms              | 96.85%   |
| SHA-256             | 3.1µs               | 0.16%    |
| RIPEMD-160          | 5.8µs               | 0.29%    |

### Benchmarking of the Private Key Generator (PKG) (5 seconds)
From `v1.0.3`, it seems not necessary to improve / benchmark the private key generator anymore,
because it is not the bottleneck of the toolbox. I would be glad if it becomes one day lol.

| Version     | `FULL_RANDOM` | `ASCENDING`    | `DESCENDING`     |
|-------------|---------------|----------------|------------------|
| `v1.0.0`    | 575.7 kK/s    | 4.80 MK/s      | 4.76 MK/s        |
| `v1.0.1`    | 590.2 kK/s    | 4.12 MK/s      | 4.60 MK/s        |
| `v1.0.2`    | 584.4 kK/s    | 4.75 MK/s      | 4.65 MK/s        |
| `v1.0.2b`   | 592.1 kK/s    | 4.24 MK/s      | 4.68 MK/s        |
| `v1.0.3`    | **1.67 MK/s** | **11.15 MK/s** | **11.41 MK/s**   |

Ideas of future updates
-----------------------
### 1. From TS to AssemblyScript
I need to choose what part of the toolbox I want to convert to AssemblyScript, the best would be to convert only the low level stuff,
here's a list of the things that could be converted:
- The private key generator.
- The SECP256K1 algorithm.
- The SHA-256 algorithm.
- The RIPEMD-160 algorithm.
- The BASE58 encoder.

Technically, I could also convert the generator, but I don't think it is necessary as it only executes operations on a single buffer,
initialized only once. The Finder class could also be converted, but it's literally a loop that calls the generator,
so I don't think it is necessary too.

### 2. NodeJS Workers
Thinking about it, but after a lot of performance improvements..

Architecture
------------
#### Generators / Algorithms / Encoders
```TS
|- class PKG_ENGINE
|  |- privateKeyGenMode: "FULL_RANDOM" | "ASCENDING" | "DESCENDING"
|     |- execute(): bigint
|        |- private executeFullRandom(): bigint
|        |- private executeAscending(): bigint
|        |- private executeDescending(): bigint
|
|- class SECP256K1_ENGINE
|  |- publicKeyGenMode: "UNCOMPRESSED" | "COMPRESSED"
|     |- execute(cache: Buffer, privateKey: bigint): void
|        |- private executeUncompressed(cache: Buffer, privateKey: bigint): void
|        |- private executeCompressed(cache: Buffer, privateKey: bigint): void
|
|- class SHA256_ENGINE
|  |- execute(cache: Buffer, bytesToTakeFromCache?: [number, number], writeToOffset?: number): void
|
|- class RIPEMD160_ENGINE
|  |- execute(cache: Buffer, bytesToTakeFromCache?: [number, number], writeToOffset?: number): void
|
|- class BASE58_ENGINE
|  |- encode(cache: Buffer, bytesToTakeFromCache: [number, number]): string
```

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