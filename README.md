# Celk
A toolbox to work with cryptocurrency private keys with support for GPU computation.

Technical details
-----------------
- The tool is written in Typescript.
- The database is a MongoDB collection hosted on my server.
- The tool is using `GPU.js` to use the GPU for the computation.
- For now, implemented the following algorithms:
    - `secp256k1` (ECDSA curve used by Bitcoin).
    - `SHA-256`.
    - `RIPEMD-160`.
- These algorithms will be, later, implemented on the GPU.

Summary (1000 BTC Bitcoin Challenge)
------------------------------------
Introduction from the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx):
> In 2015, in order to show the hugeness of the private key space (or maybe just for fun), someone created a "puzzle" where he chose keys in a certain smaller space and sent increasing amounts to each of those keys.

As mentioned in the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), the best would be to focus
on the puzzle #66, which is the following:
- Address: `13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so`.
- Private key range: `20000000000000000...3ffffffffffffffff` (2^65 -> 2^66-1).
- Balance / Price: `6.60036213 BTC`.

But I'm wondering, based on my setup, is it easier to solve the puzzle #66 or the puzzle #130 ?
As mentioned in the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), the puzzle #130 is a lot more
complex than the puzzle #66, with a range from 2^129 to 2^130-1, but one thing that matters is that some of the public keys
have been shared by the author, and the first available public key in the list (wallet still full) is from the puzzle #130.

A difference between no public key and an available public key is the computation time, because, to convert the public key
into a valid Bitcoin address, it is necessary to compute the SHA-256 and RIPEMD160 hashes, which is a bit more complex than
just computing the `secp256k1` of the private key.

About the puzzle #130, which is the following:
- Address: `1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua `.
- Public key: `03633cbe3ec02b9401c5effa144c5b4d22f87940259634858fc7e59b1c09937852`
- Private key range: `200000000000000000000000000000000...3ffffffffffffffffffffffffffffffff` (2^129 -> 2^130-1).
- Balance / Price: `13 BTC`.

Similarly to the [66 Bit Collective Bitcoin Private Key Cracking Pool](http://www.ttdsales.com/66bit/login.php),
the workload will be split into ranges from `0000000000` to `FFFFFFFFFF` which corresponds to 1,099,511,627,776 keys.
After one range is completed, the next one will be started, and the previous one will be marked as completed in the database.

Notes
-----
- The Bitcoin address generation procedure can be found [here](https://www.crypto-lyon.fr/how-to-get-an-address-from-a-private-key-on-bitcoin.html).
- Another source of information about the Bitcoin address generation procedure can be found [here](https://www.oreilly.com/library/view/mastering-bitcoin-2nd/9781491954379/ch04.html).
- A bit more info about the technical details of the Bitcoin address generation procedure can be found [here](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses).
- An address generation testing tool can be found [here](https://gobittest.appspot.com/Address) (**Warning**: Only with uncompressed public key format).

Performances
------------
- `v1.0.0`: 396 K/s avg (CPU: AMD Ryzen 5 3600X @ 3.8 GHz, GPU: NVIDIA GeForce RTX 3070).
- `v1.0.1`: 792 K/s avg (CPU: AMD Ryzen 5 3600X @ 3.8 GHz, GPU: NVIDIA GeForce RTX 3070).
- `v1.0.2`: 997 K/s avg (CPU: AMD Ryzen 5 3600X @ 3.8 GHz, GPU: NVIDIA GeForce RTX 3070).