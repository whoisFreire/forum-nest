import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaStudent } from 'prisma/generated/prisma/client'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create({
      email: raw.email,
      name: raw.name,
      password: raw.password
    },
    new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
