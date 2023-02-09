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
    channelOwner: string;
}
