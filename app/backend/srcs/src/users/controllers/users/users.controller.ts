import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UsePipes,
	ValidationPipe,
	} from '@nestjs/common';
	import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
	import { UsersService } from 'src/users/services/users/users.service';
	
	@Controller('users')
	export class UsersController {
	  constructor(private readonly userService: UsersService) {}
	  
	  @Get()
	  getUsers() {
		return this.userService.getUsers();
	  }
	  
	  @Post('create')
	  @UsePipes(ValidationPipe)
	  createUsers(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	  }
	}