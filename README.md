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

Configuration
-------------
I chose to use fix configuration files instead of command line arguments, because it is easier to work with, at least in this case.

- `benchmark.config.ts`: The configuration file for the benchmarking.
- `finder.config.ts`: The configuration file for the finder.
- `global.config.ts`: The global configuration file.

Classes
-------
The core of the toolbox is composed of the following classes:
- `Ranger`: A class that generates private keys between a given range, with support for multiple modes.
- `Generator`: This class wraps the algorithms & encoders to generate Bitcoin addresses from private keys.
- `Finder`: A class that wraps the `Ranger` & the `Generator` classes to find the Bitcoin addresses that match the given criteria.

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

Similarly to the [66 Bit Collective Bitcoin Private Key Cracking Pool](http://www.ttdsales.com/66bit/login.php),
the workload will be split into ranges from `0000000000` to `FFFFFFFFFF` which corresponds to 1,099,511,627,776 keys.
After one range is completed, the next one will be started, and the previous one will be marked as completed in the database.

Sources & Credits
-----------------
- [Bitcoin address generation procedure.](https://www.crypto-lyon.fr/how-to-get-an-address-from-a-private-key-on-bitcoin.html)
- [More detailed procedure to generate addresses.](https://www.oreilly.com/library/view/mastering-bitcoin-2nd/9781491954379/ch04.html)
- [Technical background of v1 Bitcoin addresses.](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)
- [Bitcoin address testing tool from uncompressed private keys.](https://gobittest.appspot.com/Address).