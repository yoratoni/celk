import BENCHMARK_CONFIG from "configs/benchmark.config";
import Ranger from "lib/classes/ranger";
import { benchmarkRanger } from "utils/benchmark";
import logger from "utils/logger";
import { bigIntPow } from "utils/maths";


/**
 * Main function for the benchmarking of the Ranger (Bitcoin private key generator).
 */
const main = () => {
    logger.info("Starting benchmarking of the Ranger (Bitcoin private key generator).");

    const iterations = `${BENCHMARK_CONFIG.rangerIterations.toLocaleString("en-US")} iterations`;

    const ranger = new Ranger(
        bigIntPow(2n, 4n),
        bigIntPow(2n, 256n) - 1n
    );

    console.log("");
    logger.info(`Full random mode (${iterations} iterations):`);
    benchmarkRanger(
        ranger.executeFullRandom
    );

    console.log("");
    logger.info(`Ascending mode (${iterations} iterations):`);
    benchmarkRanger(
        ranger.executeAscending
    );

    console.log("");
    logger.info(`Descending mode (${iterations} iterations):`);
    benchmarkRanger(
        ranger.executeDescending
    );
};


main();