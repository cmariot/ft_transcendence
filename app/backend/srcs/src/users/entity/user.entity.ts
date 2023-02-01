import {
    Column,
    CreateDateColumn,
    Entity,
    NoVersionOrUpdateDateColumnError,
    PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";
import { FriendshipEntity } from './friendship.entity';

export enum CreatedFrom {
    OAUTH42 = "42",
    REGISTER = "FORM",
    OTHER = "GHOST",
}

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ default: 0 })
    id42: number;

    @Column({
        type: "enum",
        enum: CreatedFrom,
        default: CreatedFrom.OTHER,
    })
    createdFrom: CreatedFrom;

    @Column({ default: false })
    twoFactorsAuth: boolean;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    email: string;

    @Column({ default: false })
    valideEmail: boolean;

    @Column({ default: "" })
    emailValidationCode: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    profileImage: string;

	@OneToMany(type => FriendshipEntity, friendship => friendship.user)
  	friendships: FriendshipEntity[];
}
