import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from 'src/common/decorators/public.decorator';

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
}
