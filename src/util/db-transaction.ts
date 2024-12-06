import { DataSource, QueryRunner } from 'typeorm';

export const dbTransaction = async <T>(
  dataSource: DataSource,
  cb: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await cb(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
