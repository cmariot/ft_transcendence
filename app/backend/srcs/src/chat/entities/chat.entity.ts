import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ChannelType {
    PRIVATE = "private",
    PUBLIC = "public",
    PROTECTED = "protected",
    DIRECT_MESSAGE = "direct_message",
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

    @Column({ default: "" })
    channelOwner: string;

    @Column("jsonb", { default: [] })
    channelAdministrators: { uuid: string }[];

    @Column("jsonb", { default: [] })
    messages: { uuid: string; message: string }[];

    @Column("jsonb", { default: [] })
    allowed_users: { uuid: string }[];

    @Column("jsonb", { default: [] })
    users: { uuid: string }[];

    @Column("jsonb", { default: [] })
    banned_users: { uuid: string; ban_date: string; ban_duration: string }[];

    @Column("jsonb", { default: [] })
    mutted_users: { uuid: string; mute_date: string; mute_duration: string }[];
}
