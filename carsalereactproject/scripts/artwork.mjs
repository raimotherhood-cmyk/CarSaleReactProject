import { createCanvas } from "@napi-rs/canvas";

const colors = { ink: "#17343d", dark: "#10262f", paper: "#f5f8f4", mint: "#bcdccf", lime: "#d7fa64", blue: "#87b8cf", orange: "#dc714e", line: "#6b929b", white: "#ffffff" };

function rectangle(context, left, top, width, height, fill, radius = 0) {
    context.fillStyle = fill;
    context.beginPath();
    context.roundRect(left, top, width, height, radius);
    context.fill();
}

function line(context, points, color = colors.ink, width = 4) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    points.forEach(([left, top], index) => index ? context.lineTo(left, top) : context.moveTo(left, top));
    context.stroke();
}

function ellipse(context, left, top, width, height, fill) {
    context.fillStyle = fill;
    context.beginPath();
    context.ellipse(left, top, width, height, 0, 0, Math.PI * 2);
    context.fill();
}

function text(context, value, left, top, size = 24, color = colors.ink, weight = 700) {
    context.fillStyle = color;
    context.font = `${weight} ${size}px "Trebuchet MS"`;
    context.textBaseline = "top";
    context.fillText(value, left, top);
}

function city(context, height, night = false) {
    rectangle(context, 0, 0, 1000, height, night ? colors.dark : "#dcece9");
    const ground = height * 0.77;
    const buildings = [[-20, 130, 135], [95, 190, 140], [225, 155, 115], [325, 240, 165], [475, 170, 125], [590, 210, 155], [735, 145, 120], [845, 245, 170]];
    for (const [left, buildingHeight, width] of buildings) {
        const top = ground - buildingHeight;
        rectangle(context, left, top, width, buildingHeight, night ? "#26454e" : "#9cbabd");
        rectangle(context, left + width - 15, top, 15, buildingHeight, night ? "#1b3741" : "#83a6ac");
        for (let row = 0; row < Math.floor(buildingHeight / 32) - 1; row += 1) {
            for (let column = 0; column < Math.floor(width / 28) - 1; column += 1) {
                rectangle(context, left + 15 + column * 28, top + 19 + row * 32, 11, 15, night ? ((row + column) % 3 ? "#4f747c" : "#e1d6a4") : "#d7e6e6");
            }
        }
    }
    rectangle(context, 0, ground, 1000, 22, night ? "#769391" : "#bdcfce");
    rectangle(context, 0, ground + 22, 1000, height - ground, night ? "#142d35" : "#45646c");
    for (let left = -30; left < 1000; left += 150) rectangle(context, left, ground + 80, 70, 6, "#e5e7d8");
    return ground;
}

function campaignPanel(context, left, top, width, height, variant = 0) {
    rectangle(context, left, top, width, height, variant % 2 ? colors.lime : colors.paper, 5);
    const block = width * 0.3;
    rectangle(context, left + width - block, top, block, height, variant % 2 ? colors.orange : colors.mint);
    line(context, [[left + width - block * 0.78, top + height * 0.7], [left + width - block * 0.28, top + height * 0.3]], colors.ink, Math.max(5, width * 0.018));
    line(context, [[left + width - block * 0.63, top + height * 0.3], [left + width - block * 0.28, top + height * 0.3], [left + width - block * 0.28, top + height * 0.58]], colors.ink, Math.max(5, width * 0.018));
    text(context, "VISION", left + width * 0.07, top + height * 0.17, width * 0.095);
    text(context, "YOUR BRAND.", left + width * 0.07, top + height * 0.46, width * 0.041);
    text(context, "GREATER REACH.", left + width * 0.07, top + height * 0.64, width * 0.032, colors.ink, 400);
}

function billboard(context, height, hero = false) {
    const ground = city(context, height, hero);
    const left = hero ? 490 : 160;
    const width = hero ? 450 : 680;
    const panelHeight = hero ? 220 : 290;
    const top = ground - panelHeight - 120;
    rectangle(context, left + width * 0.21, top + panelHeight, 20, ground - top - panelHeight, colors.ink);
    rectangle(context, left + width * 0.76, top + panelHeight, 20, ground - top - panelHeight, colors.ink);
    rectangle(context, left - 10, top - 10, width + 20, panelHeight + 20, colors.ink, 6);
    campaignPanel(context, left, top, width, panelHeight, hero ? 1 : 0);
    line(context, [[left - 8, top - 24], [left + width + 8, top - 24]], colors.line, 5);
    for (let index = 0; index < 4; index += 1) {
        const position = left + 45 + index * (width - 90) / 3;
        line(context, [[position, top - 24], [position, top - 2]], colors.line, 4);
        rectangle(context, position - 13, top - 6, 26, 9, colors.paper, 2);
    }
    if (hero) {
        rectangle(context, 830, ground - 95, 16, 120, colors.line);
        campaignPanel(context, 776, ground - 148, 130, 80, 0);
    }
}

function bus(context, height, wrapped = false) {
    const ground = city(context, height);
    const top = ground - 245;
    ellipse(context, 500, ground + 17, 350, 23, "#31515b");
    rectangle(context, 125, top, 750, 235, wrapped ? colors.lime : colors.paper, 28);
    rectangle(context, 138, top + 22, 720, 95, colors.ink, 16);
    for (let index = 0; index < 7; index += 1) rectangle(context, 152 + index * 100, top + 31, 86, 76, "#72a4b4", 5);
    rectangle(context, 758, top + 29, 73, 176, "#254954", 6);
    line(context, [[795, top + 38], [795, top + 197]], "#9ec4c9", 3);
    rectangle(context, 146, top + 131, 568, 73, wrapped ? colors.orange : colors.mint, 4);
    text(context, wrapped ? "VISION / ON THE MOVE" : "YOUR BRAND. EVERY JOURNEY.", 174, top + 151, 26);
    for (const left of [266, 695]) {
        ellipse(context, left, ground - 4, 46, 46, colors.dark);
        ellipse(context, left, ground - 4, 23, 23, "#b7cbd0");
        ellipse(context, left, ground - 4, 9, 9, colors.ink);
    }
    rectangle(context, 843, top + 154, 20, 30, colors.paper, 5);
    line(context, [[180, top - 14], [813, top - 14]], colors.line, 5);
}

function shelter(context, height) {
    const ground = city(context, height);
    const top = ground - 355;
    rectangle(context, 112, top + 18, 772, 25, colors.ink, 4);
    rectangle(context, 135, top + 43, 26, 314, colors.ink);
    rectangle(context, 835, top + 43, 26, 314, colors.ink);
    rectangle(context, 175, top + 60, 408, 229, "#bddadb");
    for (const left of [200, 320, 440, 560]) line(context, [[left, top + 68], [left, top + 280]], "#7ea5ad", 4);
    rectangle(context, 210, ground - 83, 340, 17, colors.ink, 3);
    rectangle(context, 240, ground - 67, 12, 67, colors.ink);
    rectangle(context, 508, ground - 67, 12, 67, colors.ink);
    rectangle(context, 612, top + 60, 198, 260, colors.ink, 5);
    campaignPanel(context, 625, top + 74, 172, 230, 1);
    rectangle(context, 91, top - 12, 814, 30, colors.orange, 4);
}

function poleKiosks(context, height) {
    const ground = city(context, height);
    for (const [left, scale, variant] of [[190, 1, 0], [490, 0.85, 1], [745, 0.7, 0]]) {
        const panelHeight = 285 * scale;
        const top = ground - panelHeight - 115 * scale;
        rectangle(context, left + 66 * scale, top - 35, 16 * scale, ground - top + 35, colors.ink);
        rectangle(context, left - 8, top - 8, 172 * scale, panelHeight + 16, colors.ink, 3);
        campaignPanel(context, left, top, 156 * scale, panelHeight, variant);
        ellipse(context, left + 75 * scale, ground + 18, 86 * scale, 15 * scale, "#31515b");
    }
}

function railway(context, height, station = false) {
    const ground = city(context, height);
    const top = ground - 215;
    if (station) {
        rectangle(context, 80, top - 215, 840, 25, colors.ink, 4);
        for (const left of [112, 485, 858]) rectangle(context, left, top - 190, 16, 385, colors.line);
        line(context, [[98, top - 190], [255, top - 278], [908, top - 190]], colors.ink, 9);
        rectangle(context, 545, top - 165, 296, 122, colors.ink, 4);
        campaignPanel(context, 555, top - 155, 276, 102, 1);
        rectangle(context, 142, top - 158, 170, 43, colors.paper, 3);
        text(context, "PLATFORM 01", 157, top - 149, 18);
    } else {
        campaignPanel(context, 520, top - 204, 325, 141, 0);
        rectangle(context, 667, top - 64, 14, 64, colors.ink);
    }
    rectangle(context, 75, top, 840, 182, colors.paper, 30);
    rectangle(context, 91, top + 27, 786, 63, "#315c6c", 9);
    for (let index = 0; index < 8; index += 1) rectangle(context, 105 + index * 96, top + 33, 75, 49, "#8cbaca", 4);
    rectangle(context, 90, top + 108, 800, 53, station ? colors.orange : colors.lime);
    text(context, "VISION / CONNECTING EVERY JOURNEY", 140, top + 122, 21);
    for (const left of [180, 330, 660, 800]) ellipse(context, left, top + 187, 27, 27, colors.dark);
    line(context, [[0, ground + 11], [1000, ground + 11]], colors.paper, 8);
    line(context, [[0, ground + 31], [1000, ground + 31]], colors.ink, 6);
    for (let left = 0; left < 1000; left += 48) line(context, [[left, ground + 17], [left + 25, ground + 48]], colors.line, 5);
}

function digitalScreen(context, height) {
    const ground = city(context, height, true);
    const top = ground - 365;
    rectangle(context, 340, top - 18, 326, 362, "#446b78", 20);
    rectangle(context, 354, top - 4, 298, 328, colors.ink, 12);
    campaignPanel(context, 372, top + 14, 262, 290, 1);
    rectangle(context, 472, top + 345, 62, 28, "#718f94", 4);
    rectangle(context, 426, ground + 11, 154, 16, colors.ink, 4);
    for (let index = 0; index < 3; index += 1) ellipse(context, 477 + index * 24, top + 309, 3, 3, colors.paper);
    line(context, [[160, ground], [160, top + 82], [250, top + 82]], colors.line, 9);
    rectangle(context, 230, top + 80, 40, 14, colors.paper, 5);
}

function studio(context, height, warm = false) {
    rectangle(context, 0, 0, 1000, height, warm ? "#f0e5dd" : "#e2ecee");
    rectangle(context, 0, height * 0.78, 1000, height * 0.22, warm ? "#d7bbb0" : "#a9c9cb");
    for (let left = 65; left < 1000; left += 72) line(context, [[left, height * 0.78], [left + 60, height]], warm ? "#cba99b" : "#93b8bd", 1);
}

function browserWindow(context, left, top, width, height, title) {
    rectangle(context, left + 12, top + 16, width, height, "#aec8cc", 16);
    rectangle(context, left, top, width, height, colors.paper, 14);
    rectangle(context, left, top, width, 45, colors.ink, 12);
    for (let index = 0; index < 3; index += 1) ellipse(context, left + 22 + index * 19, top + 23, 5, 5, [colors.orange, colors.lime, colors.blue][index]);
    text(context, title, left + 90, top + 14, 16, colors.white, 400);
}

function chart(context, left, top, width, height) {
    line(context, [[left, top], [left, top + height], [left + width, top + height]], "#789ca6", 3);
    const bars = [0.28, 0.48, 0.4, 0.7, 0.86];
    bars.forEach((value, index) => rectangle(context, left + 20 + index * width / 5, top + height * (1 - value), width / 8, height * value, index === 4 ? colors.orange : colors.blue, 3));
}

function digitalCampaign(context, height) {
    studio(context, height);
    const top = height * 0.2;
    browserWindow(context, 112, top, 662, 426, "CAMPAIGN STUDIO");
    campaignPanel(context, 138, top + 71, 302, 198, 1);
    chart(context, 478, top + 99, 241, 171);
    rectangle(context, 141, top + 310, 450, 12, "#c0d1d3", 4);
    rectangle(context, 141, top + 338, 369, 12, "#c0d1d3", 4);
    rectangle(context, 699, top + 173, 173, 320, colors.ink, 24);
    campaignPanel(context, 711, top + 201, 149, 230, 0);
    rectangle(context, 755, top + 463, 63, 5, colors.paper, 3);
}

function searchArtwork(context, height) {
    studio(context, height);
    const top = height * 0.24;
    browserWindow(context, 114, top, 676, 364, "SEARCH / DISCOVERY");
    rectangle(context, 151, top + 77, 578, 45, "#d6e5e5", 22);
    text(context, "your brand", 176, top + 89, 18, colors.ink, 400);
    for (let index = 0; index < 3; index += 1) {
        rectangle(context, 158, top + 155 + index * 64, 308 - index * 33, 12, index ? colors.blue : colors.ink, 4);
        rectangle(context, 158, top + 179 + index * 64, 421, 7, "#bfd0d2", 3);
    }
    ellipse(context, 738, top + 247, 99, 99, colors.lime);
    context.strokeStyle = colors.ink;
    context.lineWidth = 13;
    context.beginPath();
    context.arc(738, top + 247, 67, 0, Math.PI * 2);
    context.stroke();
    line(context, [[786, top + 295], [863, top + 374]], colors.ink, 27);
    line(context, [[697, top + 253], [729, top + 280], [778, top + 218]], colors.ink, 8);
}

function localBusiness(context, height) {
    studio(context, height);
    const top = height * 0.2;
    rectangle(context, 108, top, 784, 426, "#c7dfd4", 12);
    for (const left of [205, 430, 660]) rectangle(context, left, top, 34, 426, colors.paper);
    for (const offset of [104, 278]) rectangle(context, 108, top + offset, 784, 28, colors.paper);
    for (const [left, offset] of [[135, 24], [490, 154], [706, 30], [268, 330], [727, 331]]) rectangle(context, left, top + offset, 104, 52, "#90bbae", 6);
    context.fillStyle = colors.orange;
    context.beginPath();
    context.moveTo(500, top + 310);
    context.bezierCurveTo(340, top + 158, 389, top + 57, 500, top + 57);
    context.bezierCurveTo(611, top + 57, 660, top + 158, 500, top + 310);
    context.fill();
    ellipse(context, 500, top + 151, 53, 53, colors.paper);
    rectangle(context, 472, top + 143, 56, 41, colors.ink, 2);
    rectangle(context, 466, top + 120, 68, 26, colors.lime, 3);
    line(context, [[481, top + 124], [481, top + 142], [498, top + 142], [498, top + 124], [515, top + 124], [515, top + 142]], colors.ink, 3);
    rectangle(context, 590, top + 345, 244, 121, colors.paper, 10);
    text(context, "LOCAL BUSINESS", 612, top + 369, 19);
    text(context, "OPEN / DISCOVER / CONNECT", 612, top + 405, 10, colors.line);
}

function socialArtwork(context, height, calendar = false) {
    studio(context, height, calendar);
    const top = height * 0.21;
    if (calendar) {
        browserWindow(context, 135, top, 632, 405, "CONTENT CALENDAR");
        for (let row = 0; row < 3; row += 1) {
            for (let column = 0; column < 4; column += 1) {
                const left = 165 + column * 144;
                const offset = top + 80 + row * 94;
                rectangle(context, left, offset, 122, 74, (row + column) % 3 ? "#dce7e5" : colors.lime, 6);
                rectangle(context, left + 14, offset + 19, 55, 6, colors.line, 3);
                rectangle(context, left + 14, offset + 38, 84, 5, "#9ebaba", 3);
            }
        }
        rectangle(context, 691, top + 213, 173, 246, colors.ink, 20);
        campaignPanel(context, 703, top + 238, 149, 189, 1);
    } else {
        rectangle(context, 350, top - 24, 278, 470, colors.ink, 30);
        rectangle(context, 365, top + 7, 248, 373, colors.paper, 8);
        campaignPanel(context, 378, top + 31, 222, 237, 1);
        ellipse(context, 394, top + 299, 11, 11, colors.orange);
        rectangle(context, 418, top + 294, 145, 9, "#90b5bb", 3);
        rectangle(context, 379, top + 327, 180, 8, "#b9cdd0", 3);
        rectangle(context, 448, top + 416, 84, 6, colors.paper, 3);
        rectangle(context, 139, top + 112, 189, 122, colors.paper, 12);
        text(context, "REACH", 162, top + 136, 20);
        chart(context, 165, top + 173, 128, 42);
        rectangle(context, 664, top + 41, 184, 115, colors.lime, 12);
        text(context, "CONNECT", 685, top + 70, 19);
        line(context, [[684, top + 119], [738, top + 96], [781, top + 113], [824, top + 88]], colors.ink, 5);
    }
}

function launchArtwork(context, height) {
    studio(context, height, true);
    const ground = height * 0.78;
    rectangle(context, 119, ground - 316, 762, 316, colors.ink, 6);
    campaignPanel(context, 255, ground - 286, 490, 236, 1);
    context.fillStyle = colors.orange;
    context.beginPath();context.moveTo(119, ground - 316);context.lineTo(267, ground - 316);context.lineTo(185, ground);context.lineTo(119, ground);context.fill();
    context.beginPath();context.moveTo(881, ground - 316);context.lineTo(733, ground - 316);context.lineTo(815, ground);context.lineTo(881, ground);context.fill();
    rectangle(context, 149, ground, 702, 25, colors.paper, 3);
    rectangle(context, 184, ground + 25, 632, 28, "#bbcbc6", 3);
    for (const [left, top, angle] of [[245, ground - 365, 0.5], [402, ground - 397, -0.4], [672, ground - 368, 0.6], [810, ground - 402, -0.7]]) {
        context.save();context.translate(left, top);context.rotate(angle);rectangle(context, 0, 0, 11, 27, colors.orange);context.restore();
    }
}

function researchArtwork(context, height) {
    studio(context, height);
    const top = height * 0.2;
    rectangle(context, 181, top + 18, 571, 408, "#9cbfc4", 12);
    rectangle(context, 166, top, 571, 408, colors.paper, 12);
    text(context, "MARKET INSIGHTS", 201, top + 35, 26);
    chart(context, 215, top + 108, 296, 180);
    ellipse(context, 612, top + 153, 64, 64, colors.mint);
    context.fillStyle = colors.orange;
    context.beginPath();context.moveTo(612, top + 153);context.arc(612, top + 153, 64, -Math.PI / 2, Math.PI / 5);context.closePath();context.fill();
    ellipse(context, 612, top + 153, 31, 31, colors.paper);
    rectangle(context, 207, top + 333, 455, 10, "#bed1d3", 4);
    rectangle(context, 207, top + 358, 355, 10, "#bed1d3", 4);
    line(context, [[761, top + 91], [805, top + 76], [873, top + 392], [830, top + 403], [761, top + 91]], colors.ink, 6);
    rectangle(context, 111, top + 60, 76, 128, colors.lime, 5);
    text(context, "ASK", 125, top + 82, 22);
    line(context, [[130, top + 124], [146, top + 139], [173, top + 112]], colors.ink, 5);
}

function portrait(context, height) {
    rectangle(context, 0, 0, 1000, height, "#dbe9e5");
    rectangle(context, 650, 0, 350, height, "#b7d2ca");
    rectangle(context, 106, height - 160, 788, 18, "#829f9f", 8);
    const center = 500;
    const headTop = height * 0.19;
    ellipse(context, center, headTop + 171, 168, 201, "#93b2af");
    context.fillStyle = colors.ink;
    context.beginPath();context.moveTo(337, headTop + 139);context.bezierCurveTo(300, headTop - 74, 714, headTop - 101, 666, headTop + 153);context.lineTo(603, headTop + 100);context.lineTo(450, headTop + 55);context.lineTo(337, headTop + 139);context.fill();
    rectangle(context, 435, headTop + 334, 131, 117, "#93b2af", 14);
    context.fillStyle = colors.ink;
    context.beginPath();context.moveTo(160, height - 161);context.bezierCurveTo(159, headTop + 435, 251, headTop + 409, 433, headTop + 386);context.lineTo(500, headTop + 455);context.lineTo(568, headTop + 386);context.bezierCurveTo(744, headTop + 413, 841, headTop + 443, 840, height - 161);context.closePath();context.fill();
    context.fillStyle = colors.paper;
    context.beginPath();context.moveTo(433, headTop + 386);context.lineTo(500, headTop + 455);context.lineTo(568, headTop + 386);context.lineTo(535, height - 170);context.lineTo(465, height - 170);context.closePath();context.fill();
    line(context, [[299, headTop + 455], [390, headTop + 594], [332, headTop + 634], [414, height - 180]], "#49666e", 5);
    line(context, [[700, headTop + 455], [609, headTop + 594], [667, headTop + 634], [585, height - 180]], "#49666e", 5);
    rectangle(context, 660, height - 347, 75, 12, colors.lime, 3);
}

function productArtwork(context, height) {
    studio(context, height);
    const top = height * 0.22;
    rectangle(context, 280, top + 41, 390, 286, colors.paper, 12);
    rectangle(context, 298, top + 59, 354, 200, colors.mint, 6);
    line(context, [[320, top + 234], [413, top + 141], [485, top + 210], [555, top + 130], [631, top + 223]], colors.ink, 13);
    ellipse(context, 572, top + 102, 23, 23, colors.orange);
    rectangle(context, 321, top + 287, 219, 10, "#a3bfc4", 4);
    rectangle(context, 248, top + 344, 457, 14, colors.ink, 5);
}

export function renderArtwork(scene, width, height) {
    if (![width, height].every(value => Number.isInteger(value) && value >= 64 && value <= 2400)) throw new Error("Invalid artwork dimensions.");
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    context.scale(width / 1000, width / 1000);
    const logicalHeight = height * 1000 / width;
    if (["hero", "hero-mobile", "social-preview"].includes(scene)) billboard(context, logicalHeight, true);
    else if (scene === "billboards") billboard(context, logicalHeight);
    else if (scene === "digital") digitalScreen(context, logicalHeight);
    else if (scene === "transit" || scene === "bus-wraps") bus(context, logicalHeight, scene === "bus-wraps");
    else if (scene === "bus-shelters") shelter(context, logicalHeight);
    else if (scene === "pole-kiosks") poleKiosks(context, logicalHeight);
    else if (scene === "train-branding" || scene === "railway-advertising") railway(context, logicalHeight, scene === "railway-advertising");
    else if (scene === "digital-campaigns") digitalCampaign(context, logicalHeight);
    else if (scene === "seo") searchArtwork(context, logicalHeight);
    else if (scene === "google-business") localBusiness(context, logicalHeight);
    else if (scene === "meta-ads" || scene === "social-management") socialArtwork(context, logicalHeight, scene === "social-management");
    else if (scene === "brand-launches") launchArtwork(context, logicalHeight);
    else if (scene === "market-research") researchArtwork(context, logicalHeight);
    else if (scene === "portrait") portrait(context, logicalHeight);
    else if (scene === "product-placeholder") productArtwork(context, logicalHeight);
    else throw new Error(`Unknown artwork scene: ${scene}`);
    return canvas.toBuffer("image/png");
}