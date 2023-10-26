import BENCHMARK_CONFIG from "configs/benchmark.config";
import Generator from "lib/classes/generator";
import Ranger from "lib/classes/ranger";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const ghostIterations = `${BENCHMARK_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;

    const ranger = new Ranger(0n, 2n ** 256n - 1n);
    const generator = new Generator(true);

    console.log("");
    logger.info(`Ghost execution (${ghostIterations}, "PUBLIC_KEY" mode, random private key):`);
    generator.executeReport(ranger.executeFullRandom(), "PUBLIC_KEY");

    logger.info(`Ghost execution (${ghostIterations}, "RIPEMD-160" mode, random private key):`);
    generator.executeReport(ranger.executeFullRandom(), "RIPEMD-160");

    logger.info(`Ghost execution (${ghostIterations}, "ADDRESS" mode, random private key):`);
    generator.executeReport(ranger.executeFullRandom(), "ADDRESS");
};


main();