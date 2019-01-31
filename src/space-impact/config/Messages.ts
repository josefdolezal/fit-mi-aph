import { MSG_OBJECT_ADDED, MSG_OBJECT_REMOVED} from '../../../ts/engine/Constants';

/** Groups system-wide messages */
export class Messages {
    /** New ship missile was created */
    static readonly MSG_SHIP_MISSILE_SHOT = "MSG_MISSILE_SHOT";
    /** New enemy missile was created */
    static readonly MSG_ENEMY_MISSILE_SHOT = "MSG_ENEMY_MISSILE_SHOT";
    /** New collision occured */
    static readonly MSG_COLLISION = "MSG_COLLISION";

    /** Enemy was killed */
    static readonly MSG_ENEMY_KILLED = "MSG_ENEMY_KILLED";
    /** Enemy went off-screen */
    static readonly MSG_ENEMY_ESCAPED = "MSG_ENEMY_ESCAPED";
    /** Ship was killed (-1 live) */
    static readonly MSG_SHIP_KILLED = "MSG_SHIP_KILLED";

    /** The game ended */
    static readonly MSG_GAME_OVER = "MSG_GAME_OVER";
    /** Game level was completed */
    static readonly MSG_LEVEL_CLEARED = "MSG_LEVEL_CLEARED";
    /** The game was won */
    static readonly MSG_GAME_WON = "MSG_GAME_WON";

    /** Secondary player joined the game */
    static readonly MSG_SECOND_PLAYER_JOINED = "MSG_SECOND_PLAYER_JOINED";
    /** Secondary player left the game */
    static readonly MSG_SECOND_PLATER_LEFT = "MSG_SECOND_PLAYER_LEFT";

    /** (System) New game object was added */
    static readonly MSG_OBJECT_ADDED = MSG_OBJECT_ADDED;
    /** (System) Game object was removed */
    static readonly MSG_OBJECT_REMOVED = MSG_OBJECT_REMOVED;
}