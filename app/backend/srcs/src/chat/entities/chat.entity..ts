import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ChannelType {
    PRIVATE = "private",
    PUBLIC = "public",
    PROTECTED = "protected",
}

@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ nullable: false, unique: true })
    channelName: string;

    @Column({
        type: "enum",
        enum: ChannelType,
        default: ChannelType.PUBLIC,
    })
    channelType: ChannelType;

    @Column({ default: "" })
    channelPassword: string;

    @Column({ default: "", select: false })
    channelOwner: string;

    @Column("jsonb", { default: [] })
    messages: { username: string; message: string }[];

    @Column("jsonb", { default: [] })
    allowed_users: { uuid: string }[];
}
