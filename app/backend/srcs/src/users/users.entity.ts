import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty, IsDefined} from 'class-validator';

@Entity()
export class Users
{
	@PrimaryGeneratedColumn("uuid")
	uuid: number;

	@Column()
	@IsNotEmpty()
	username: string;

	@Column()
	@IsEmail()
	email: string;

}
