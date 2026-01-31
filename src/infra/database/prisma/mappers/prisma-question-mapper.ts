import { Question as PrismaQuestion } from 'prisma/generated/prisma/client'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create({
      authorId: new UniqueEntityId(raw.authorId),
      title: raw.title,
      content: raw.content,
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
    new UniqueEntityId(raw.id)
    )
  }
}
