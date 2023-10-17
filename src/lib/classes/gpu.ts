import { GPU as GPUJS } from "gpu.js";

import SHA256Engine from "lib/crypto/sha256";


/**
 * Main class for GPU accelerated operations.
 *
 * Implements:
 * - [v] SHA-256
 */
export default class GPU {
    private gpuInstance: GPUJS;
    private sha256Engine: SHA256Engine;


    /**
     * Construct a new GPU instance.
     */
    constructor() {
        this.gpuInstance = new GPUJS();
        this.sha256Engine = new SHA256Engine(this.gpuInstance);
    }
}