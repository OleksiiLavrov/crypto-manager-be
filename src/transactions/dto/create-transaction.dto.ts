import { OmitType } from '@nestjs/swagger';

export class CreateTransactionDto {
  public coinName: string;
  public amount: number;
  public cost: number;
}

export class ExtendedCreateTransactionDto extends OmitType(
  CreateTransactionDto,
  ['coinName'],
) {
  public userId: number;
  public coinToUserId: number;
  public coinId: number;
}
