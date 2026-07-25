import { HomeRun } from "./homerun";

export class Game {
    homeTeam: string | null = null;
    awayTeam: string | null = null;
    homeRuns: HomeRun[] = [];                     // Optional property

    constructor() { }
}