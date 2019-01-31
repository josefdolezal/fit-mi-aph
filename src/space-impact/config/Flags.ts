/** Entity grouping app-wide flags */
export class Flags {
    /** The object may collide with ship missile */
    static readonly FLAG_SHIP_MISSILE_COLLIDABLE = 1;
    /** The object is considered as missile */
    static readonly FLAG_MISSILE = 2;
    /** Generic game object */
    static readonly FLAG_GAME_OBJECT = 4;
    /** Object is owned by secondary player */
    static readonly FLAG_SECOND_PLAYER = 8;
}