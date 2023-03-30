import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ default: "waiting" })
    status: string;

    @Column({ default: "" })
    hostID: string;

    @Column({ default: "" })
    guestID: string;

    @Column("jsonb", { default: { power_up: false, solo: false } })
    options: { power_up: boolean; solo: boolean };
}
