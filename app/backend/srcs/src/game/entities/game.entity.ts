import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column("json", null)
    paddleRight: { x: number; y: number };

    @Column("json")
    paddleLeft: { x: number; y: number };

    @Column("json")
    ball: { x: number; y: number };

    @Column({ default: "waiting" })
    status: string;

    @Column("json")
    players: { left: string; right: string };

    @Column("text", { array: true, default: [] })
    watchers: string[];
}
