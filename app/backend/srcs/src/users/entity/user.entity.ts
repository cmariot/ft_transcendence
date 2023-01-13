import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  username: string;

  @Column()
  displayName: string;

  @Column()
  email: string;
}
