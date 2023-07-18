import { loader } from "@monaco-editor/react";

const monacoThemes = {
  active4d: "Active4D",
  "all-hallows-eve": "All Hallows Eve",
  amy: "Amy",
  "birds-of-paradise": "Birds of Paradise",
  blackboard: "Blackboard",
  "brilliance-black": "Brilliance Black",
  "brilliance-dull": "Brilliance Dull",
  "chrome-devtools": "Chrome DevTools",
  "clouds-midnight": "Clouds Midnight",
  clouds: "Clouds",
  cobalt: "Cobalt",
  dawn: "Dawn",
  dreamweaver: "Dreamweaver",
  eiffel: "Eiffel",
  "espresso-libre": "Espresso Libre",
  github: "GitHub",
  idle: "IDLE",
  katzenmilch: "Katzenmilch",
  "kuroir-theme": "Kuroir Theme",
  lazy: "LAZY",
  "magicwb--amiga-": "MagicWB (Amiga)",
  "merbivore-soft": "Merbivore Soft",
  merbivore: "Merbivore",
  "monokai-bright": "Monokai Bright",
  monokai: "Monokai",
  "night-owl": "Night Owl",
  "oceanic-next": "Oceanic Next",
  "pastels-on-dark": "Pastels on Dark",
  "slush-and-poppies": "Slush and Poppies",
  "solarized-dark": "Solarized-dark",
  "solarized-light": "Solarized-light",
  spacecadet: "SpaceCadet",
  sunburst: "Sunburst",
  "textmate--mac-classic-": "Textmate (Mac Classic)",
  "tomorrow-night-blue": "Tomorrow-Night-Blue",
  "tomorrow-night-bright": "Tomorrow-Night-Bright",
  "tomorrow-night-eighties": "Tomorrow-Night-Eighties",
  "tomorrow-night": "Tomorrow-Night",
  tomorrow: "Tomorrow",
  twilight: "Twilight",
  "upstream-sunburst": "Upstream Sunburst",
  "vibrant-ink": "Vibrant Ink",
  "xcode-default": "Xcode_default",
  zenburnesque: "Zenburnesque",
  iplastic: "iPlastic",
  idlefingers: "idleFingers",
  krtheme: "krTheme",
  monoindustrial: "monoindustrial",
};

const importTheme = (theme) => {
  switch (theme) {
    case "active4d":
      return import("monaco-themes/themes/Active4D.json");
    case "all-hallows-eve":
      return import("monaco-themes/themes/All Hallows Eve.json");
    case "amy":
      return import("monaco-themes/themes/Amy.json");
    case "birds-of-paradise":
      return import("monaco-themes/themes/Birds of Paradise.json");
    case "blackboard":
      return import("monaco-themes/themes/Blackboard.json");
    case "brilliance-black":
      return import("monaco-themes/themes/Brilliance Black.json");
    case "brilliance-dull":
      return import("monaco-themes/themes/Brilliance Dull.json");
    case "chrome-devtools":
      return import("monaco-themes/themes/Chrome DevTools.json");
    case "clouds-midnight":
      return import("monaco-themes/themes/Clouds Midnight.json");
    case "clouds":
      return import("monaco-themes/themes/Clouds.json");
    case "cobalt":
      return import("monaco-themes/themes/Cobalt.json");
    case "dawn":
      return import("monaco-themes/themes/Dawn.json");
    case "dreamweaver":
      return import("monaco-themes/themes/Dreamweaver.json");
    case "eiffel":
      return import("monaco-themes/themes/Eiffel.json");
    case "espresso-libre":
      return import("monaco-themes/themes/Espresso Libre.json");
    case "github":
      return import("monaco-themes/themes/GitHub.json");
    case "idle":
      return import("monaco-themes/themes/IDLE.json");
    case "katzenmilch":
      return import("monaco-themes/themes/Katzenmilch.json");
    case "kuroir-theme":
      return import("monaco-themes/themes/Kuroir Theme.json");
    case "lazy":
      return import("monaco-themes/themes/LAZY.json");
    case "magicwb--amiga-":
      return import("monaco-themes/themes/MagicWB (Amiga).json");
    case "merbivore-soft":
      return import("monaco-themes/themes/Merbivore Soft.json");
    case "merbivore":
      return import("monaco-themes/themes/Merbivore.json");
    case "monokai-bright":
      return import("monaco-themes/themes/Monokai Bright.json");
    case "monokai":
      return import("monaco-themes/themes/Monokai.json");
    case "night-owl":
      return import("monaco-themes/themes/Night Owl.json");
    case "oceanic-next":
      return import("monaco-themes/themes/Oceanic Next.json");
    case "pastels-on-dark":
      return import("monaco-themes/themes/Pastels on Dark.json");
    case "slush-and-poppies":
      return import("monaco-themes/themes/Slush and Poppies.json");
    case "solarized-dark":
      return import("monaco-themes/themes/Solarized-dark.json");
    case "solarized-light":
      return import("monaco-themes/themes/Solarized-light.json");
    case "spacecadet":
      return import("monaco-themes/themes/SpaceCadet.json");
    case "sunburst":
      return import("monaco-themes/themes/Sunburst.json");
    case "textmate--mac-classic-":
      return import("monaco-themes/themes/Textmate (Mac Classic).json");
    case "tomorrow-night-blue":
      return import("monaco-themes/themes/Tomorrow-Night-Blue.json");
    case "tomorrow-night-bright":
      return import("monaco-themes/themes/Tomorrow-Night-Bright.json");
    case "tomorrow-night-eighties":
      return import("monaco-themes/themes/Tomorrow-Night-Eighties.json");
    case "tomorrow-night":
      return import("monaco-themes/themes/Tomorrow-Night.json");
    case "tomorrow":
      return import("monaco-themes/themes/Tomorrow.json");
    case "twilight":
      return import("monaco-themes/themes/Twilight.json");
    case "upstream-sunburst":
      return import("monaco-themes/themes/Upstream Sunburst.json");
    case "vibrant-ink":
      return import("monaco-themes/themes/Vibrant Ink.json");
    case "xcode-default":
      return import("monaco-themes/themes/Xcode_default.json");
    case "zenburnesque":
      return import("monaco-themes/themes/Zenburnesque.json");
    case "iplastic":
      return import("monaco-themes/themes/iPlastic.json");
    case "idlefingers":
      return import("monaco-themes/themes/idleFingers.json");
    case "krtheme":
      return import("monaco-themes/themes/krTheme.json");
    case "monoindustrial":
      return import("monaco-themes/themes/monoindustrial.json");
    default:
      throw new Error(`Unknown theme: ${theme}`);
  }
};

const defineTheme = (theme) => {
  return new Promise((res) => {
    Promise.all([loader.init(), importTheme(theme)]).then(
      ([monaco, themeData]) => {
        monaco.editor.defineTheme(theme, themeData);
        res();
      }
    );
  });
};

export { defineTheme };
