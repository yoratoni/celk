import Ranger from "lib/classes/ranger";
import { benchmarkRanger } from "utils/benchmark";
import logger from "utils/logger";
import { bigIntPow } from "utils/maths";


/**
 * Main function for the benchmarking of the Ranger (Bitcoin private key generator).
 */
function main() {
    logger.info("Starting benchmarking of the Ranger (Bitcoin private key generator).");
    console.log("");

    const ranger = new Ranger(
        bigIntPow(2n, 4n),
        bigIntPow(2n, 256n) - 1n
    );

    logger.info("RANGER (FULL RANDOM):");
    benchmarkRanger(
        ranger.executeFullRandom
    );

    logger.info("RANGER (ASCENDING):");
    benchmarkRanger(
        ranger.executeAscending
    );

    logger.info("RANGER (DESCENDING):");
    benchmarkRanger(
        ranger.executeDescending
    );
}


main();