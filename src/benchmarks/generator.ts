import BENCHMARK_CONFIG from "configs/benchmark.config";
import Generator from "lib/classes/generator";
import { benchmarkGenerator, generateRandomPrivateKey } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
function main() {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const iterations = `${BENCHMARK_CONFIG.generatorIterations.toLocaleString("en-US")} iterations`;

    const generator = new Generator();

    const randomPrivateKeyFn = () => generateRandomPrivateKey();

    console.log("");
    logger.info(`GENERATOR (NEW PK PER REPORT - ${iterations}):`);
    benchmarkGenerator(
        generator.execute,
        randomPrivateKeyFn
    );
}


main();