import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import z from 'zod'
import { Injectable } from '@nestjs/common'
import { Env } from '../env'

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

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

  validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
