import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserInterface } from '../models/user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController
{

	constructor (private userService: UserService)
	{}

	@Post()
	create_user(@Body() user: UserInterface) : Observable<UserInterface>
	{
		return (this.userService.create_user(user));
	}

	@Get()
	get_users() : Observable<UserInterface[]>
	{
		return (this.userService.get_users());
	}

}
