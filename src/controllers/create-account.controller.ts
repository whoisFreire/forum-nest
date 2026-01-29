import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: { email: string, name: string, password: string }) {
    const { email, name, password } = body
    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    await this.prismaService.user.create({
      data: {
        email,
        name,
        password
      }
    })
  }
}
