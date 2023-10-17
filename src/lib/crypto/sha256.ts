/*
 * A GPU accelerated TypeScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2.
 *
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet.
 * Distributed under the BSD License.
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 *
 * Based on the SHA256 pseudocode from Wikipedia.
 * See https://en.wikipedia.org/wiki/SHA-2
 * Also https://csrc.nist.gov/files/pubs/fips/180-4/final/docs/fips180-4.pdf
 */

import { GPU as GPUJS } from "gpu.js";


/**
 * GPU accelerated SHA-256 engine, supplying the final SHA-256 function.
 */
export default class SHA256Engine {
    private _gpuInstance: GPUJS;
    private _encoder: TextEncoder;


    /**
     * Construct a new SHA-256 engine.
     */
    constructor(gpuInstance: GPUJS) {
        this._gpuInstance = gpuInstance;
        this._encoder = new TextEncoder();
    }


    /**
     * Encode a string as UTF-8.
     * @param str The string to encode.
     * @returns The UTF-8 encoded string as an Uint8Array.
     */
    strToUTF8(str: string): Uint8Array {
        const utf8 = new Uint8Array(str.length);

        console.log("AAAAAA", this);
        // this._encoder.encodeInto(str, utf8);

        return utf8;
    }

    /**
     * Encode a string as UTF-16.
     * @param str The string to encode.
     * @returns The UTF-16 encoded string as an Uint16Array.
     */
    strToUTF16(str: string): Uint16Array {
        const utf16 = new Uint16Array(str.length);

        for (let i = 0; i < str.length; i++) {
            utf16[i] = str.charCodeAt(i);
        }

        return utf16;
    }
}