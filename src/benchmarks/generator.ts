import BENCHMARK_CONFIG from "configs/benchmark.config";
import Generator from "lib/classes/generator";
import { benchmarkGenerator, generateRandomHexString } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const iterations = `${BENCHMARK_CONFIG.generatorIterations.toLocaleString("en-US")} iterations`;

    const generator = new Generator();

    const randomPrivateKeyFn = () => generateRandomHexString(64);

    console.log("");
    logger.info("Single execution (random private key):");
    generator.executeReport(generateRandomHexString(64));

    console.log("");
    logger.info(`Multiple executions (${iterations}, random private key):`);
    benchmarkGenerator(
        generator.execute,
        randomPrivateKeyFn
    );
};


main();