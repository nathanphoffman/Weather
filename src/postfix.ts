import { BLINK, color, RED, YELLOW } from "./color";
import { HUMIDITY, Magnitude, Postfix, PostfixLetter, THUNDER, WIND_SPEED } from "./types";

export function getPostfixWithColor(magnitude: Magnitude, postFixLetter: PostfixLetter) {
    const postFix = postFixLetter;
    if(magnitude > 3) return color(color(postFix, RED), BLINK);
    else if (magnitude > 2) return color(color(postFix, RED), BLINK) ;
    else if (magnitude > 1) return color(postFix, YELLOW);
    else if (magnitude == 1) return postFix;
    else return "";
}

// delete !!
export function getPostfix(magnitude: Magnitude, postFixLetter: PostfixLetter): Postfix {
    if (magnitude > 4 || magnitude < 0) throw "magnitude cannot be greater than 4 or less than 0";
    else if (postFixLetter === "W") return WIND_SPEED[magnitude];
    else if (postFixLetter === "H") return HUMIDITY[magnitude];
    else if (postFixLetter === "T") return THUNDER[magnitude];
    else throw `Postfix ${postFixLetter ?? "empty"} is not setup.`;
}