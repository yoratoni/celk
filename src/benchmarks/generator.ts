import BENCHMARK_CONFIG from "configs/benchmark.config";
import { benchmarkGenerator } from "helpers/benchmark";
import Generator from "lib/classes/generator";
import Ranger from "lib/classes/ranger";
import logger from "utils/logger";


/**
 * Main function for the benchmarking of the Bitcoin address generator.
 */
const main = () => {
    logger.info("Starting benchmarking of the Bitcoin address generator.");

    const ghostIterations = `${BENCHMARK_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;
    const iterations = `${BENCHMARK_CONFIG.generatorIterations.toLocaleString("en-US")} iterations`;

    const ranger = new Ranger(0n, 2n ** 256n - 1n);
    const generator = new Generator(true);

    // const randomPrivateKeyFn = () => ranger.executeFullRandom();

    console.log("");
    logger.info(`Ghost execution (${ghostIterations}, random private key):`);
    generator.executeReport(ranger.executeFullRandom());

    // console.log("");
    // logger.info(`Multiple executions (${iterations}, random private key):`);
    // benchmarkGenerator(
    //     generator.execute,
    //     randomPrivateKeyFn
    // );
};


main();