import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column("json", { default: { x: 0, y: 0 } })
    paddleRight: { x: number; y: number };

    @Column("json", { default: { x: 0, y: 0 } })
    paddleLeft: { x: number; y: number };

    @Column("json", { default: { x: 0, y: 0 } })
    ball: { x: number; y: number };

    @Column({ default: "waiting" })
    status: string;

    @Column({ default: "" })
    HostID: string;

    @Column({ default: "" })
    GuestID: string;

    @Column("text", { array: true, default: [] })
    watchers: string[];
}
