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

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ default: true })
    firstLog: boolean;

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

    @Column({ default: "Offline" })
    status: string;

    @Column("text", { array: true, default: [] })
    socketId: string[];

    @Column("text", { array: true, default: [] })
    friend: string[];

    @Column("text", { array: true, default: [] })
    blocked: string[];
}
