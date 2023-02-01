import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class FriendshipEntity {
  	@PrimaryGeneratedColumn()
  	uuid: number;

  	@ManyToOne(type => UserEntity, uuid => uuid.friendships)
  	user: UserEntity;

  	@Column()
  	friendUuid: string;
}
