import BENCHMARK_CONFIG from "configs/benchmark.config";
import config from "configs/finder.config";
import Generator from "lib/classes/generator";
import Ranger from "lib/classes/ranger";
import { bigIntToPercentage , bigintToPrivateKey, formatTimestamp, formatUnitPerTimeUnit } from "utils/formats";
import logger from "utils/logger";


/**
 * Used to find a private key from a given Bitcoin address.
 *
 * **NOTES ABOUT PRIVATE KEY GENERATION MODES:**
 * - `fullRandom`: Completely random within range.
 * - `ascending`: Starts from the low range and goes up.
 * - `descending`: Starts from the high range and goes down.
 */
export default class Finder {
    private generator: Generator;
    private ranger: Ranger;

    private rangerExecuteFn: () => bigint;


    /**
     * Construct a new Bitcoin address finder (based on FINDER_CONFIG).
     */
    constructor() {
        this.generator = new Generator(config.useCompressedPublicKey);
        this.ranger = new Ranger(config.privateKeyLowRange, config.privateKeyHighRange);

        switch (config.privateKeyGenMode) {
            case "FULL_RANDOM":
                this.rangerExecuteFn = this.ranger.executeFullRandom;
                break;
            case "ASCENDING":
                this.rangerExecuteFn = this.ranger.executeAscending;
                break;
            case "DESCENDING":
                this.rangerExecuteFn = this.ranger.executeDescending;
                break;
            default:
                this.rangerExecuteFn = this.ranger.executeAscending;
        }
    }

    private initialReport = (): void => {
        logger.info("Starting the Bitcoin address finder.");
        logger.info(`>> Private key generation mode: ${config.privateKeyGenMode}`);
        logger.info(`>> Progress report interval: ${config.progressReportInterval.toLocaleString("en-US")} iterations`);
        logger.info(`>> Use compressed public key: ${config.useCompressedPublicKey}`);

        console.log("");
        logger.info(`Finding the private key of the address '${config.addressToFind}' within the range:`);
        logger.info(`>> Low: ${config.privateKeyLowRange.toLocaleString("en-US")}`);
        logger.info(`>> High: ${config.privateKeyHighRange.toLocaleString("en-US")}`);

        console.log("");
        const ghostIterations = `${BENCHMARK_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;
        logger.info(`Ghost execution (${ghostIterations}):`);
        this.generator.executeReport(this.ranger.executeFullRandom());

        console.log("");
        logger.info("Beginning the search...");
    };

    /**
     * Find a private key from a given Bitcoin address (defined inside the FINDER_CONFIG).
     * @returns The private key.
     */
    execute = (): void => {
        this.initialReport();

        // Statistics
        const initialTime = Date.now();

        // Internal variables
        let address: string;
        let privateKey = 0n;
        let found = false;

        for (let i = 1n; i <= config.privateKeyHighRange; i++) {
            privateKey = this.rangerExecuteFn();
            address = this.generator.execute(privateKey);

            // Report progress
            if (i % config.progressReportInterval === 0n) {
                // Formatted high range
                const formattedHighRange = config.privateKeyHighRange.toLocaleString("en-US");

                // Pad the index with zeros to match the high range length
                const paddedIndex = i.toLocaleString("en-US").padStart(formattedHighRange.length, " ");

                // Generate the progress part of the report
                const progress = `${paddedIndex}`;
                const progressPercentage = bigIntToPercentage(i, config.privateKeyHighRange, 2);

                // Elapsed time
                const rawElapsedTime = Date.now() - initialTime;
                const elapsedTime = formatTimestamp(rawElapsedTime);

                // Calculate the average addresses per second
                const aps = formatUnitPerTimeUnit(Math.round(Number(i) / (rawElapsedTime / 1000)));

                // Log the progress
                logger.info(`PRG: ${progress} | PRP: ${progressPercentage}% | APS: ${aps} | TIME: ${elapsedTime}`);
            }

            // Check if the address matches the one we're looking for
            if (address === config.addressToFind) {
                found = true;
                break;
            };
        }

        console.log("");

        // Report the result
        if (!found) {
            logger.error(`Couldn't find the private key of the address '${config.addressToFind}' within the given range!`);
        } else {
            logger.warn(`Found the private key of the address '${config.addressToFind}'!`);
            logger.warn(`>> Private key: ${bigintToPrivateKey(privateKey)}`);
        }

        console.log("");
    };
}