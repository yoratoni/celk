// import logger from "utils/logger";

// /**
//  * Used to generate a private key between a given range.
//  */
// export default class Ranger {
//     private low: bigint;
//     private high: bigint;
//     private highLength: number;

//     private minHexIndexes: number[];
//     private maxHexIndexes: number[];

//     private currAscending: bigint;
//     private currDescending: bigint;

//     private readonly ZERO_PAD: `0x${string}`;
//     private readonly HEX = "0123456789ABCDEF";


//     /**
//      * Construct a new Ranger (Bitcoin private key generator).
//      * @param low The low range to generate the private key from.
//      * @param high The high range to generate the private key from.
//      */
//     constructor(low: bigint, high: bigint) {
//         this.low = low;
//         this.high = high;
//         this.highLength = this.high.toString(16).length;

//         this.minHexIndexes = [];
//         this.maxHexIndexes = [];

//         // Calculate the minimum hex indexes for the private key
//         // Matching the maximum hex indexes table length
//         const lowHexStr = this.low.toString(16);

//         for (let i = 0; i < this.highLength; i++) {
//             this.minHexIndexes.push(
//                 this.HEX.indexOf(lowHexStr[i]?.toUpperCase() ?? 0)
//             );
//         }

//         // Calculate the maximum hex indexes for the private key
//         const highHexStr = this.high.toString(16);

//         for (let i = 0; i < this.highLength; i++) {
//             this.maxHexIndexes.push(
//                 this.HEX.indexOf(highHexStr[i].toUpperCase())
//             );
//         }

//         this.currAscending = this.low;
//         this.currDescending = this.high;

//         // Calculate the zero padding for the private key
//         this.ZERO_PAD = "0x".padEnd(66 - this.highLength, "0") as `0x${string}`;
//     }


//     /**
//      * **[FULL RANDOM]** Generate a private key between a given range (defined in the constructor).
//      * @returns The private key.
//      */
//     executeFullRandom = (): `0x${string}` => {
//         let privateKey = this.ZERO_PAD;

//         for (let i = 0; i < this.highLength; i++) {
//             const randInRange = Math.floor(Math.random() * (this.maxHexIndexes[i] - this.minHexIndexes[i] + 1)) + this.minHexIndexes[i];

//             privateKey += this.HEX[randInRange];
//         }

//         // Check if the generated private key is in the range
//         if (BigInt(privateKey) < this.low || BigInt(privateKey) > this.high) {
//             logger.warn(`Generated private key is out of bounds (${this.low} - ${this.high}).`);
//         }

//         return privateKey as `0x${string}`;
//     };

//     /**
//      * **[ASCENDING]** Generate a private key between a given range (defined in the constructor).
//      * @returns The private key.
//      */
//     executeAscending = (): `0x${string}` => {
//         if (this.currAscending <= this.high) {
//             const padded = this.currAscending.toString(16).padStart(this.highLength, "0");

//             // Padded with zeroes at the end
//             let privateKey = (this.ZERO_PAD + padded) as `0x${string}`;
//             privateKey = privateKey.padEnd(66, "0") as `0x${string}`;

//             this.currAscending++;
//             return privateKey;
//         }

//         console.log("");
//         logger.error("The private key range has been exceeded, resetting the current value to the low range.");
//         console.log("");

//         this.currAscending = this.low;

//         return this.executeAscending();
//     };

//     /**
//      * **[DESCENDING]** Generate a private key between a given range (defined in the constructor).
//      * @returns The private key.
//      */
//     executeDescending = (): `0x${string}` => {
//         if (this.currDescending >= this.low) {
//             const padded = this.currDescending.toString(16).padStart(this.highLength, "0");

//             // Padded with zeroes at the end
//             let privateKey = (this.ZERO_PAD + padded) as `0x${string}`;
//             privateKey = privateKey.padEnd(66, "0") as `0x${string}`;

//             this.currDescending--;
//             return privateKey;
//         }

//         console.log("");
//         logger.error("The private key range has been exceeded, resetting the current value to the high range.");
//         console.log("");

//         this.currDescending = this.high;

//         return this.executeAscending();
//     };
// }