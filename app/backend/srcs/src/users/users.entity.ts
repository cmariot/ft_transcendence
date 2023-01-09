import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty, IsDefined} from 'class-validator';

@Entity()
export class Users
{
	@PrimaryGeneratedColumn("uuid")
	uuid: string;

	@Column()
	@IsNotEmpty()
	username: string;

	@Column()
	@IsEmail()
	email: string;

}
