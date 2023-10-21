import AddressGenerator from "lib/classes/AddressGenerator";
import { benchmarkAddressGenerator, generateRandomPrivateKey } from "utils/benchmark";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
function main() {
    logger.info("Starting benchmarking of the Bitcoin address generator.");
    console.log("");

    const addressGenerator = new AddressGenerator();

    const randomPrivateKeyFn = () => generateRandomPrivateKey();

    logger.info("GENERATOR:");
    benchmarkAddressGenerator(
        addressGenerator.execute,
        randomPrivateKeyFn
    );
}


main();