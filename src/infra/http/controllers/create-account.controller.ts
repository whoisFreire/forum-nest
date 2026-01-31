import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { hash } from 'bcrypt'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBody) {
    const { email, name, password } = body
    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const hashedPassword = await hash(password, 8)
    await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })
  }
}
