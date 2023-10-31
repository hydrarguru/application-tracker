import { openDB, DBSchema } from 'idb';

const DATABASE_NAME = 'JAT-DB';
const DATABASE_TABLE = 'jobsTable'

export interface JobDB extends DBSchema {
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
    await openDB<JobDB>(DATABASE_NAME, 1, {
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
        },
    });
}

/**
 * Add a job application to the database.
 * @param job The job application object to add.
 */
export function addJobToDatabase(job: JobData) {
    openDB(DATABASE_NAME, 1).then((db) => {
        const transaction = db.transaction(DATABASE_TABLE, 'readwrite');
        const store = transaction.objectStore(DATABASE_TABLE);
        store.add(job);
    });
}

/**
 * Delete a job application from the database.
 * @param id The id of the job application to delete.
 */
export function deleteJobFromDatabase(id: number) {
    openDB(DATABASE_NAME, 1).then((db) => {
        const transaction = db.transaction(DATABASE_TABLE, 'readwrite');
        const store = transaction.objectStore(DATABASE_TABLE);
        store.delete(id);
    });
}

/**
 * @returns A promise that resolves to an array of job application objects.
 */
export async function getJobsFromDatabase(): Promise<any[]> {
    const db = await openDB(DATABASE_NAME, 1);
    const transaction = db.transaction(DATABASE_TABLE, 'readonly');
    const store = transaction.objectStore(DATABASE_TABLE);
    return await store.getAll();
}

/**
 * Get a job application from the database.
 * @param id The id of the job application to get.
 * @returns A job application object from the database.
 */
export function getJobFromDatabase(id: number) {
    return openDB(DATABASE_NAME, 1).then((db) => {
        const transaction = db.transaction(DATABASE_TABLE, 'readonly');
        const store = transaction.objectStore(DATABASE_TABLE);
        return store.get(id);
    });
}
