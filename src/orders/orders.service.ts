/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { PRODUCT_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productIds = createOrderDto.items.map((item) => item.productId);

      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItems: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                productId: orderItem.productId,
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          OrderItems: {
            select: {
              productId: true,
              price: true,
              quantity: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItems: order.OrderItems.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: error.status,
        message: error.message,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page = 1, limit = 10, status } = orderPaginationDto;

    const totalPages = await this.order.count({
      where: { status },
    });

    const orders = await this.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { status },
    });

    return {
      data: orders,
      meta: {
        total: totalPages,
        page: page,
        lastPage: Math.ceil(totalPages / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: { id },
      include: {
        OrderItems: {
          select: {
            productId: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    if (!order)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });

    const productIds = order.OrderItems.map((orderItem) => orderItem.productId);

    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    return {
      ...order,
      OrderItems: order.OrderItems.map((orderItem) => ({
        ...orderItem,
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if (order.status === status) return order;

    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
