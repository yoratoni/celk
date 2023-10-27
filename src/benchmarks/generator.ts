import BENCHMARK_CONFIG from "configs/benchmark.config";
import Generator from "lib/classes/generator";
import RANGER_ENGINE from "lib/crypto/generators/RANGER";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const ghostIterations = `${BENCHMARK_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;

    const rangerEngine = new RANGER_ENGINE("FULL_RANDOM", 1n, 2n ** 256n - 1n);
    const generator = new Generator("COMPRESSED", "PUBLIC_KEY");

    console.log("");
    logger.info(`Ghost execution (${ghostIterations}, "PUBLIC_KEY" mode, random private key):`);
    generator.executeReport(rangerEngine.execute());

    logger.info(`Ghost execution (${ghostIterations}, "RIPEMD-160" mode, random private key):`);
    generator.setGeneratorGenMode("RIPEMD-160");
    generator.executeReport(rangerEngine.execute());

    logger.info(`Ghost execution (${ghostIterations}, "ADDRESS" mode, random private key):`);
    generator.setGeneratorGenMode("ADDRESS");
    generator.executeReport(rangerEngine.execute());
};


main();