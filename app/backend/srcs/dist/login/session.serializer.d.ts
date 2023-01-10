import { PassportSerializer } from '@nestjs/passport';
import { Profile } from 'passport-42';
export declare class SessionSerializer extends PassportSerializer {
    constructor();
    serializeUser(user: Profile, done: (err: Error, user: Profile) => void): any;
    deserializeUser(payload: Profile, done: (err: Error, user: Profile) => void): void;
}
