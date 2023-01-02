import { Controller, Get } from '@nestjs/common';

@Controller('login')
export class LoginController
{
	@Get()
	login() : string
	{
		return ("Login OK");
	}
}
