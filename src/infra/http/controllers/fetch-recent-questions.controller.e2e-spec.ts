import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile()

    app = moduleRef.createNestApplication()
    prismaService = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456789'
      }
    })
    const accessToken = jwtService.sign({ sub: user.id })

    await prismaService.question.createMany({
      data: [
        {
          title: 'First question',
          content: 'Content of the first question',
          slug: 'first-question',
          authorId: user.id
        },
        {
          title: 'Second question',
          content: 'Content of the second question',
          slug: 'second-question',
          authorId: user.id
        }
      ]
    })

    const response = await request(app.getHttpServer()).get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'First question' }),
        expect.objectContaining({ title: 'Second question' })
      ]
    })
  })
})
