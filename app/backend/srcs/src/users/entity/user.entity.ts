import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

export enum CreatedFrom {
    OAUTH42 = "42",
    REGISTER = "FORM",
    OTHER = "GHOST",
}

export enum Status {
    ONLINE = "Online",
    OFFLINE = "Offline",
    IN_GAME = "In_game",
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

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    emailValidationCodeCreation: Date;

    @Column({ default: "" })
    doubleAuthentificationCode: string;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    doubleAuthentificationCodeCreation: Date;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    profileImage: string;

<<<<<<< HEAD
	@Column({
        type: "enum",
        enum: Status,
        default: Status.OFFLINE,
    })
    status: Status;	

	@Column({ nullable: true })
	socketId : string;

	@Column("text", {array: true, nullable: true})
  	friend: string[];
=======
    @Column("text", { array: true, nullable: true })
    friend: string[];
>>>>>>> 68f5bd4c548d3da9f3202504c8f62258c7331607
}
