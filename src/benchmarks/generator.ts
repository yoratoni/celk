import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import Generator from "lib/classes/generator";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const ghostIterations = `${BENCHMARKS_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;

    const generator = new Generator(
        "FULL_RANDOM",
        0n,
        2n ** 256n - 1n,
        "COMPRESSED",
        "PUBLIC_KEY"
    );

    console.log("");
    logger.info(`Ghost execution (${ghostIterations}, 'PUBLIC_KEY' mode, random private key):`);
    generator.executeReport();

    logger.info(`Ghost execution (${ghostIterations}, 'RIPEMD-160' mode, random private key):`);
    generator.setGeneratorGenMode("RIPEMD-160");
    generator.executeReport();

    logger.info(`Ghost execution (${ghostIterations}, 'ADDRESS' mode, random private key):`);
    generator.setGeneratorGenMode("ADDRESS");
    generator.executeReport();
};


main();