import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoinToUserAndUpdateTransactionsTable1739219403301 implements MigrationInterface {
    name = 'AddCoinToUserAndUpdateTransactionsTable1739219403301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_830c5089eb6ff83f5bcc3ec3d3c"`);
        await queryRunner.query(`CREATE TABLE "coin_to_user" (
            "id" SERIAL NOT NULL, 
            "userId" integer, 
            "coinId" integer NOT NULL, 
            "amount" double precision NOT NULL, 
            "invested" double precision NOT NULL, 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_a26a234c0a713a8ae15194ee480" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "coinAmount" TO "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME COLUMN "totalCost" TO "cost"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "coinName"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "coinToUserId" integer`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1efd762d8d88c94d42e2ea27181" FOREIGN KEY ("coinToUserId") REFERENCES "coin_to_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coin_to_user" ADD CONSTRAINT "FK_bb20e525decc337c0da146e904f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coin_to_user" ADD CONSTRAINT "FK_e1aa97e95b50fd35f9e25cb0d2a" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
