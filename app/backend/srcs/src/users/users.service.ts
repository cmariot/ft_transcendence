import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService
{
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	)
	{}

	add_user(user: Users)
	{
		return (this.usersRepository.save(user));
	}

	get_users()
	{
		return (this.usersRepository.find());
	}

}
