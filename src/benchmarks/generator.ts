import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import Generator from "lib/classes/generator";
import PKG_ENGINE from "lib/crypto/generators/PKG";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const ghostIterations = `${BENCHMARKS_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;

    const pkgEngine = new PKG_ENGINE("FULL_RANDOM", 1n, 2n ** 256n - 1n);
    const generator = new Generator("COMPRESSED", "PUBLIC_KEY");

    console.log("");
    logger.info(`Ghost execution (${ghostIterations}, 'PUBLIC_KEY' mode, random private key):`);
    generator.executeReport(pkgEngine.execute());

    logger.info(`Ghost execution (${ghostIterations}, 'RIPEMD-160' mode, random private key):`);
    generator.setGeneratorGenMode("RIPEMD-160");
    generator.executeReport(pkgEngine.execute());

    logger.info(`Ghost execution (${ghostIterations}, 'ADDRESS' mode, random private key):`);
    generator.setGeneratorGenMode("ADDRESS");
    generator.executeReport(pkgEngine.execute());
};


main();