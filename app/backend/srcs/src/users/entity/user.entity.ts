import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    password: string;
}
