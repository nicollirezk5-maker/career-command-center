const screens = ["Login", "Home", "Treinos", "Perfil"];

async function main() {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];
        const frame = figma.createFrame();
        frame.name = screen;
        frame.resize(375, 812);
        frame.x = i * 400;

        const text = figma.createText();
        text.characters = screen;
        text.x = 20;
        text.y = 20;

        frame.appendChild(text);
        figma.currentPage.appendChild(frame);
    }

    figma.closePlugin();
}

main();