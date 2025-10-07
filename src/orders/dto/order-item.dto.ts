import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
