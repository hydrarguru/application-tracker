import { openDB, DBSchema } from 'idb';

const DATABASE_NAME = 'JAT-DB';
const DATABASE_TABLE = 'jobsTable'

interface JobDB extends DBSchema {
    jobsTable: {
        key: number;
        value: {
            companyName: string;
            jobRole: string;
            jobArea: string;
            applicationLink: string;
            appliedDate: string;
        };
        indexes: {
            companyName: string;
            jobRole: string;
            jobArea: string;
            applicationLink: string;
            appliedDate: string;
        };
    };
}

type JobData = {
    companyName: string;
    jobRole: string;
    jobArea: string;
    applicationLink: string;
    appliedDate: string;
};

export async function createDatabase() {
    openDB<JobDB>(DATABASE_NAME, 1, {
        upgrade(db) {
            const store = db.createObjectStore(DATABASE_TABLE, {
                keyPath: 'id',
                autoIncrement: true,
            });
            store.createIndex('companyName', 'companyName');
            store.createIndex('jobRole', 'jobRole');
            store.createIndex('jobArea', 'jobArea');
            store.createIndex('applicationLink', 'applicationLink');
            store.createIndex('appliedDate', 'appliedDate');
            console.log(`(db.ts) ${DATABASE_NAME} database initialised`);
        },
    });
}

/**
 * Add a job application to the database.
 * @param job The job application object to add.
 */
export async function addJobToDatabase(job: JobData) {
    const db = await openDB(DATABASE_NAME, 1);
    const transaction = db.transaction(DATABASE_TABLE, 'readwrite');
    const store = transaction.objectStore(DATABASE_TABLE);
    store.add(job);
    console.log('(db.ts) Job added to database');
}

/**
 * Delete a job application from the database.
 * @param id The id of the job application to delete.
 */
export async function deleteJobFromDatabase(id: number) {
    const db = await openDB(DATABASE_NAME, 1);
    const transaction = db.transaction(DATABASE_TABLE, 'readwrite');
    const store = transaction.objectStore(DATABASE_TABLE);
    store.delete(id);
    console.log('(db.ts) Job deleted from database');
}

/**
 * @returns A promise that resolves to an array of job application objects.
 */
export async function getJobsFromDatabase() {
    const db = await openDB(DATABASE_NAME, 1);
    const transaction = db.transaction(DATABASE_TABLE, 'readonly');
    const store = transaction.objectStore(DATABASE_TABLE);
    db.close();
    console.log('(db.ts) Jobs retrieved from database');
    return await store.getAll();
}

/**
 * Get a job application from the database.
 * @param id The id of the job application to get.
 * @returns A job application object from the database.
 */
export async function getJobFromDatabase(id: number) {
    const db = await openDB(DATABASE_NAME, 1);
    const transaction = db.transaction(DATABASE_TABLE, 'readonly');
    const store = transaction.objectStore(DATABASE_TABLE);
    console.log(`(db.ts) Job ${id} retrieved from database`);
    return store.get(id);
}
