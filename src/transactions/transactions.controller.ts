import {
  Body,
  Controller, // FileTypeValidator,
  // Get,
  Param, // ParseFilePipe,
  Post,
  Put,
  Req, // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/:userId')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Param('userId') userId: string,
    // @Req() req: Request,
  ): Promise<TransactionDto> {
    // const user = req.user as UserDto;
    return this.transactionsService.create(createTransactionDto, +userId);
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.update(+id, +userId, updateTransactionDto);
  }
}
