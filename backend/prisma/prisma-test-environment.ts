import { exec } from "node:child_process";
import NodeEnvironment from "jest-environment-node";
import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";
import { Client } from "pg";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import * as dotenv from "dotenv";
import * as path from "node:path";

dotenv.config();

const execSync = promisify(exec)

const prismaBinary = "./node_modules/.bin/prisma";
const relativePrismaBinary = path.resolve(process.cwd(), prismaBinary);

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    const dbUser = process.env.POSTGRES_USER;
    const dbPass = process.env.POSTGRES_PASSWORD
    const dbHost = process.env.POSTGRES_HOST;
    const dbPort = process.env.POSTGRES_LOCAL_PORT;
    const dbName = process.env.POSTGRES_DB;

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${relativePrismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
