export class HomeRun {
    player: string | null = null;
    team: string | null = null;
    description: string | null = null;

    constructor(player: string | null = null, team: string | null = null, description: string | null = null) {
        this.player = player;
        this.team = team;
        this.description = description;
    }
}