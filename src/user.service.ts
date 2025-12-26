import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    private userCache = {};
    private lastID: number = 1000;
    public lastError: string | Error = "";

    async addUser(name: string, pass: string)
    {
        // do something here
        let hash = await argon2.hash(pass, { type: argon2.argon2id });
        let id = this.lastID++;
        this.userCache[id] = { id, name, hash, level: 0, credits: 0 }; // by default
    }
    
    async logIn(id: number, pass: string)
    {
        if(this.userCache[id] == undefined)
        {
            this.lastError = new Error("Could not find account", {cause: "Does not exist in Cache"});
            return false; // could not log in, acc does not exist
        }
        let hash = this.userCache[id].hash;
        let result = await argon2.verify(hash, pass)
        if(!result)
            this.lastError = new Error("Could not log in", {cause: "Wrong username or password"});
        return result;
    }

    getUsers(size: number): Array<object> {
        let length: number = Object.keys(this.userCache).length;
        if(size > length || size < 0) return []
        if(length > 1000 && size > 0.01 * length) return []
        if(length > 50 && size > 0.1 * length) return []

        let users: Array<object> = new Array<object>();
        let ids = Object.keys(this.userCache).slice(0, size);
        for(const id in ids)
        {
            users.push({ name: this.userCache[id].name, id: id, level: this.userCache[id].level })
        }
        return users;
    }
}