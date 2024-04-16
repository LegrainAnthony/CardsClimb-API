import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from 'src/common/decorators/user-id.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() user: SignUpDto) {
    return this.authenticationService.signUp(user);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() user: SignInDto) {
    return this.authenticationService.signIn(user);
  }

  @RefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @ActiveUser() userId: number,
  ) {
    return this.authenticationService.refreshTokens(refreshTokenDto, userId);
  }
}
