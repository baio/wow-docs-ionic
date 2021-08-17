import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { schemaV1 } from './db.schema';
import { SqLiteService } from './sq-lite.service';

@Injectable({ providedIn: 'root' })
export class DbService {
  private db: SQLiteDBConnection;
  constructor(private readonly sqLite: SqLiteService) {}

  async init(secretKey: string) {
    if (this.db) {
      throw new Error('Db is already initialized');
    }
    const dbName = 'vowdocs';

    await this.sqLite.checkConnectionsConsistency();
    await this.sqLite.sqlite.setEncryptionSecret(secretKey);
    this.db = await this.sqLite.createConnection(dbName, true, 'secret', 1);

    // await this.db.delete();
    await this.db.open();

    // create tables in db
    const execSchemaResult = await this.db.execute(schemaV1);
    console.log(
      '$$$ ret.changes.changes in db ' + execSchemaResult.changes.changes
    );

    if (execSchemaResult.changes.changes < 0) {
      return Promise.reject(new Error('Execute createSyncTable failed'));
    } else if (execSchemaResult.changes.changes > 0) {
      const now = new Date().toISOString();
      await this.db.setSyncDate(now);
      console.log('$$$ schema synced ', now);
    }
  }

  runCommand(command: string, params: any[]) {
    return this.db.run(command, params);
  }

  runQuery(command: string) {
    return this.db.query(command);
  }
}
