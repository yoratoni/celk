import FINDER_CONFIG from "configs/finder.config";
import Generator from "lib/classes/generator";
import Ranger from "lib/classes/ranger";
import { tinyBenchmarkGenerator } from "utils/benchmark";
import { bigIntToTenPow } from "utils/conversions";
import logger from "utils/logger";
import { strInsert } from "utils/others";


/**
 * Used to find a private key from a given Bitcoin address.
 */
export default class Finder {
    private generator: Generator;
    private ranger: Ranger;

    private readonly addressToFind = FINDER_CONFIG.addressToFind;
    private readonly lowRange = FINDER_CONFIG.privateKeyRange.low;
    private readonly highRange = FINDER_CONFIG.privateKeyRange.high;


    /**
     * Construct a new Bitcoin address finder.
     * @param compressedPublicKey Whether to use the compressed public key or not (optional, defaults to true).
     */
    constructor(compressedPublicKey = true) {
        this.generator = new Generator(compressedPublicKey);
        this.ranger = new Ranger(this.lowRange, this.highRange);
    }

    private initialReport = (): void => {
        logger.info("Starting the Bitcoin address finder...");
        logger.info(`>> Address to find: ${this.addressToFind}`);
        logger.info(`>> Range: ${this.lowRange.toLocaleString("en-US")} => ${this.highRange.toLocaleString("en-US")}`);

        tinyBenchmarkGenerator(
            this.generator.execute,
            () => this.ranger.executeFullRandom()
        );
    };

    /**
     * Find a private key from a given Bitcoin address (defined inside the FINDER_CONFIG).
     * @returns The private key.
     */
    execute = (): void => {
        this.initialReport();

        let address: string;
        let privateKey: `0x${string}` = "0x0";
        let found = false;

        for (let i = 1n; i <= this.highRange; i++) {
            privateKey = this.ranger.executeFullRandom();
            address = this.generator.execute(privateKey);

            // Report progress
            if (i % BigInt(FINDER_CONFIG.progressReportInterval) === 0n) {
                // Formatted high range
                const formattedHighRange = this.highRange.toLocaleString("en-US");

                // Pad the index with zeros to match the high range length
                const paddedIndex = i.toLocaleString("en-US").padStart(formattedHighRange.length, " ");

                // Generate the progress part of the report
                const progress = `${paddedIndex} / ${formattedHighRange}`;

                // Calculate the progress percentage
                const progressPrcNumber = Number((i * bigIntToTenPow(this.highRange, FINDER_CONFIG.percentagesPrecision)) / this.highRange);

                // Calculate the decimal point padding
                const progressDecimalPointPadding = this.highRange.toString().length - progressPrcNumber.toString().length - 1;

                // Format it depending on progressPrcNumber decimal point position
                let progressPrc = "";

                if (progressDecimalPointPadding >= 0) {
                    // Pad the decimal point with zeros
                    progressPrc = `0.${"".padEnd(progressDecimalPointPadding, "0")}${progressPrcNumber}`;
                } else {
                    // Insert the decimal point at the right position
                    progressPrc = strInsert(progressPrcNumber.toString(), progressDecimalPointPadding * -1, ".");
                }

                // Log the progress
                logger.info(`Progress: ${progress} (${progressPrc}%) | LAST_PRV: ${privateKey} | LAST_ADR: ${address}`);
            }

            // Check if the address matches the one we're looking for
            if (address === this.addressToFind) {
                found = true;
                break;
            };
        }

        // Report the result
        if (!found) {
            logger.error(`Couldn't find the private key of the address '${this.addressToFind}' within the given range!`);
        } else {
            console.log("");
            logger.warn(`Found the private key of the address '${this.addressToFind}'!`);
            logger.warn(`>> Private key: ${privateKey}`);
        }
    };
}