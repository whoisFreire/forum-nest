import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from '../env'
import z from 'zod'
import { Injectable } from '@nestjs/common'

const tokenSchema = z.object({
  sub: z.uuid(),
})

type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = Buffer.from(config.get('JWT_PUBLIC_KEY', { infer: true }), 'base64')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: [ 'RS256' ],
    })
  }

  validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
