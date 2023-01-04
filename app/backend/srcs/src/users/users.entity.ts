import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
