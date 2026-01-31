import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
    })

    const hashedPassword = await fakeHasher.hash('securepassword')

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0].password).toEqual(hashedPassword)
  })
})
