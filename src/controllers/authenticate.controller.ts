import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'
import { PrismaService } from '../prisma/prisma.service'
import { compare } from 'bcrypt'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() body: AuthenticateBody) {
    const { email, password } = body

    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('user credentials are invalid')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('user credentials are invalid')
    }

    const accessToken = this.jwtService.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
