import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service'
import { Users } from './users.entity';

@Controller('users')
export class UsersController
{

	constructor(private userService: UsersService)
	{}

	@Get()
	get_users()
	{
		return (this.userService.get_users());
	}

	@Post()
	add_user(@Body() user : Users)
	{
		return (this.userService.add_user(user));
	}

}
