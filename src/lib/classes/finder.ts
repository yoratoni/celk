import BENCHMARK_CONFIG from "configs/benchmark.config";
import config from "configs/finder.config";
import { addressToRIPEMD160 } from "helpers/conversions";
import { bigIntDiv, bigIntLength } from "helpers/maths";
import Generator from "lib/classes/generator";
import Ranger from "lib/classes/ranger";
import { bigintToPrivateKey, formatUnitPerTimeUnit } from "utils/formats";
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

    private generatorInfo: {
        inputType: "PUBLIC_KEY" | "RIPEMD-160";
        untouchedInput: string;
        input: Buffer;
    };

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

        // Check if addressToFind or publicKeyToFind is defined
        if (typeof config.addressToFind !== "string" && typeof config.publicKeyToFind !== "string") {
            throw new Error("[FINDER] Either addressToFind or publicKeyToFind must be defined!");
        }

        // Prepare the generator info (default args)
        this.generatorInfo = {
            inputType: "PUBLIC_KEY",
            untouchedInput: "",
            input: Buffer.alloc(0)
        };

        // Address or public key, both converted to Buffer in the end
        if (typeof config.publicKeyToFind === "string" && (config.publicKeyToFind as string).length > 0) {
            this.generatorInfo.inputType = "PUBLIC_KEY";
            this.generatorInfo.untouchedInput = config.publicKeyToFind;

            // Convert the public key to Buffer (supports 0x prefix)
            if (config.publicKeyToFind.startsWith("0x")) {
                this.generatorInfo.input = Buffer.from(config.publicKeyToFind.slice(2), "hex");
            } else {
                this.generatorInfo.input = Buffer.from(config.publicKeyToFind, "hex");
            }
        } else {
            this.generatorInfo.inputType = "RIPEMD-160";
            this.generatorInfo.untouchedInput = config.addressToFind as string;

            // Decode the BASE58 address
            this.generatorInfo.input = addressToRIPEMD160(config.addressToFind as string);
        }
    }

    /**
     * The initial report.
     */
    private initialReport = (): void => {
        logger.info("Starting the Bitcoin address finder.");
        logger.info(`>> Private key generation mode: '${config.privateKeyGenMode}'`);
        logger.info(`>> Progress report interval: ${config.progressReportInterval.toLocaleString("en-US")} iterations`);
        logger.info(`>> Use compressed public key: ${config.useCompressedPublicKey}`);
        logger.info(`>> Public key to find: ${this.generatorInfo.inputType === "PUBLIC_KEY" ? this.generatorInfo.untouchedInput : "N/A"}`);
        logger.info(`>> Address to find: ${this.generatorInfo.inputType === "RIPEMD-160" ? this.generatorInfo.untouchedInput : "N/A"}`);

        if (this.generatorInfo.inputType === "RIPEMD-160") {
            logger.info(`>> RIPEMD-160 hash of this address: 0x${this.generatorInfo.input.toString("hex")}`);
        }

        console.log("");
        logger.info("Private keys generated within the range:");
        logger.info(`>> Low: ${config.privateKeyLowRange.toLocaleString("en-US")}`);
        logger.info(`>> High: ${config.privateKeyHighRange.toLocaleString("en-US")}`);

        console.log("");
        const ghostIterations = `${BENCHMARK_CONFIG.generatorGhostExecutionIterations.toLocaleString("en-US")} ghost executions`;
        logger.info(`Ghost execution (${ghostIterations}):`);
        this.generator.executeReport(this.ranger.executeFullRandom(), this.generatorInfo.inputType);

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
        let privateKey: bigint;
        let found: boolean;

        // for (let i = 1n; i <= loopLimit; i++) {
        //     privateKey = this.rangerExecuteFn();
        //     // value = this.generator.execute(privateKey, this.generatorInfo.inputType) as Buffer;

        //     // Progress report
        //     if (i % config.progressReportInterval === 0n) {
        //         this.progressReport(i, initialTime);
        //     }

        //     // Check if the value matches the one we're looking for
        //     // if (this.generatorInfo.input.equals(value)) {
        //     //     found = true;
        //     //     break;
        //     // };
        // }

        console.log("");

        // Report the result
        // if (!found) {
        //     logger.error(`Couldn't find the private key of '${this.generatorInfo.untouchedInput}' within the given range!`);
        //     logger.error(">> If you're using the \"FULL_RANDOM\" mode, try increasing the range.");
        // } else {
        //     logger.warn(`Found the private key of '${this.generatorInfo.untouchedInput}'!`);
        //     logger.warn(`>> Private key: ${bigintToPrivateKey(privateKey)}`);
        // }

        console.log("");
    };
}