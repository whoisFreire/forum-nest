import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest()

  return user as UserPayload
})
