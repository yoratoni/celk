import { Db, MongoClient } from "mongodb";
import { sys } from "typescript";

import logger from "utils/logger";


/**
 * Connect to MongoDB.
 * @param databaseName The name of the database to connect to.
 * @returns The MongoDB database.
 */
export const connectToDB = async (
    dbName = process.env.MONGODB_DB
): Promise<{ mongoClient: MongoClient; mongoDB: Db } | undefined> => {
    const uri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/?authMechanism=SCRAM-SHA-256&tls=true`;
    const mongoClient = new MongoClient(uri, {});

    try {
        await mongoClient.connect();

        const listOfDatabases = await mongoClient.db().admin().listDatabases();

        // Verify if the database exist inside the MongoDB cluster
        if (listOfDatabases.databases.some((database) => database.name === dbName)) {
            logger.verbose(`Database [${dbName}] found.`);
        } else {
            logger.error(`[MONGODB] Database [${dbName}] not found.`);
            sys.exit(1);
        }

        const mongoDB = mongoClient.db(dbName);

        logger.info(`Successfully connected to the MongoDB database [${dbName}].`);

        return {
            mongoClient: mongoClient,
            mongoDB: mongoDB
        };
    } catch (error) {
        logger.error(`[MONGODB] Error while connecting to the MongoDB database:\n${error}.`);
        sys.exit(1);
    }
};

/**
 * Close the MongoDB connection.
 * @param mongoClient The MongoDB client.
 */
export const closeDBConnection = async (mongoClient: MongoClient): Promise<void> => {
    try {
        if (mongoClient !== null) {
            await mongoClient.close();
        }

        logger.verbose("Successfully closed the database connection.");
    } catch (error) {
        logger.error(`[MONGODB] Error while closing the database connection:\n${error}.`);
    }
};