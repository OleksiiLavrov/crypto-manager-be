import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateTransactionsToCoinToUser1739219694333 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          INSERT INTO "user" ("name", "email", "password")
          VALUES ('admin', 'admin@admin.com', 'admin')
        `);

        await queryRunner.query(`
            INSERT INTO "coin_to_user" ("coinId", "amount", "invested")
            SELECT 
              "coinId", 
              SUM("amount") as "amount", 
              SUM("cost") as "invested"
            FROM "transaction"
            GROUP BY "coinId"
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
