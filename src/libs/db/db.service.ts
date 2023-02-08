import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { schemaV1 } from './db.schema';
import { SqLiteService } from './sq-lite.service';

const DB_NAME = 'vowdocs';
const DB_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class DbService {
  private db: SQLiteDBConnection;
  constructor(private readonly sqLite: SqLiteService) {}

  async init(secretKey: string) {
    if (this.db) {
      throw new Error('Db is already initialized');
    }

    await this.sqLite.addUpgradeStatement(DB_NAME, DB_VERSION, [schemaV1]);

    if (this.sqLite.native) {
      await this.sqLite.sqlite.setEncryptionSecret(secretKey);
      this.db = await this.sqLite.openDatabase(
        DB_NAME,
        true,
        'secret',
        DB_VERSION,
        false
      );
    } else {
      this.db = await this.sqLite.openDatabase(
        DB_NAME,
        false,
        'no-encryption',
        DB_VERSION,
        false
      );
    }
  }

  async runCommand(command: string, params: any[]) {
    const result = await this.db.run(command, params);
    if (this.isWeb) {
      await this.sqLite.saveToStore(DB_NAME);
    }
    return result;
  }

  runQuery(command: string) {
    return this.db.query(command);
  }

  private get isWeb() {
    return this.sqLite.platform === 'web';
  }
}
