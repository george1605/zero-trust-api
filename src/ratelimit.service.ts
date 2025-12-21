import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimit {
    private map: Map<string, number> = new Map<string, number>();
    private limit: number = 100;

    checkLimit(ip: string): boolean {
        if(!this.map.has(ip))
            return true;

        if((this.map.get(ip) || 0) >= this.limit)
            return false;
        return true;
    }

    setLimit(limit: number) {
        this.limit = limit;
    }

    increment(ip: string) {
        this.map.set(ip, (this.map.get(ip) || 0) + 1);
    }
}