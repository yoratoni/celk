import Ranger from "lib/classes/ranger";
import { benchmarkRanger } from "utils/benchmark";
import { bigIntPow } from "utils/conversions";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Ranger (Bitcoin private key generator).
 */
function main() {
    logger.info("Starting benchmarking of the Ranger (Bitcoin private key generator).");
    console.log("");

    const ranger = new Ranger(
        bigIntPow(2n, 4n),
        bigIntPow(2n, 5n) - 1n
    );

    logger.info("RANGER (FULL RANDOM):");
    benchmarkRanger(
        ranger.executeFullRandom
    );
}


main();