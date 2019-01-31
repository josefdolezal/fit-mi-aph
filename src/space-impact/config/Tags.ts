/** Groups game objects tags */
export class Tags {
    /** Game background tag */
    static readonly TAG_GROUND = "ground";
    
    /** Player's ship tag */
    static readonly TAG_SHIP = "ship";
    /** Players' missile taf */
    static readonly TAG_SHIP_MISSILE = "missile";
    
    /** Enemy tag */
    static readonly TAG_ENEMY = "enemy";
    /** Enemy's missile tag */
    static readonly TAG_ENEMY_MISSILE = "enemy-missile";

    /** Lives container tag */
    static readonly TAG_LIVES = "lives";
    /** Live indicator tag */
    static readonly TAG_LIVE = "live";

    /** Level info container tag */
    static readonly TAG_LEVEL = "level";

    /** Players' current score container tag */
    static readonly TAG_SCORE = "score";
    /** Game over text container tag */
    static readonly TAG_GAME_OVER = "gamme-over";

    /** Introducton container tag */
    static readonly TAG_INTRO = "intro";
}