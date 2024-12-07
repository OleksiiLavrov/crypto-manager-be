import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateAndUpdateDates1733529115070
  implements MigrationInterface
{
  name = 'AddCreateAndUpdateDates1733529115070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coin" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "updatedAt"`);
  }
}
