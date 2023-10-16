# Celk
A tool that tries to solve one of the Bitcoin private key puzzles.

Summary
-------
Introduction from the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx):
> In 2015, in order to show the hugeness of the private key space (or maybe just for fun), someone created a "puzzle" where he chose keys in a certain smaller space and sent increasing amounts to each of those keys.


As mentioned in the [Private Keys Database](https://privatekeys.pw/puzzles/bitcoin-puzzle-tx), I will focus on the puzzle #66,
which is the following:
- Address: `13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so`.
- Private key range: `20000000000000000:3ffffffffffffffff` (2^65 -> 2^66-1).
- Balance / Price: `6.60036213 BTC`.

Similarly to the [66 Bit Collective Bitcoin Private Key Cracking Pool](http://www.ttdsales.com/66bit/login.php),
the workload will be split into ranges from `0000000000` to `FFFFFFFFFF` which corresponds to 1,099,511,627,776 keys.
After one range is completed, the next one will be started, and the previous one will be marked as completed in the database
(which is an internal JSON file).