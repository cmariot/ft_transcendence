import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryColumn()
  uuid: number;

  @Column()
  username: string;

  @Column()
  displayName: string;

  @Column()
  email: string;

}
