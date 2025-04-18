import { color, RED, YELLOW } from "./color";
import { HUMIDITY, Magnitude, Postfix, PostfixLetter, THUNDER, WIND_SPEED } from "./types";

export function getPostfixWithColor(magnitude: Magnitude, postFixLetter: PostfixLetter) {
    const postFix = getPostfix(magnitude, postFixLetter);
    if (postFix.length > 2) return color(postFix, RED);
    else if (postFix.length > 0) return color(postFix, YELLOW);
    else return postFix;
}

export function getPostfix(magnitude: Magnitude, postFixLetter: PostfixLetter): Postfix {
    if (magnitude > 4 || magnitude < 0) throw "magnitude cannot be greater than 4 or less than 0";
    else if (postFixLetter === "W") return WIND_SPEED[magnitude];
    else if (postFixLetter === "H") return HUMIDITY[magnitude];
    else if (postFixLetter === "T") return THUNDER[magnitude];
    else throw `Postfix ${postFixLetter ?? "empty"} is not setup.`;
}