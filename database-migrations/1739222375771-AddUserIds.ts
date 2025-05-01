import { MigrationInterface, QueryRunner } from "typeorm";
import { CoinToUser } from "src/coins/entity/coin-to-user.entity";
import { User } from "src/users/entities/user.entity";
import { Transaction } from "src/transactions/entity/transaction.entity";

export class AddUserIds1739222375771 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = await queryRunner.manager.findOne(User, { where: { email: "admin@admin.com" } });
        const coinToUsers = await queryRunner.manager.find(CoinToUser);
        const transactions = await queryRunner.manager.find(Transaction);

        for (const transaction of transactions) {
            const coinToUser = coinToUsers.find(c => c.coinId === transaction.coinId);
            if (coinToUser) {
                transaction.coinToUserId = coinToUser.id;
                transaction.userId = user.id;
            }
        }

        coinToUsers.forEach(coinToUser => {
            coinToUser.userId = user.id;
        });

        await queryRunner.manager.save(coinToUsers);
        await queryRunner.manager.save(transactions);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
