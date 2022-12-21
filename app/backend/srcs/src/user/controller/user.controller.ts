import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserInterface } from '../models/user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController {

	constructor (private userService: UserService) {}

	@Post()
	add(@Body() user: UserInterface) : Observable<UserInterface> {
		return this.userService.add(user);
	}

	@Get()
	findall() : Observable<UserInterface[]> {
		return this.userService.findAll();
	}
}
