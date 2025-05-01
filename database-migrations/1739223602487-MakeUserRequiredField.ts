import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserRequiredField1739223602487 implements MigrationInterface {
  name = 'MakeUserRequiredField1739223602487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_1efd762d8d88c94d42e2ea27181"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "coinToUserId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_to_user" DROP CONSTRAINT "FK_bb20e525decc337c0da146e904f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_to_user" DROP CONSTRAINT "FK_e1aa97e95b50fd35f9e25cb0d2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_to_user" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_1efd762d8d88c94d42e2ea27181" FOREIGN KEY ("coinToUserId") REFERENCES "coin_to_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_to_user" ADD CONSTRAINT "FK_bb20e525decc337c0da146e904f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_to_user" ADD CONSTRAINT "FK_e1aa97e95b50fd35f9e25cb0d2a" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
