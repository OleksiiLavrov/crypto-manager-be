import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req,
  ): Promise<TransactionDto> {
    const user = req.user;
    return this.transactionsService.create(createTransactionDto, user.id);
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // upload(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.transactionsService.parse(file);
  // }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const user = req.user;
    return this.transactionsService.update(+id, user.id, updateTransactionDto);
  }
}
