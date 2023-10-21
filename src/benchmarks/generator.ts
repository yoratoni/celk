import Generator from "lib/classes/generator";
import { benchmarkGenerator, generateRandomPrivateKey } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
function main() {
    logger.info("Starting benchmarking of the Bitcoin address generator.");
    console.log("");

    const generator = new Generator();

    const randomPrivateKeyFn = () => generateRandomPrivateKey();

    logger.info("GENERATOR:");
    benchmarkGenerator(
        generator.execute,
        randomPrivateKeyFn
    );
}


main();