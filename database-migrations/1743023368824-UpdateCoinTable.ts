import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoinTable1743023368824 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "marketCap"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coin" ADD "price" integer`);
    await queryRunner.query(`ALTER TABLE "coin" ADD "marketCap" integer`);
  }
}
