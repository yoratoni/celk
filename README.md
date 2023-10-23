# Celk
A toolbox to work with Bitcoin addresses & private keys.

Commands
--------
### Main commands
- `yarn find`: Executes the finder class with the configuration.

### Benchmarking
- `yarn benchmark:crypto`: Benchmarking of the encoders / algorithms.
- `yarn benchmark:ranger`: Benchmarking of the private key generator.
- `yarn benchmark:generator`: Benchmarking of the Bitcoin address generator.
- `yarn benchmark:sandbox`: To test some implementations.

Notes about the benchmarking:
- What I call the `ghost execution` report is a single showed execution of the generator with multiple previous executions.
  It allows the JIT compiler to optimize the code, and to show the real performance of the generator.
- It's the same thing for the other benchmarking, the goal is to run the functions a lot of times to get the real performance.
  Or the JIT compiler will not really optimize the code, it's even more important when we want to check the workload of the different functions.

Performances
------------
Benchmark environment:
- CPU: AMD Ryzen 5 3600x (6 cores / 12 threads) @ 3.8 GHz.
- GPU: NVIDIA GeForce RTX 3070.
- RAM: 32 GB DDR4 @ 3200 MHz.
- OS: Windows 10 64 bits.
- Node.js: v20.8.1.

### Benchmarking of the Bitcoin addresses generator
| Version     | Addresses per second (k/s) | Upgrade description                                               |
|-------------|----------------------------|-------------------------------------------------------------------|
| `v1.0.0`    | 396 k/s                    | **Basic algorithm implementations**                               |
| `v1.0.1`    | 792 k/s                    | **Improved benchmarking precision**                               |
| `v1.0.2`    | 850 k/s                    | **Ghost executions + Better benchmark measures**                  |
| `v1.0.2b`   | 1.18 Kk/s                  | **Upgrading Node.js from v16.20.2 to v20.8.1**                    |
| `v1.0.3`    | N/D                        | **Better private key generator (str -> bigint)**                  |

### Benchmarking of the algorithms / encoders (64 ghost executions)
This table is updated with the latest version of the toolbox.

| Algorithm / encoder | Execution time (ms) | Workload                    |
|---------------------|---------------------|-----------------------------|
| SECP256K1           | 719µs               | 94.16%                      |
| RIPEMD-160          | 13µs                | 1.71%                       |
| BASE58              | 11µs                | 1.44%                       |
| SHA-256             | 8µs / 5µs / 5µs     | 1.07% / 0.71% / 0.69%       |

#### Note about the SHA-256 algorithm:
The three numbers correspond to the three SHA-256 executions:
- 1 just before the RIPEMD-160 execution.
- 2 for the double SHA-256 checksum.

The first one is slower because the input is coming from the SECP256K1 algorithm,
which makes it big to process for the SHA-256 algorithm.

### Benchmarking of the private keys generator (1,000,000 iterations)
From `v1.0.3`, it seems not necessary to improve / benchmark the private key generator anymore,
because it is not the bottleneck of the toolbox. I would be glad if it becomes one day lol.

| Version     | `FULL_RANDOM` | `ASCENDING` | `DESCENDING` |
|-------------|---------------|-------------|--------------|
| `v1.0.0`    | 575.7 Kk/s    | 4.80 Mk/s   | 4.76 Mk/s    |
| `v1.0.1`    | 590.2 Kk/s    | 4.12 Mk/s   | 4.60 Mk/s    |
| `v1.0.2`    | 584.4 Kk/s    | 4.75 Mk/s   | 4.65 Mk/s    |
| `v1.0.2b`   | 592.1 Kk/s    | 4.24 Mk/s   | 4.68 Mk/s    |
| `v1.0.3`    | 1.21 Mk/s     | 10.66 Mk/s  | 12.71 Mk/s   |

### A list of things that I want to do to improve the performances
- [x] Use a better private key generator (str -> bigint).
- [ ] Add support for little & big endian (using TypedArray).
- [ ] Use a single TypedArray cache for the entire generations.
- [ ] Convert the output of the Secp256k1 algorithm to an Uint32Array.
- [ ] Allow SHA-256 to use an Uint32Array as input & output.
- [ ] Allow RIPEMD-160 to use an Uint32Array as input & output.
- [ ] Add the version byte to the Uint32Array without passing by a string.
- [ ] Calculate the checksum without passing by a string (double SHA-256 checksum).
- [ ] Allow BASE58 to use an Uint32Array as input.
- [ ] Use a pre-allocated TypedArray and keep it in memory for the entire execution (reduces memory allocation time).

Classes
-------
The core of the toolbox is composed of the following classes:
- `Ranger`: A class that generates private keys between a given range, with support for multiple modes.
- `Generator`: This class wraps the algorithms & encoders to generate Bitcoin addresses from private keys.
- `Finder`: A class that wraps the `Ranger` & the `Generator` classes to find the Bitcoin addresses that match the given criteria.

Configuration
-------------
I chose to use fix configuration files instead of command line arguments, because it is easier to work with, at least in this case.

- `benchmark.config.ts`: The configuration file for the benchmarking.
- `finder.config.ts`: The configuration file for the finder.
- `global.config.ts`: The global configuration file.

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
- Now, the thing that always takes most of the computation time is the ECDSA algorithm..

Sources & Credits
-----------------
- [A scheme about public keys to BTC addresses](https://en.bitcoin.it/w/images/en/9/9b/PubKeyToAddr.png).
- [Bitcoin address generation procedure.](https://www.crypto-lyon.fr/how-to-get-an-address-from-a-private-key-on-bitcoin.html)
- [More detailed procedure to generate addresses.](https://www.oreilly.com/library/view/mastering-bitcoin-2nd/9781491954379/ch04.html)
- [Technical background of v1 Bitcoin addresses.](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)
- [Bitcoin address testing tool from uncompressed private keys.](https://gobittest.appspot.com/Address).