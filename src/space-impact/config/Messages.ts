import { MSG_OBJECT_ADDED, MSG_OBJECT_REMOVED} from '../../../ts/engine/Constants';

export class Messages {
    static readonly MSG_SHIP_MISSILE_SHOT = "MSG_MISSILE_SHOT";
    static readonly MSG_ENEMY_MISSILE_SHOT = "MSG_ENEMY_MISSILE_SHOT";
    static readonly MSG_COLLISION = "MSG_COLLISION";

    static readonly MSG_ENEMY_KILLED = "MSG_ENEMY_KILLED";
    static readonly MSG_ENEMY_ESCAPED = "MSG_ENEMY_ESCAPED";
    static readonly MSG_SHIP_KILLED = "MSG_SHIP_KILLED";

    static readonly MSG_GAME_OVER = "MSG_GAME_OVER";
    static readonly MSG_GAME_WON = "MSG_GAME_WON";

    static readonly MSG_OBJECT_ADDED = MSG_OBJECT_ADDED;
    static readonly MSG_OBJECT_REMOVED = MSG_OBJECT_REMOVED;
}