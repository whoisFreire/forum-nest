import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '../env'
import { AuthenticateController } from '../controllers/authenticate.controller'
import { PrismaService } from '../prisma/prisma.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ ConfigService ],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = Buffer.from(config.get('JWT_PRIVATE_KEY', { infer: true }), 'base64')
        const publicKey = Buffer.from(config.get('JWT_PUBLIC_KEY', { infer: true }), 'base64')
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
          },
        }
      }
    }) ],
  controllers: [ AuthenticateController ],
  providers: [ PrismaService, JwtStrategy ],
})
export class AuthModule { }
