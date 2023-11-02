declare global {
    /**
     * Makes the Uint8Array constructor input type more permissive.
     */
    interface Uint8ArrayConstructor {
        new (input: number | ArrayLike<number> | ArrayBufferLike): Uint8Array;
    }

    namespace NodeJS {
        /**
         * Environment variables.
         */
        interface ProcessEnv {
            MONGODB_HOST: string;
            MONGODB_USER: string;
            MONGODB_PASS: string;
            MONGODB_DB: string;
        }
    }
}


export { };