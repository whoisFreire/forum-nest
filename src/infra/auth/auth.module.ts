import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'

import { PrismaService } from '../database/prisma/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ EnvService ],
      imports: [ EnvModule ],
      global: true,
      useFactory(envService: EnvService) {
        const privateKey = Buffer.from(envService.get('JWT_PRIVATE_KEY'), 'base64')
        const publicKey = Buffer.from(envService.get('JWT_PUBLIC_KEY'), 'base64')
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
          },
        }
      }
    }) ],
  providers: [
    PrismaService,
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
})
export class AuthModule { }
