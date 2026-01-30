import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { UserPayload } from '../auth/jwt.strategy'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body() body: CreateQuestionBody) {
    return { body }
  }
}
