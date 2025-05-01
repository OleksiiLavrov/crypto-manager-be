import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoinTable1739136822451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "totalAmount"`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "totalInvested"`);
    await queryRunner.query(`ALTER TABLE "coin" ADD "price" integer`);
    await queryRunner.query(`ALTER TABLE "coin" ADD "marketCap" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "marketCap"`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "coin" ADD "totalInvested" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin" ADD "totalAmount" double precision NOT NULL`,
    );
  }
}
