import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { UserInterface } from '../models/user.interface';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class UserService
{

	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	)
	{}

	create_user(user: UserInterface) : Observable<UserInterface>
	{
		return from(this.userRepository.save(user));
	}

	get_users() : Observable<UserInterface[]>
	{
		return from(this.userRepository.find());
	}

}
