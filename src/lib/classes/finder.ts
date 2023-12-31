import BENCHMARKS_CONFIG from "configs/benchmarks.config";
import config from "configs/finder.config";
import Cache from "helpers/cache";
import { addressToRIPEMD160 } from "helpers/conversions";
import { bigIntDiv, bigIntLength } from "helpers/maths";
import Generator from "lib/classes/generator";
import { bigintToPrivateKey, formatUnitPerTimeUnit } from "utils/formats";
import logger from "utils/logger";


/**
 * Used to find a private key from a given Bitcoin address.
 */
export default class Finder {
    private generator: Generator;

    private generatorInfo: {
        inputType: "PUBLIC_KEY" | "RIPEMD-160";
        untouchedInput: string;
        input: Cache;
    };


    /**
     * Construct a new Bitcoin address finder (based on FINDER_CONFIG).
     */
    constructor() {
        // Check if addressToFind or publicKeyToFind is defined
        if (typeof config.addressToFind !== "string" && typeof config.publicKeyToFind !== "string") {
            throw new Error("[FINDER] Either 'addressToFind' or 'publicKeyToFind' must be defined");
        }

        // Prepare the generator info (default args)
        this.generatorInfo = {
            inputType: "PUBLIC_KEY",
            untouchedInput: "",
            input: Cache.alloc(0)
        };

        // Address or public key, both converted to a cache in the end
        if (typeof config.publicKeyToFind === "string" && (config.publicKeyToFind as string).length > 0) {
            this.generatorInfo.inputType = "PUBLIC_KEY";
            this.generatorInfo.untouchedInput = config.publicKeyToFind;

            let publicKeyToFind: `0x${string}`;

            if ((config.publicKeyToFind as string).startsWith("0x")) {
                publicKeyToFind = config.publicKeyToFind as `0x${string}`;
            } else {
                publicKeyToFind = `0x${config.publicKeyToFind as string}`;
            }

            // Convert the public key to a cache
            this.generatorInfo.input = Cache.fromHex(publicKeyToFind);
        } else {
            this.generatorInfo.inputType = "RIPEMD-160";
            this.generatorInfo.untouchedInput = config.addressToFind as string;

            // Decode the BASE58 address
            this.generatorInfo.input = addressToRIPEMD160(config.addressToFind as string);
        }

        this.generator = new Generator(
            config.privateKeyGenMode,
            config.privateKeyLowRange,
            config.privateKeyHighRange,
            config.publicKeyGenMode,
            this.generatorInfo.inputType
        );
    }

    /**
     * The initial report.
     */
    private initialReport = (): void => {
        logger.info("Starting the Bitcoin address finder.");
        logger.info(`>> Progress report interval: ${config.progressReportInterval.toLocaleString("en-US")} iterations`);
        logger.info(`>> Private key generation mode: '${config.privateKeyGenMode}'`);
        logger.info(`>> Public key generation mode: '${config.publicKeyGenMode}'`);
        logger.info(`>> Public key to find: ${this.generatorInfo.inputType === "PUBLIC_KEY" ? `'${this.generatorInfo.untouchedInput}'` : "N/A"}`);
        logger.info(`>> Address to find: ${this.generatorInfo.inputType === "RIPEMD-160" ? `'${this.generatorInfo.untouchedInput}'` : "N/A"}`);

        if (this.generatorInfo.inputType === "RIPEMD-160") {
            logger.info(`>> RIPEMD-160 hash of this address: 0x${this.generatorInfo.input.toString("hex")}`);
        }

        console.log("");
        logger.info("Private keys generated within the range:");
        logger.info(`>> Low: ${config.privateKeyLowRange.toLocaleString("en-US")}`);
        logger.info(`>> High: ${config.privateKeyHighRange.toLocaleString("en-US")}`);

        console.log("");
        const ghostIterations = `${BENCHMARKS_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;
        logger.info(`Ghost execution (${ghostIterations}):`);
        this.generator.executeReport();

        console.log("");
        logger.info("Beginning the search...");
    };

    /**
     * Generate a progress report.
     * @param index The current index.
     * @param initialTime The initial time.
     */
    private progressReport = (index: bigint, initialTime: number): void => {
        // Progress
        const progress = formatUnitPerTimeUnit(Number(index), null, null, 8);

        // Generate the percentage part of the report (automatic precision based on high range length)
        const progressPercentage = bigIntDiv(index, config.privateKeyHighRange, bigIntLength(config.privateKeyHighRange)).str;

        // Calculate the average addresses per second
        const rawElapsedTime = Date.now() - initialTime;
        const aps = formatUnitPerTimeUnit(Math.round(Number(index) / (rawElapsedTime / 1000)));

        // Log the progress
        logger.info(`PRG: ${progress} | PRP: ${progressPercentage}% | APS: ${aps}`);
    };

    /**
     * Find a private key from a given Bitcoin address (defined inside the FINDER_CONFIG).
     * @returns The private key.
     */
    execute = (): void => {
        this.initialReport();

        // No loop limit if the mode is FULL_RANDOM
        const loopLimit = config.privateKeyGenMode === "FULL_RANDOM" ? 2n ** 256n : config.privateKeyHighRange;

        // Initial time
        const initialTime = Date.now();

        // Internal variables
        let found = false;
        let res: { privateKey: bigint; value: Cache | string; } = { privateKey: 0n, value: Cache.alloc(0) };

        // Main loop
        for (let i = 1n; i <= loopLimit; i++) {
            res = this.generator.execute();

            // Progress report
            if (i % config.progressReportInterval === 0n) {
                this.progressReport(i, initialTime);
            }

            // Check if the value matches the one we're looking for
            if (this.generatorInfo.input.equals(res.value as Cache)) {
                found = true;
                break;
            };
        }

        console.log("");

        // Report the result
        if (!found) {
            logger.error(`Couldn't find the private key of '${this.generatorInfo.untouchedInput}' within the given range!`);
        } else {
            logger.warn(`Found the private key of '${this.generatorInfo.untouchedInput}'!`);
            logger.warn(`>> Private key: ${bigintToPrivateKey(res.privateKey)}`);
        }

        console.log("");
    };
}