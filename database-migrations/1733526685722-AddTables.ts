import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTables1733526685722 implements MigrationInterface {
  name = 'AddTables1733526685722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "coinId" integer NOT NULL, "coinAmount" double precision NOT NULL, "totalCost" double precision NOT NULL, "coinName" character varying NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coin" ("id" SERIAL NOT NULL, "totalAmount" double precision NOT NULL, "totalInvested" double precision NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_650993fc71b789e4793b62fbcac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_830c5089eb6ff83f5bcc3ec3d3c" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_830c5089eb6ff83f5bcc3ec3d3c"`,
    );
    await queryRunner.query(`DROP TABLE "coin"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
