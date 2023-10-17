declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_HOST: string;
            MONGODB_USER: string;
            MONGODB_PASS: string;
            MONGODB_DB: string;
        }
    }
}


export { };