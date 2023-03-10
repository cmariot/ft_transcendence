import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column("json", { default: { x: 0, y: 0 } })
    paddleRight: { x: number; y: number };

    @Column("json", { default: { x: 0, y: 0 } })
    paddleLeft: { x: number; y: number };

    @Column("json", { default: { x: 50, y: 50 } })
    ball: { x: number; y: number };

    @Column({ default: 2 })
    ballSpeed: Number;

    @Column({ default: 0 })
    ballAngle: Number;

    @Column({ default: "waiting" })
    status: string;

    @Column({ default: "" })
    HostID: string;

    @Column({ default: "" })
    GuestID: string;

    @Column("json", { default: { Host: 0, Guest: 0 } })
    Score: { Host: number; Guest: number };

    @Column("text", { array: true, default: [] })
    watchers: string[];
}
