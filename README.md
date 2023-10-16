# Celk
A tool that tries to solve one of the Bitcoin private key puzzles.

Summary
-------
Introduction from the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx):
> In 2015, in order to show the hugeness of the private key space (or maybe just for fun), someone created a "puzzle" where he chose keys in a certain smaller space and sent increasing amounts to each of those keys.


As mentioned in the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), the best would be to focus
on the puzzle #66, which is the following:
- Address: `13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so`.
- Private key range: `20000000000000000:3ffffffffffffffff` (2^65 -> 2^66-1).
- Balance / Price: `6.60036213 BTC`.

But I'm wondering, based on my setup, is it easier to solve the puzzle #66 or the puzzle #130 ?
As mentioned in the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), the puzzle #130 is a lot more
complex than the puzzle #66, with a range from 2^129 to 2^130-1, but one thing that matters is that some of the public keys
have been shared by the author, and the first available public key in the list (wallet still full) is from the puzzle #130.

A difference between no public key and an available public key is the computation time, because, to convert the public key
into a valid Bitcoin address, it is necessary to compute the SHA256 and RIPEMD160 hashes, which is a bit more complex than
just computing the `secp256k1` of the private key.

Similarly to the [66 Bit Collective Bitcoin Private Key Cracking Pool](http://www.ttdsales.com/66bit/login.php),
the workload will be split into ranges from `0000000000` to `FFFFFFFFFF` which corresponds to 1,099,511,627,776 keys.
After one range is completed, the next one will be started, and the previous one will be marked as completed in the database.

Technical details
-----------------
- The tool is written in Typescript.
- The database is a MongoDB collection.
- The tool is using `GPU.js` to use the GPU for the computation.