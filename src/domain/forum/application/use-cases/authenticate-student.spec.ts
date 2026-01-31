import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(inMemoryRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'example@email.com',
      password: await fakeHasher.hash('123456789'),
    })

    inMemoryRepository.items.push(student)

    const result = await sut.execute({
      email: 'example@email.com',
      password: '123456789',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
