import {
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
  defineConfig,
  presetWind3,
  presetAttributify,
} from "unocss";
import presetTagify from "@unocss/preset-tagify";

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.([jt]sx?|mdx?)($|\?)/, "src/**/*.{js,ts}"],
    },
    filesystem: ["{projectRoot}/**/*.[jt]s?(x)?(.snap)"],
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTagify({
      prefix: "p9e-",
    }),
    presetIcons({
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],

  theme: {
    breakpoints: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1536px",
    },
    fontFamily: {
       sans: ["Helvetica", "Arial", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      source: ["Source Serif 4", "serif"],
      custom: ['"Custom Font"', "sans-serif"],
    },
    colors: {
      primary: {
        DEFAULT: "#2061b1", // Brand main blue (logo blue)
        50: "#e5f0fc", // Lighter blue for backgrounds
        100: "#c7e3fa",
        200: "#8abcf4",
        300: "#63a1e9",
        400: "#3477cf",
        500: "#2061b1", // Main
        600: "#194e91",
        700: "#163f75",
        800: "#0d2743",
        900: "#071427",
        950: "#030917",
      },
      accent: {
        DEFAULT: "#e53e3e",
        50: "#fceaea",
        100: "#fad7d7",
        200: "#f5b4b4",
        300: "#f18686",
        400: "#ed5757",
        500: "#e53e3e",
        600: "#c82a2a",
        700: "#991f1f",
        800: "#6b1414",
        900: "#3d0909",
        950: "#240303",
      },
      secondary: {
        DEFAULT: "#7637bc",
        50: "#f3eafd",
        100: "#e4d6fa",
        200: "#c7b0ec",
        300: "#ac89dd",
        400: "#9768ce",
        500: "#7637bc",
        600: "#592b90",
        700: "#422167",
        800: "#2b143d",
        900: "#15091f",
        950: "#0b0410",
      },
      success: {
        DEFAULT: "#27ae60",
        50: "#e6f9ef",
        100: "#c8f2dc",
        200: "#94eac0",
        300: "#63dfa1",
        400: "#3acc86",
        500: "#27ae60",
        600: "#1e894d",
        700: "#17673c",
        800: "#104628",
        900: "#082616",
        950: "#04120b",
      },
      danger: {
        DEFAULT: "#e53e3e",
        50: "#fceaea",
        100: "#fad7d7",
        200: "#f5b4b4",
        300: "#f18686",
        400: "#ed5757",
        500: "#e53e3e",
        600: "#c82a2a",
        700: "#991f1f",
        800: "#6b1414",
        900: "#3d0909",
        950: "#240303",
      },
      warning: {
        DEFAULT: "#ffb300",
        50: "#fff8e1",
        100: "#ffecb3",
        200: "#ffe082",
        300: "#ffd54f",
        400: "#ffca28",
        500: "#ffb300",
        600: "#ffa000",
        700: "#ff8f00",
        800: "#ff6f00",
        900: "#e65100",
        950: "#663c00",
      },
      info: {
        DEFAULT: "#00abd7",
        50: "#e0f9ff",
        100: "#b3ecfc",
        200: "#80def9",
        300: "#4dd1f6",
        400: "#26c6f2",
        500: "#00abd7",
        600: "#008bad",
        700: "#006680",
        800: "#004557",
        900: "#002129",
        950: "#001014",
      },
      light: {
        DEFAULT: "#f5f7fa",
        50: "#ffffff",
        100: "#f7fafc",
        200: "#e4e7eb",
        300: "#cfd8dc",
        400: "#b0bec5",
        500: "#90a4ae",
        600: "#78909c",
        700: "#62727b",
        800: "#4b5c68",
        900: "#263238",
        950: "#121417",
      },
      dark: {
        DEFAULT: "#23272f",
        50: "#eceff1",
        100: "#cfd8dc",
        200: "#b0bec5",
        300: "#90a4ae",
        400: "#78909c",
        500: "#62727b",
        600: "#455a64",
        700: "#374151",
        800: "#23272f",
        900: "#181b21",
        950: "#0b0d10",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },

  shortcuts: [
    // ==== BUTTONS (Dynamic, as before) ====
    [
      /^btn-(.*?)(?:-(\d{3}))?$/,
      ([, c, s]) => {
        if (s) {
          const ts = parseInt(s, 10);
          const shade = ts >= 500 ? 50 : 950;
          const dshade =
            ts >= 500
              ? Math.max(0, Math.min(ts - 200, 950))
              : Math.min(ts + 200, 950);
          const hoverShade =
            ts > 750 ? Math.max(ts - 200, 0) : Math.min(ts + 200, 950);
          return `inline-block font-semibold transition focus:outline-none px-4 py-2 rounded bg-${c}-${s} text-${c}-${shade} hover:bg-${c}-${hoverShade} dark:bg-${c}-${dshade} dark:hover:bg-${c}-${Math.max(dshade - 200, 50)} dark:text-${c}-${Math.max(shade - 200, 50)} dark:hover:text-${c}-${Math.min(dshade + 200, 950)}`;
        } else {
          return `inline-block font-semibold transition focus:outline-none px-4 py-2 rounded bg-${c} text-${c}-50 hover:(bg-${c}-700 text-${c}-50) dark:(bg-${c}-300 text-${c}-950) dark:(hover:(bg-${c}-500 text-${c}-50))`;
        }
      },
    ],
    [
      /^btns-(lg|md|sm|xs)$/,
      ([, size]) => {
        const paddingMap = {
          lg: "px-4 py-3",
          md: "px-3 py-2",
          sm: "px-2 py-1",
          xs: "px-2 py-0.5",
        };
        return paddingMap[size as keyof typeof paddingMap];
      },
    ],

    // ==== FORMS (expanded) ====
    [
      /^form-input(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) => {
        const base =
          "w-full px-4 py-2 border rounded focus:outline-none font-sans transition";
        const colorCls = color
          ? `border-${color}-${shade || 600} focus:ring-2 focus:ring-${color}-${shade || 400}`
          : "border-light-800 focus:ring-2 focus:ring-primary-400";
        return `${base} ${colorCls}`;
      },
    ],
    [
      /^form-label(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-(xs|sm|md|lg|xl))?$/,
      ([, color, shade, size]) => {
        const base = "block mb-1 font-medium font-sans";
        const colorCls = color
          ? `text-${color}-${shade || 700}`
          : "text-dark-700";
        const sizeMap = {
          xs: "text-xs",
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
          xl: "text-xl",
        };
        const sizeCls = size
          ? sizeMap[size as keyof typeof sizeMap]
          : "text-sm";
        return `${base} ${colorCls} ${sizeCls}`;
      },
    ],
    [
      /^form-textarea(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `w-full px-4 py-2 border rounded focus:outline-none font-sans transition ${color ? `border-${color}-${shade || 600} focus:ring-2 focus:ring-${color}-${shade || 400}` : "border-light-800 focus:ring-2 focus:ring-primary-400"}`,
    ],
    [
      /^form-select(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `w-full px-4 py-2 border rounded bg-white focus:outline-none font-sans transition ${color ? `border-${color}-${shade || 600} focus:ring-2 focus:ring-${color}-${shade || 400}` : "border-light-800 focus:ring-2 focus:ring-primary-400"}`,
    ],
    [
      /^form-hint(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `text-xs mt-1 ${color ? `text-${color}-${shade || 400}` : "text-dark-400"}`,
    ],
    [
      /^form-error(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `text-xs mt-1 ${color ? `text-${color}-${shade || 600}` : "text-danger-600"}`,
    ],
    [
      /^form-inputs-(xs|sm|md|lg|xl)$/,
      ([, size]) => {
        const sizeMap = {
          xs: "px-2 py-1 text-xs",
          sm: "px-3 py-2 text-sm",
          md: "px-4 py-2 text-base",
          lg: "px-6 py-3 text-lg",
          xl: "px-8 py-4 text-xl",
        };
        return sizeMap[size as keyof typeof sizeMap];
      },
    ],
    [
      /^form-checkbox(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `rounded focus:ring-${color || "primary"}-${shade || 500} border-gray-300`,
    ],
    [
      /^form-radio(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `form-checkbox rounded-full focus:ring-${color || "primary"}-${shade || 500} border-gray-300`,
    ],
    {
      "form-input-error":
        "border-danger-500 text-danger-700 placeholder-danger-300",
      "form-group": "mb-5",
      "form-check": "flex items-center space-x-2",
      "input-group": "flex w-full",
      "input-icon":
        "inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600",
    },

    // ==== ALERTS, BADGES, CHIPS (Dynamic per color) ====
    [
      /^alert-(\w+)$/,
      ([, c]) =>
        `rounded-md p-4 flex items-center gap-3 bg-${c}-100 text-${c}-800 border-l-4 border-${c}-500`,
    ],
    [
      /^badge-(\w+)$/,
      ([, c]) =>
        `inline-block rounded-full px-3 py-1 text-xs font-semibold bg-${c}-100 text-${c}-800`,
    ],
    [
      /^chip-(\w+)$/,
      ([, c]) =>
        `inline-flex items-center px-3 py-1 rounded-full bg-${c}-200 text-${c}-800 text-sm font-medium`,
    ],

    // ==== MODALS, DRAWERS ====
    [
      /^modal-content(?:-(sm|md|lg|xl|2xl))?$/,
      ([, size]) => {
        const widthMap = {
          sm: "max-w-sm",
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-xl",
          xxl: "max-w-2xl",
        };
        const maxWidth = size
          ? widthMap[size as keyof typeof widthMap]
          : "max-w-lg";
        return `bg-white rounded-xl shadow-xl p-8 z-50 w-full ${maxWidth}`;
      },
    ],
    [
      /^modal-backdrop(?:-([a-z]+(?:-\d+)?))?(?:-z(\d+))?$/,
      ([, color, z]) => {
        const bg = color
          ? `bg-${color.replace("-", "-")}/50`
          : "bg-dark-950/50";
        const zIndex = z ? `z-${z}` : "z-40";
        return `fixed inset-0 ${bg} ${zIndex} flex items-center justify-center`;
      },
    ],
    [
      /^drawer-(left|right|top|bottom)?(?:-(\d+))?(?:-([a-z]+)(?:-(\d+))?)?$/,
      ([, pos, w, color, shade]) => {
        const side = pos || "left";
        let base = `fixed z-50 bg-white shadow-lg transition-transform`;
        if (side === "left") base += " top-0 left-0 h-full";
        if (side === "right") base += " top-0 right-0 h-full";
        if (side === "top") base += " top-0 left-0 w-full";
        if (side === "bottom") base += " bottom-0 left-0 w-full";
        if (w) {
          base += side === "top" || side === "bottom" ? ` h-${w}` : ` w-${w}`;
        } else {
          base += side === "top" || side === "bottom" ? " h-64" : " w-64";
        }
        if (color) {
          base += ` bg-${color}${shade ? `-${shade}` : ""}`;
        }
        return base;
      },
    ],

    // ==== CARDS, CONTAINERS, DIVIDERS ====
    [
      /^card(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-shadow-(sm|md|lg|xl|none))?(?:-radius-(sm|md|lg|xl|full))?(?:-p-(\d+))?$/,
      ([, color, shade, shadow, radius, padding]) => {
        const base = ["bg-white", "rounded-xl", "shadow-lg", "p-6"];

        if (color) base[0] = `bg-${color}${shade ? `-${shade}` : ""}`;
        if (shadow) base[2] = shadow === "none" ? "" : `shadow-${shadow}`;
        if (radius) base[1] = `rounded-${radius}`;
        if (padding) base[3] = `p-${padding}`;

        // Filter out empty
        return base.filter(Boolean).join(" ");
      },
    ],
    [
      /^card-header(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-(xs|sm|md|lg|xl))?$/,
      ([, color, shade, size]) => {
        const base = ["mb-4", "text-xl", "font-semibold", "text-dark-800"];
        if (color) base[3] = `text-${color}-${shade || 800}`;
        const sizeMap = {
          xs: "text-xs",
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
          xl: "text-xl",
        };
        if (size) base[1] = sizeMap[size as keyof typeof sizeMap];
        return base.join(" ");
      },
    ],
    [
      /^card-footer(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-(xs|sm|md|lg|xl))?$/,
      ([, color, shade, size]) => {
        const base = [
          "mt-4",
          "pt-4",
          "border-t",
          "border-light-200",
          "text-right",
        ];
        if (color) base[3] = `border-${color}-${shade || 200}`;
        const sizeMap = {
          xs: "text-xs",
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
          xl: "text-xl",
          xxl:"text-xxl"
        };
        if (size) base.push(sizeMap[size as keyof typeof sizeMap]);
        return base.join(" ");
      },
    ],
    [
      /^divider(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-(\d))?$/,
      ([, color, shade, thick]) => {
        const base = ["h-px", "my-6", "w-full", "bg-light-300"];
        if (color) base[3] = `bg-${color}-${shade || 300}`;
        if (thick) base[0] = `h-${thick}`;
        return base.join(" ");
      },
    ],
    {
      "card-body": "p-6",
      "card-image": "w-full h-48 object-cover rounded-t-xl mb-4",
      "card-title": "text-xl font-semibold text-dark-800 mb-2",
      "card-text": "text-base text-dark-600",
      "card-actions": "flex justify-end mt-4 space-x-2",
    },

    // ==== AVATARS ====
    [
      /^avatar(?:-(xs|sm|md|lg|xl))?(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-border-([a-z]+)(?:-(\d{2,3}))?(?:-(\d+))?)?$/,
      ([
        ,
        size,
        bgColor,
        bgShade,
        textColor,
        textShade,
        borderColor,
        borderShade,
        borderThick,
      ]) => {
        // Size mapping
        const sizeMap = {
          xs: "w-6 h-6 text-base",
          sm: "w-10 h-10 text-lg",
          md: "w-14 h-14 text-xl",
          lg: "w-16 h-16 text-2xl",
          xl: "w-20 h-20 text-3xl",
          xxl: "w-24 h-24 text-4xl",
        };
        const sz = size
          ? sizeMap[size as keyof typeof sizeMap]
          : "w-10 h-10 text-lg";

        // BG color
        const bg = bgColor
          ? `bg-${bgColor}${bgShade ? `-${bgShade}` : ""}`
          : "bg-light-300";

        // Text color
        const tc = textColor
          ? `text-${textColor}${textShade ? `-${textShade}` : ""}`
          : "text-dark-600";

        // Border
        let border = "";
        if (borderColor) {
          border = `border border-${borderColor}${borderShade ? `-${borderShade}` : ""}`;
          if (borderThick) border += ` border-${borderThick}`;
        }

        return `inline-block rounded-full ${bg} ${tc} font-bold flex items-center justify-center ${sz} ${border}`.trim();
      },
    ],

    // ==== TYPOGRAPHY ====

    [
      /^h-(\d)(?:-(bold|semibold|medium|normal))?(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, n, weight, color, shade]) => {
        const sizes = {
          1: "text-4xl",
          2: "text-2xl",
          3: "text-xl",
          4: "text-lg",
          5: "text-base",
          6: "text-sm",
        };
        const weights = {
          bold: "font-bold",
          semibold: "font-semibold",
          medium: "font-medium",
          normal: "font-normal",
        };

        const nNum = Number(n);
        const sizeClass = sizes[nNum as keyof typeof sizes] || "text-base";
        const weightClass =
          (weight && weights[weight as keyof typeof weights]) ||
          (nNum === 1
            ? "font-bold"
            : nNum === 2
              ? "font-semibold"
              : nNum === 3
                ? "font-medium"
                : "font-normal");
        const mb = nNum === 1 ? "mb-4" : "mb-2";

        let colorClass = "";
        if (color && shade) {
          colorClass = `text-${color}-${shade}`;
        } else if (color) {
          colorClass = `text-${color}-900`;
        } else {
          colorClass = nNum <= 2 ? "text-dark-900" : "text-dark-800";
        }

        return `${sizeClass} ${weightClass} ${mb} ${colorClass}`;
      },
    ],
    // Dynamic lead
    [
      /^lead(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `text-lg ${color ? `text-${color}-${shade || 600}` : "text-dark-600"} mb-6`,
    ],
    // Dynamic muted
    [
      /^muted(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `text-sm ${color ? `text-${color}-${shade || 400}` : "text-dark-400"}`,
    ],

    // ===== Container, Grid, Flexbox ====

    [
      /^container(?:-(xs|sm|md|lg|xl|2xl|xxl))?$/,
      ([, size]) => {
        const maxWidths = {
          xs: "max-w-xs",
          sm: "max-w-sm",
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-xl",
          xxl: "max-w-full",
        };
        const maxWidth = size
          ? maxWidths[size as keyof typeof maxWidths] || "max-w-full"
          : "max-w-7xl";
        return `w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`;
      },
    ],
    // Dynamic grid (columns and optional gap)
    [
      /^grid-(\d{1,2})(?:-(\d{1,2}))?$/,
      ([, cols, gap]) => {
        const colNum = cols || 1;
        const gapNum = gap || 4;
        return `grid grid-cols-${colNum} gap-${gapNum}`;
      },
    ],
    // Dynamic flex row/col (bootstrap style)
    ["row", "flex flex-wrap -mx-2"],
    [
      /^col(?:-(\d{1,2}))?$/,
      ([, span]) => {
        if (!span) return "flex-1 px-2";
        const fractions = {
          1: "w-1/12",
          2: "w-2/12",
          3: "w-3/12",
          4: "w-4/12",
          5: "w-5/12",
          6: "w-6/12",
          7: "w-7/12",
          8: "w-8/12",
          9: "w-9/12",
          10: "w-10/12",
          11: "w-11/12",
          12: "w-full",
        };
        const spanNum = Number(span);
        return `${fractions[spanNum as keyof typeof fractions] || "flex-1"} px-2`;
      },
    ],
    // Grid gap
    [/^grid-gap-(\d{1,2})$/, ([, gap]) => `gap-${gap}`],
    // grid-fit-200   → grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
    [
      /^grid-fit-(\d+)$/,
      ([, size]) => `grid grid-cols-[repeat(auto-fit,minmax(${size}px,1fr))]`,
    ],

    // grid-fill-180  → grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
    [
      /^grid-fill-(\d+)$/,
      ([, size]) => `grid grid-cols-[repeat(auto-fill,minmax(${size}px,1fr))]`,
    ],

    // grid-minmax-150-1fr → grid-cols-[minmax(150px,1fr)]
    [
      /^grid-minmax-(\d+)-(.+)$/,
      ([, min, max]) => `grid grid-cols-[minmax(${min}px,${max})]`,
    ],
    [
      /^table(?:-([a-z]+)(?:-(\d{2,3}))?)?(?:-border(?:-([a-z]+)(?:-(\d{2,3}))?)?)?(?:-striped)?$/,
      ([, color, shade, borderColor, borderShade, striped]) => {
        const base = [
          "min-w-full",
          "divide-y",
          "rounded-lg",
          "overflow-hidden",
          "bg-white",
        ];

        // Table header color
        if (color) base.push(`text-${color}-${shade || 900}`);

        // Table border
        if (borderColor)
          base.push(
            `border border-${borderColor}${borderShade ? `-${borderShade}` : "-200"}`
          );

        // Table striping
        if (striped !== undefined) base.push("divide-y divide-light-200");

        return base.join(" ");
      },
    ],
    [
      /^table-header(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        `font-semibold ${color ? `text-${color}-${shade ? Math.min(Number(shade) + 600, 900) : 700}` : " text-dark-700"}`,
    ],

    // table-row-[hovercolor]-[shade]
    [
      /^table-row(?:-([a-z]+)(?:-(\d{2,3}))?)?$/,
      ([, color, shade]) =>
        color ? `hover:bg-${color}-${shade || 50}` : "hover:bg-light-50",
    ],
    {
      "table-cell": "p-3 align-middle",
      "table-striped-row": "even:bg-light-50 odd:bg-white",
    },
    [
      /^animate-([a-z-]+)(?:-(\d+))?(?:-(linear|ease-in|ease-out|ease-in-out))?(?:-delay-(\d+))?$/,
      ([, name, duration, easing, delay]) => {
        const dur = duration ? `duration-${duration}` : "duration-500";
        const eas = easing ? `ease-${easing}` : "ease-in-out";
        const del = delay ? `delay-${delay}` : "";
        return `animate-${name} ${dur} ${eas} ${del}`.trim();
      },
    ],
    {
      "fade-in": "animate-fade-in duration-500 ease-in",
      "fade-out": "animate-fade-out duration-500 ease-out",
      bounce: "animate-bounce duration-700",
      spin: "animate-spin",
      pulse: "animate-pulse",
    },
    [
      /^transition(?:-([a-z-]+))?(?:-(\d+))?(?:-(linear|ease-in|ease-out|ease-in-out))?(?:-delay-(\d+))?$/,
      ([, prop, duration, easing, delay]) => {
        const property = prop ? `transition-${prop}` : "transition-all";
        const dur = duration ? `duration-${duration}` : "";
        const eas = easing ? `ease-${easing}` : "";
        const del = delay ? `delay-${delay}` : "";
        return [property, dur, eas, del].filter(Boolean).join(" ");
      },
    ],
    {
      "transition-fade": "transition-opacity duration-300 ease-in-out",
      "transition-slide": "transition-transform duration-300 ease-in-out",
    },
  ],

  details: true,
  safelist: "dark-mode light-mode".split(" "),
});
