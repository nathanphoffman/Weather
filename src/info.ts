class Info {

    printInfo() {
        console.log("\n");
        
        console.log("All weather is in the format: {RealFeel}{H} {StormRating}{WT} {SmileyFace}");
        console.log("RealFeel is rounded to the nearest 5, H will show if it is humid.");
        console.log("W will show if it is windy, and T will show if there is a chance of Thunderstorms.");
        console.log("The severity / chance of everything is color coded: bright red (worst / highest) to green (best / no) with grey being decent / low.\n");
        console.log("StormRating is a composite of: Cloud Cover, Precipitation, Wind, and Thunder and is designed to be a generic value, a guide is below:");
        console.log(" - <10 Not Overcast: Max cloud cover is the number x 10% so 5 = 50%. Cloud cover can be a little lower if there is a W or T listed.")
        console.log(" - 10-19 Overcast: Rain possible but very unlikely if <15, could also be partially clear if there is winds or thunder.");
        console.log(" - 20-29 Drizzle/Flurry: Some rain or snow likely though not guaranteed. Definitely overcast.");
        console.log(" - 30-39 Light Storm: Rain pretty much guaranteed, sky likely darker.");
        console.log(" - 40-49 Storm: Proper storm conditions, precipitation guaranteed. It might be wise to check other forecast for more detailed breakdown.");
        console.log(" - 50+ Severe Storm: Strong precipitation, strong winds, etc. If higher even possible tropical storm or blizzard. Check other forecasts.\n");
        console.log("A regular smiley face will appear if only one of the factors above is grey, and none are red/yellow.");
        console.log("To prevent this text from showing, use the option -d to dismiss. For more help use the option -h.");
    }

}

export default new Info();