import { Module } from '@nestjs/common'
import { BcryptHasherService } from './bcrypt-hasher.service'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { JwtEncrypterService } from './jwt-encrypter.service'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypterService,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasherService,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasherService,
    }
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator
  ],
  imports: [],
})
export class CryptographyModule {}
