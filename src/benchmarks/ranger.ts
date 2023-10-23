import BENCHMARK_CONFIG from "configs/benchmark.config";
import { benchmarkRanger } from "helpers/benchmark";
import { bigIntPow } from "helpers/maths";
import Ranger from "lib/classes/ranger";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Ranger (Bitcoin private key generator).
 */
const main = () => {
    logger.info("Starting benchmarking of the Ranger (Bitcoin private key generator).");

    const iterations = `${BENCHMARK_CONFIG.rangerIterations.toLocaleString("en-US")} iterations`;

    const ranger = new Ranger(
        bigIntPow(2n, 20n),
        bigIntPow(2n, 21n) - 1n
    );

    console.log("");
    logger.info(`Full random mode (${iterations}):`);
    benchmarkRanger(
        ranger.executeFullRandom
    );

    console.log("");
    logger.info(`Ascending mode (${iterations}):`);
    benchmarkRanger(
        ranger.executeAscending
    );

    console.log("");
    logger.info(`Descending mode (${iterations}):`);
    benchmarkRanger(
        ranger.executeDescending
    );
};


main();