import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from 'src/common/decorators/user-id.decorator';
import {
  REFRESH_TOKEN_KEY,
  RefreshToken,
} from 'src/common/decorators/refresh-token.decorator';
import { Request } from 'express';

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

  @Post('sign-out')
  signOut(@ActiveUser() userId: number, @Req() req: Request) {
    const refreshToken = req[REFRESH_TOKEN_KEY] as string;
    return this.authenticationService.signOut(userId, refreshToken);
  }

  @RefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @ActiveUser() userId: number,
  ) {
    return this.authenticationService.refreshTokens(
      refreshTokenDto.refreshToken,
      userId,
    );
  }

  @Get('current')
  getCurrentUser(@ActiveUser() userId: number) {
    return this.authenticationService.getCurrentUser(userId);
  }
}
