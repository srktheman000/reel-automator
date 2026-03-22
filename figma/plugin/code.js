// ─── AI Reel Creator — Figma Design System Builder ───────────────────────────
// Drop this plugin folder into Figma (Plugins → Development → Import plugin from manifest)
// then run it. It creates all color styles, text styles, and page frames automatically.
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 340, height: 540 });

// ─── Token Data ───────────────────────────────────────────────────────────────

const COLORS = {
  // Primitives
  white: '#ffffff', black: '#000000',
  gray50: '#f9f9f9', gray100: '#f4f4f4', gray200: '#e5e5e5',
  gray300: '#d1d1d1', gray400: '#a8a8a8', gray500: '#777777',
  gray600: '#555555', gray700: '#383838', gray800: '#282828',
  gray900: '#1e1e1e', gray950: '#191919',
  red50: '#fef2f2', red100: '#fee2e2', red500: '#ef4444',
  red600: '#dc2626', red700: '#b91c1c',
  green50: '#f0fdf4', green100: '#dcfce7', green200: '#bbf7d0',
  green400: '#4ade80', green500: '#22c55e', green600: '#16a34a',
  green700: '#15803d', green800: '#166534', green900: '#052e16',
  blue50: '#eff6ff', blue100: '#dbeafe', blue200: '#bfdbfe',
  blue300: '#93c5fd', blue700: '#1d4ed8', blue800: '#1e40af',
  blue900: '#1e3a8a',
  purple50: '#faf5ff', purple100: '#f3e8ff', purple300: '#d8b4fe',
  purple700: '#7e22ce', purple900: '#581c87',
  orange50: '#fff7ed', orange100: '#ffedd5', orange300: '#fdba74',
  orange700: '#c2410c', orange900: '#7c2d12',
  yellow50: '#fefce8', yellow100: '#fef9c3',
  pink50: '#fdf2f8', pink100: '#fce7f3', pink200: '#fbcfe8',
};

// Light mode semantic colors — [name, hex, description]
const LIGHT_STYLES = [
  ['background',           '#ffffff',  'Page canvas, modal backdrops'],
  ['foreground',           '#191919',  'Body text, headings'],
  ['card',                 '#ffffff',  'Card surface'],
  ['card/foreground',      '#191919',  'Text on card'],
  ['primary',              '#282828',  'CTA buttons, active states'],
  ['primary/foreground',   '#f9f9f9',  'Text on primary'],
  ['secondary',            '#f4f4f4',  'Secondary buttons, hover'],
  ['secondary/foreground', '#282828',  'Text on secondary'],
  ['muted',                '#f4f4f4',  'Inactive tabs, AI bubble bg'],
  ['muted/foreground',     '#777777',  'Placeholders, captions, metadata'],
  ['accent',               '#f4f4f4',  'Hover states on ghost elements'],
  ['accent/foreground',    '#282828',  'Text on accent'],
  ['destructive',          '#ef4444',  'Error text, delete actions'],
  ['destructive/foreground','#ffffff', 'Text on destructive'],
  ['border',               '#e5e5e5',  'Dividers, card borders'],
  ['input',                '#e5e5e5',  'Input field border'],
  ['ring',                 '#a8a8a8',  'Focus rings'],
  ['sidebar/background',   '#f9f9f9',  'Sidebar panel'],
  ['sidebar/border',       '#e5e5e5',  'Sidebar dividers'],
  ['sidebar/accent',       '#e5e5e5',  'Sidebar hover'],
  // Scene type badges
  ['scene/hook/bg',        '#f3e8ff',  'Hook badge background'],
  ['scene/hook/text',      '#7e22ce',  'Hook badge text'],
  ['scene/context/bg',     '#dbeafe',  'Context badge background'],
  ['scene/context/text',   '#1d4ed8',  'Context badge text'],
  ['scene/value/bg',       '#dcfce7',  'Value badge background'],
  ['scene/value/text',     '#15803d',  'Value badge text'],
  ['scene/cta/bg',         '#ffedd5',  'CTA badge background'],
  ['scene/cta/text',       '#c2410c',  'CTA badge text'],
  // Template accents
  ['template/educational/bg',     '#eff6ff', 'Educational template'],
  ['template/educational/border', '#bfdbfe', 'Educational template border'],
  ['template/marketing/bg',       '#fefce8', 'Marketing template'],
  ['template/marketing/border',   '#fef9c3', 'Marketing template border'],
  ['template/entertainment/bg',   '#fdf2f8', 'Entertainment template'],
  ['template/entertainment/border','#fbcfe8','Entertainment template border'],
  ['template/storytelling/bg',    '#faf5ff', 'Storytelling template'],
  ['template/storytelling/border','#f3e8ff', 'Storytelling template border'],
  ['template/product/bg',         '#f0fdf4', 'Product template'],
  ['template/product/border',     '#bbf7d0', 'Product template border'],
];

// Dark mode semantic colors
const DARK_STYLES = [
  ['dark/background',           '#191919', 'Dark canvas'],
  ['dark/foreground',           '#f9f9f9', 'Near-white text'],
  ['dark/card',                 '#282828', 'Elevated surface'],
  ['dark/card/foreground',      '#f9f9f9', ''],
  ['dark/primary',              '#e5e5e5', 'Light button on dark bg'],
  ['dark/primary/foreground',   '#1e1e1e', ''],
  ['dark/secondary',            '#383838', ''],
  ['dark/muted',                '#383838', 'Dark muted surface'],
  ['dark/muted/foreground',     '#a8a8a8', 'Medium gray secondary text'],
  ['dark/destructive',          '#dc2626', ''],
  ['dark/border',               'rgba(255,255,255,0.10)', 'Translucent white border'],
  ['dark/input',                'rgba(255,255,255,0.15)', ''],
  ['dark/ring',                 '#a8a8a8', ''],
  ['dark/scene/hook/bg',        'rgba(88,28,135,0.30)',  ''],
  ['dark/scene/hook/text',      '#d8b4fe', ''],
  ['dark/scene/context/bg',     'rgba(30,58,138,0.30)',  ''],
  ['dark/scene/context/text',   '#93c5fd', ''],
  ['dark/scene/value/bg',       'rgba(5,46,22,0.30)',    ''],
  ['dark/scene/value/text',     '#4ade80', ''],
  ['dark/scene/cta/bg',         'rgba(67,20,7,0.30)',    ''],
  ['dark/scene/cta/text',       '#fdba74', ''],
];

// Typography styles — [name, size, weight, lineHeight, letterSpacing, family]
const TEXT_STYLES = [
  ['display',     36, 700, 1.15, -0.02, 'Geist Sans'],
  ['heading/xl',  24, 600, 1.25, -0.01, 'Geist Sans'],
  ['heading/lg',  20, 600, 1.30, -0.01, 'Geist Sans'],
  ['heading/md',  16, 600, 1.40,  0,    'Geist Sans'],
  ['body/lg',     16, 400, 1.60,  0,    'Geist Sans'],
  ['body/md',     14, 400, 1.60,  0,    'Geist Sans'],
  ['body/sm',     13, 400, 1.55,  0,    'Geist Sans'],
  ['caption',     12, 400, 1.50,  0.01, 'Geist Sans'],
  ['mono',        13, 400, 1.60,  0,    'Geist Mono'],
  // Mobile variants
  ['mobile/display',    28, 700, 1.15, -0.02, 'Geist Sans'],
  ['mobile/heading/xl', 20, 600, 1.25, -0.01, 'Geist Sans'],
  ['mobile/heading/lg', 18, 600, 1.30, -0.01, 'Geist Sans'],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(text, level = 'info') {
  figma.ui.postMessage({ type: 'log', text, level });
}

function progress(pct, label) {
  figma.ui.postMessage({ type: 'progress', pct, label });
}

function hexToRgb(hex) {
  // Handle rgba strings like rgba(88,28,135,0.30)
  if (hex.startsWith('rgba')) {
    const m = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (m) return { r: +m[1]/255, g: +m[2]/255, b: +m[3]/255, a: +m[4] };
  }
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >>  8) & 255) / 255,
    b: ((n >>  0) & 255) / 255,
    a: 1
  };
}

function solidPaint(hex) {
  const { r, g, b, a } = hexToRgb(hex);
  return [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
}

function getOrCreatePage(name) {
  const existing = figma.root.children.find(p => p.name === name);
  if (existing) return existing;
  const page = figma.createPage();
  page.name = name;
  return page;
}

async function loadFont(family, weight) {
  try {
    await figma.loadFontAsync({ family, style: weight === 700 ? 'Bold' : weight === 600 ? 'SemiBold' : weight === 500 ? 'Medium' : 'Regular' });
  } catch {
    // Fallback to Inter if Geist not installed
    try {
      await figma.loadFontAsync({ family: 'Inter', style: weight === 700 ? 'Bold' : weight === 600 ? 'SemiBold' : 'Regular' });
    } catch {
      await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
    }
  }
}

async function loadAllFonts() {
  const combos = [
    ['Geist Sans', 400], ['Geist Sans', 500], ['Geist Sans', 600], ['Geist Sans', 700],
    ['Geist Mono', 400],
    ['Inter', 400], ['Inter', 500], ['Inter', 600], ['Inter', 700],
  ];
  for (const [family, weight] of combos) {
    await loadFont(family, weight);
  }
}

// ─── Step 1: Color Styles ─────────────────────────────────────────────────────

async function buildColorStyles() {
  log('Creating light mode color styles…', 'info');
  const all = [...LIGHT_STYLES, ...DARK_STYLES];
  let count = 0;
  for (const [name, hex, desc] of all) {
    const fullName = name.startsWith('dark/') ? name : `light/${name}`;
    let style = figma.getLocalPaintStyles().find(s => s.name === fullName);
    if (!style) style = figma.createPaintStyle();
    style.name = fullName;
    style.description = desc || '';
    const { r, g, b, a } = hexToRgb(hex);
    style.paints = [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
    count++;
  }
  log(`✓ ${count} color styles created`, 'ok');
}

// ─── Step 2: Text Styles ──────────────────────────────────────────────────────

async function buildTextStyles() {
  log('Creating text styles…', 'info');
  let count = 0;
  for (const [name, size, weight, lineH, letterS, family] of TEXT_STYLES) {
    let style = figma.getLocalTextStyles().find(s => s.name === name);
    if (!style) style = figma.createTextStyle();
    style.name = name;
    const styleName = weight === 700 ? 'Bold' : weight === 600 ? 'SemiBold' : weight === 500 ? 'Medium' : 'Regular';
    try {
      await figma.loadFontAsync({ family, style: styleName });
      style.fontName = { family, style: styleName };
    } catch {
      try {
        await figma.loadFontAsync({ family: 'Inter', style: styleName });
        style.fontName = { family: 'Inter', style: styleName };
      } catch {
        await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
        style.fontName = { family: 'Roboto', style: 'Regular' };
      }
    }
    style.fontSize = size;
    style.lineHeight = { unit: 'PIXELS', value: size * lineH };
    style.letterSpacing = { unit: 'PERCENT', value: letterS * 100 };
    count++;
  }
  log(`✓ ${count} text styles created`, 'ok');
}

// ─── Step 3: Token Reference Page ────────────────────────────────────────────

async function buildTokenPage() {
  log('Building Token Reference page…', 'info');
  const page = getOrCreatePage('🎨 Design Tokens');
  figma.currentPage = page;

  // Clear existing
  for (const node of page.children) node.remove();

  // ── Color swatch grid ──
  const swatchFrame = figma.createFrame();
  swatchFrame.name = 'Color Swatches — Light Mode';
  swatchFrame.resize(1440, 720);
  swatchFrame.x = 0; swatchFrame.y = 0;
  swatchFrame.fills = solidPaint('#ffffff');
  swatchFrame.layoutMode = 'VERTICAL';
  swatchFrame.itemSpacing = 32;
  swatchFrame.paddingLeft = swatchFrame.paddingRight = 48;
  swatchFrame.paddingTop = swatchFrame.paddingBottom = 48;
  swatchFrame.primaryAxisSizingMode = 'AUTO';
  swatchFrame.counterAxisSizingMode = 'FIXED';
  page.appendChild(swatchFrame);

  // Title
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  const title = figma.createText();
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fontSize = 24;
  title.characters = 'Design Tokens — Color System';
  title.fills = solidPaint('#191919');
  swatchFrame.appendChild(title);

  // Swatch row helper
  async function addSwatchRow(label, swatches) {
    await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

    const row = figma.createFrame();
    row.name = label;
    row.layoutMode = 'VERTICAL';
    row.itemSpacing = 10;
    row.fills = [{ type: 'SOLID', color: { r:0,g:0,b:0 }, opacity: 0 }];
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';

    const rowLabel = figma.createText();
    rowLabel.fontName = { family: 'Inter', style: 'SemiBold' };
    rowLabel.fontSize = 12;
    rowLabel.characters = label;
    rowLabel.fills = solidPaint('#777777');
    row.appendChild(rowLabel);

    const swatchRow = figma.createFrame();
    swatchRow.name = 'swatches';
    swatchRow.layoutMode = 'HORIZONTAL';
    swatchRow.itemSpacing = 8;
    swatchRow.fills = [{ type: 'SOLID', color: { r:0,g:0,b:0 }, opacity: 0 }];
    swatchRow.primaryAxisSizingMode = 'AUTO';
    swatchRow.counterAxisSizingMode = 'AUTO';

    for (const [name, hex] of swatches) {
      const swatch = figma.createFrame();
      swatch.name = name;
      swatch.resize(80, 80);
      swatch.cornerRadius = 8;
      const { r, g, b, a } = hexToRgb(hex);
      swatch.fills = [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
      swatch.strokes = solidPaint('#e5e5e5');
      swatch.strokeWeight = 1;
      swatch.layoutMode = 'VERTICAL';
      swatch.primaryAxisAlignItems = 'MAX';
      swatch.paddingLeft = swatch.paddingRight = 6;
      swatch.paddingBottom = 6;

      const swatchLabel = figma.createText();
      swatchLabel.fontName = { family: 'Inter', style: 'Regular' };
      swatchLabel.fontSize = 9;
      swatchLabel.characters = name.split('/').pop();
      // Auto-pick text color based on luminance
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      swatchLabel.fills = solidPaint(lum > 0.5 ? '#282828' : '#f0f0f0');
      swatchLabel.textAlignHorizontal = 'LEFT';
      swatch.appendChild(swatchLabel);

      swatchRow.appendChild(swatch);
    }

    row.appendChild(swatchRow);
    swatchFrame.appendChild(row);
  }

  await addSwatchRow('Semantic — Light Mode', [
    ['background', '#ffffff'], ['foreground', '#191919'], ['card', '#ffffff'],
    ['primary', '#282828'], ['primary/fg', '#f9f9f9'],
    ['secondary', '#f4f4f4'], ['muted', '#f4f4f4'], ['muted/fg', '#777777'],
    ['destructive', '#ef4444'], ['border', '#e5e5e5'], ['ring', '#a8a8a8'],
  ]);

  await addSwatchRow('Scene Type Badges', [
    ['hook/bg', '#f3e8ff'], ['hook/text', '#7e22ce'],
    ['context/bg', '#dbeafe'], ['context/text', '#1d4ed8'],
    ['value/bg', '#dcfce7'], ['value/text', '#15803d'],
    ['cta/bg', '#ffedd5'], ['cta/text', '#c2410c'],
  ]);

  await addSwatchRow('Template Accents', [
    ['edu/bg', '#eff6ff'], ['edu/border', '#bfdbfe'],
    ['mkt/bg', '#fefce8'], ['mkt/border', '#fef9c3'],
    ['ent/bg', '#fdf2f8'], ['ent/border', '#fbcfe8'],
    ['story/bg', '#faf5ff'], ['story/border', '#f3e8ff'],
    ['prod/bg', '#f0fdf4'], ['prod/border', '#bbf7d0'],
  ]);

  await addSwatchRow('Dark Mode Semantics', [
    ['dark/bg', '#191919'], ['dark/fg', '#f9f9f9'], ['dark/card', '#282828'],
    ['dark/primary', '#e5e5e5'], ['dark/muted', '#383838'], ['dark/muted/fg', '#a8a8a8'],
    ['dark/border', '#333333'], ['dark/destructive', '#dc2626'],
  ]);

  // Grays
  await addSwatchRow('Gray Scale', [
    ['50','#f9f9f9'],['100','#f4f4f4'],['200','#e5e5e5'],['300','#d1d1d1'],
    ['400','#a8a8a8'],['500','#777777'],['600','#555555'],['700','#383838'],
    ['800','#282828'],['900','#1e1e1e'],['950','#191919'],
  ]);

  // ── Type specimen ──
  const typeFrame = figma.createFrame();
  typeFrame.name = 'Typography Scale';
  typeFrame.resize(1440, 640);
  typeFrame.x = 0; typeFrame.y = swatchFrame.height + 64;
  typeFrame.fills = solidPaint('#ffffff');
  typeFrame.layoutMode = 'VERTICAL';
  typeFrame.itemSpacing = 24;
  typeFrame.paddingLeft = typeFrame.paddingRight = 48;
  typeFrame.paddingTop = typeFrame.paddingBottom = 48;
  typeFrame.primaryAxisSizingMode = 'AUTO';
  typeFrame.counterAxisSizingMode = 'FIXED';
  page.appendChild(typeFrame);

  const typeTitle = figma.createText();
  typeTitle.fontName = { family: 'Inter', style: 'Bold' };
  typeTitle.fontSize = 24;
  typeTitle.characters = 'Typography Scale — Geist Sans';
  typeTitle.fills = solidPaint('#191919');
  typeFrame.appendChild(typeTitle);

  const typeSpecimens = [
    ['Display',     36, 'Bold',      'Create Reels That Convert'],
    ['Heading / XL',24, 'SemiBold',  'Choose Your Template'],
    ['Heading / LG',20, 'SemiBold',  'Scene 1 — Hook'],
    ['Heading / MD',16, 'SemiBold',  'Generation Progress'],
    ['Body / LG',   16, 'Regular',   'Your AI-powered short-form video editor.'],
    ['Body / MD',   14, 'Regular',   'Paste your script or article here to get started.'],
    ['Body / SM',   13, 'Regular',   '0:00 – 0:05 · 2 of 4 scenes · Educational'],
    ['Caption',     12, 'Regular',   'EDUCATIONAL · DRAFT · 4 SCENES'],
  ];

  for (const [role, size, style, sample] of typeSpecimens) {
    const specimenRow = figma.createFrame();
    specimenRow.layoutMode = 'HORIZONTAL';
    specimenRow.primaryAxisAlignItems = 'CENTER';
    specimenRow.itemSpacing = 24;
    specimenRow.fills = [{ type: 'SOLID', color: { r:0,g:0,b:0}, opacity: 0 }];
    specimenRow.primaryAxisSizingMode = 'AUTO';
    specimenRow.counterAxisSizingMode = 'AUTO';

    const roleLabel = figma.createText();
    roleLabel.fontName = { family: 'Inter', style: 'Regular' };
    roleLabel.fontSize = 11;
    roleLabel.characters = role.padEnd(14, ' ') + `${size}px · ${style}`;
    roleLabel.fills = solidPaint('#a8a8a8');
    roleLabel.resize(220, roleLabel.height);
    specimenRow.appendChild(roleLabel);

    const sampleText = figma.createText();
    try {
      await figma.loadFontAsync({ family: 'Geist Sans', style });
      sampleText.fontName = { family: 'Geist Sans', style };
    } catch {
      await figma.loadFontAsync({ family: 'Inter', style });
      sampleText.fontName = { family: 'Inter', style };
    }
    sampleText.fontSize = size;
    sampleText.characters = sample;
    sampleText.fills = solidPaint('#191919');
    specimenRow.appendChild(sampleText);

    typeFrame.appendChild(specimenRow);
  }

  log('✓ Token Reference page built', 'ok');
}

// ─── Step 4: Component Frames ─────────────────────────────────────────────────

async function buildComponentsPage() {
  log('Building Components page…', 'info');
  const page = getOrCreatePage('🧩 Components');
  figma.currentPage = page;
  for (const node of page.children) node.remove();

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  let yOffset = 0;
  const COL_GAP = 48;

  async function makeSection(label) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: 'Bold' };
    t.fontSize = 18;
    t.characters = label;
    t.fills = solidPaint('#191919');
    t.x = 0; t.y = yOffset;
    page.appendChild(t);
    yOffset += 40;
  }

  async function makeLabeledFrame(name, w, h, fillHex, x) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.x = x; f.y = yOffset;
    f.fills = solidPaint(fillHex);
    f.cornerRadius = 10;
    f.strokes = solidPaint('#e5e5e5');
    f.strokeWeight = 1;
    page.appendChild(f);

    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'Regular' };
    label.fontSize = 11;
    label.characters = name;
    label.fills = solidPaint('#a8a8a8');
    label.x = x; label.y = yOffset + h + 6;
    page.appendChild(label);

    return f;
  }

  // ── Buttons ──
  await makeSection('Buttons');
  const btnVariants = [
    { name: 'Default',     bg: '#282828', text: '#f9f9f9', border: null },
    { name: 'Secondary',   bg: '#f4f4f4', text: '#282828', border: null },
    { name: 'Outline',     bg: '#ffffff', text: '#282828', border: '#e5e5e5' },
    { name: 'Ghost',       bg: '#ffffff', text: '#282828', border: null },
    { name: 'Destructive', bg: '#ef4444', text: '#ffffff', border: null },
  ];
  const btnSizes = [
    { name: 'xs', h: 28, px: 10, fs: 12 },
    { name: 'sm', h: 32, px: 12, fs: 13 },
    { name: 'md', h: 36, px: 16, fs: 14 },
    { name: 'lg', h: 44, px: 24, fs: 16 },
  ];
  let bx = 0;
  for (const v of btnVariants) {
    let by = yOffset;
    for (const s of btnSizes) {
      const btn = figma.createFrame();
      btn.name = `Button / ${v.name} / ${s.name}`;
      const textNode = figma.createText();
      await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
      textNode.fontName = { family: 'Inter', style: 'SemiBold' };
      textNode.fontSize = s.fs;
      textNode.characters = v.name;
      textNode.fills = solidPaint(v.text);
      const tw = textNode.width;
      btn.resize(tw + s.px * 2, s.h);
      btn.x = bx; btn.y = by;
      btn.cornerRadius = 10;
      btn.fills = solidPaint(v.bg);
      if (v.border) { btn.strokes = solidPaint(v.border); btn.strokeWeight = 1; }
      btn.layoutMode = 'HORIZONTAL';
      btn.primaryAxisAlignItems = 'CENTER';
      btn.counterAxisAlignItems = 'CENTER';
      btn.paddingLeft = btn.paddingRight = s.px;
      btn.primaryAxisSizingMode = 'AUTO';
      btn.counterAxisSizingMode = 'FIXED';
      page.appendChild(btn);
      btn.appendChild(textNode);
      by += s.h + 12;
    }
    bx += 140;
  }
  yOffset += (btnSizes.reduce((a, s) => a + s.h + 12, 0)) + 48;

  // ── Badges ──
  await makeSection('Badges');
  const badges = [
    { name: 'Default',   bg: '#282828', text: '#f9f9f9' },
    { name: 'Secondary', bg: '#f4f4f4', text: '#282828' },
    { name: 'Hook',      bg: '#f3e8ff', text: '#7e22ce' },
    { name: 'Context',   bg: '#dbeafe', text: '#1d4ed8' },
    { name: 'Value',     bg: '#dcfce7', text: '#15803d' },
    { name: 'CTA',       bg: '#ffedd5', text: '#c2410c' },
    { name: 'Error',     bg: '#fee2e2', text: '#dc2626' },
  ];
  let badgeX = 0;
  for (const b of badges) {
    const badge = figma.createFrame();
    badge.name = `Badge / ${b.name}`;
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.counterAxisAlignItems = 'CENTER';
    badge.paddingLeft = badge.paddingRight = 8;
    badge.paddingTop = badge.paddingBottom = 2;
    badge.cornerRadius = 6;
    badge.fills = solidPaint(b.bg);
    badge.primaryAxisSizingMode = 'AUTO';
    badge.counterAxisSizingMode = 'AUTO';
    badge.x = badgeX; badge.y = yOffset;
    const t = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
    t.fontName = { family: 'Inter', style: 'SemiBold' };
    t.fontSize = 12;
    t.characters = b.name;
    t.fills = solidPaint(b.text);
    badge.appendChild(t);
    page.appendChild(badge);
    badgeX += badge.width + 12;
  }
  yOffset += 28 + 48;

  // ── Chat Bubbles ──
  await makeSection('Chat Message Bubbles');
  // User bubble
  const userBubble = figma.createFrame();
  userBubble.name = 'Chat / User Bubble';
  userBubble.layoutMode = 'HORIZONTAL';
  userBubble.primaryAxisAlignItems = 'CENTER';
  userBubble.counterAxisAlignItems = 'CENTER';
  userBubble.paddingLeft = userBubble.paddingRight = 16;
  userBubble.paddingTop = userBubble.paddingBottom = 10;
  userBubble.cornerRadius = 18;
  userBubble.fills = solidPaint('#282828');
  userBubble.x = 0; userBubble.y = yOffset;
  userBubble.primaryAxisSizingMode = 'AUTO';
  userBubble.counterAxisSizingMode = 'AUTO';
  const userText = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  userText.fontName = { family: 'Inter', style: 'Regular' };
  userText.fontSize = 14;
  userText.characters = 'Make the hook more dramatic and punchy.';
  userText.fills = solidPaint('#f9f9f9');
  userBubble.appendChild(userText);
  page.appendChild(userBubble);

  // AI bubble
  const aiBubble = figma.createFrame();
  aiBubble.name = 'Chat / AI Bubble';
  aiBubble.layoutMode = 'HORIZONTAL';
  aiBubble.primaryAxisAlignItems = 'CENTER';
  aiBubble.counterAxisAlignItems = 'CENTER';
  aiBubble.paddingLeft = aiBubble.paddingRight = 16;
  aiBubble.paddingTop = aiBubble.paddingBottom = 10;
  aiBubble.cornerRadius = 18;
  aiBubble.fills = solidPaint('#f4f4f4');
  aiBubble.x = 0; aiBubble.y = yOffset + 60;
  aiBubble.primaryAxisSizingMode = 'AUTO';
  aiBubble.counterAxisSizingMode = 'AUTO';
  const aiText = figma.createText();
  aiText.fontName = { family: 'Inter', style: 'Regular' };
  aiText.fontSize = 14;
  aiText.characters = "I've rewritten Scene 1 to open with a bold question.";
  aiText.fills = solidPaint('#191919');
  aiBubble.appendChild(aiText);
  page.appendChild(aiBubble);

  yOffset += 140 + 48;

  // ── Template Cards ──
  await makeSection('Template Cards');
  const templates = [
    { name: '📚 Educational',   bg: '#eff6ff', border: '#bfdbfe', desc: 'Teach a concept, share knowledge',    tags: ['Tutorial','Explainer'] },
    { name: '📣 Marketing',     bg: '#fefce8', border: '#fef9c3', desc: 'Promote product or service',          tags: ['Promo','CTA'] },
    { name: '🎭 Entertainment', bg: '#fdf2f8', border: '#fbcfe8', desc: 'Entertain and grow your audience',    tags: ['Comedy','Story'] },
    { name: '📖 Storytelling',  bg: '#faf5ff', border: '#f3e8ff', desc: 'Narrative arc with emotional hook',  tags: ['Narrative','Series'] },
    { name: '🛍️ Product Demo',  bg: '#f0fdf4', border: '#bbf7d0', desc: 'Show your product in action',        tags: ['Demo','Review'] },
  ];
  let tx = 0;
  for (const tmpl of templates) {
    const card = figma.createFrame();
    card.name = `Template / ${tmpl.name}`;
    card.resize(200, 160);
    card.x = tx; card.y = yOffset;
    card.cornerRadius = 18;
    card.fills = solidPaint(tmpl.bg);
    card.strokes = solidPaint(tmpl.border);
    card.strokeWeight = 2;
    card.layoutMode = 'VERTICAL';
    card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 20;
    card.itemSpacing = 6;
    card.primaryAxisSizingMode = 'AUTO';
    card.counterAxisSizingMode = 'FIXED';
    page.appendChild(card);

    const emoji = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    emoji.fontName = { family: 'Inter', style: 'Regular' };
    emoji.fontSize = 28;
    emoji.characters = tmpl.name.split(' ')[0];
    emoji.fills = solidPaint('#191919');
    card.appendChild(emoji);

    const cTitle = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
    cTitle.fontName = { family: 'Inter', style: 'SemiBold' };
    cTitle.fontSize = 14;
    cTitle.characters = tmpl.name.slice(tmpl.name.indexOf(' ') + 1);
    cTitle.fills = solidPaint('#191919');
    card.appendChild(cTitle);

    const cDesc = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    cDesc.fontName = { family: 'Inter', style: 'Regular' };
    cDesc.fontSize = 12;
    cDesc.characters = tmpl.desc;
    cDesc.fills = solidPaint('#777777');
    cDesc.resize(160, cDesc.height);
    cDesc.textAutoResize = 'HEIGHT';
    card.appendChild(cDesc);

    tx += 212;
  }
  yOffset += 200 + 48;

  // ── Progress Bar ──
  await makeSection('Progress Bar');
  const progressValues = [0, 33, 67, 100];
  let px2 = 0;
  for (const val of progressValues) {
    const trackF = figma.createFrame();
    trackF.name = `Progress / ${val}%`;
    trackF.resize(240, 32);
    trackF.x = px2; trackF.y = yOffset;
    trackF.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    trackF.layoutMode = 'VERTICAL';
    trackF.itemSpacing = 6;
    page.appendChild(trackF);

    const track = figma.createFrame();
    track.name = 'track';
    track.resize(240, 8);
    track.cornerRadius = 9999;
    track.fills = solidPaint('#e5e5e5');
    trackF.appendChild(track);

    if (val > 0) {
      const fill2 = figma.createFrame();
      fill2.name = 'fill';
      fill2.resize(Math.round(240 * val / 100), 8);
      fill2.y = 0;
      fill2.cornerRadius = 9999;
      fill2.fills = solidPaint('#282828');
      track.appendChild(fill2);
    }

    const pLabel = figma.createText();
    pLabel.fontName = { family: 'Inter', style: 'Regular' };
    pLabel.fontSize = 12;
    pLabel.characters = `${val}%`;
    pLabel.fills = solidPaint('#777777');
    trackF.appendChild(pLabel);

    px2 += 264;
  }
  yOffset += 80 + 48;

  log('✓ Components page built', 'ok');
}

// ─── Step 5: Wizard Screens ───────────────────────────────────────────────────

async function buildWizardPages(opts) {
  log('Building Reel Wizard screens…', 'info');

  async function makeWizardStep1(pageName, W, H, isMobile) {
    const page = getOrCreatePage(pageName);
    figma.currentPage = page;
    if (page.children.length > 0) for (const n of page.children) n.remove();

    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    const screen = figma.createFrame();
    screen.name = `Wizard — Step 1 — Add Context (${W}×${H})`;
    screen.resize(W, H);
    screen.fills = solidPaint('#ffffff');
    screen.x = 0; screen.y = 0;
    page.appendChild(screen);

    // TopNav
    const nav = figma.createFrame();
    nav.name = 'TopNav';
    nav.resize(W, 56);
    nav.fills = solidPaint('#ffffff');
    nav.strokes = solidPaint('#e5e5e5');
    nav.strokeAlign = 'INSIDE';
    nav.strokeWeight = 1;
    nav.layoutMode = 'HORIZONTAL';
    nav.primaryAxisAlignItems = 'CENTER';
    nav.counterAxisAlignItems = 'CENTER';
    nav.paddingLeft = nav.paddingRight = isMobile ? 16 : 24;
    nav.primaryAxisSizingMode = 'FIXED';
    nav.counterAxisSizingMode = 'FIXED';
    screen.appendChild(nav);

    const logo = figma.createText();
    logo.fontName = { family: 'Inter', style: 'SemiBold' };
    logo.fontSize = 16;
    logo.characters = '⚡ Reel Creator';
    logo.fills = solidPaint('#191919');
    nav.appendChild(logo);

    // Body
    const body = figma.createFrame();
    body.name = 'Body';
    body.resize(W, H - 56);
    body.y = 56;
    body.fills = solidPaint('#ffffff');
    body.layoutMode = 'VERTICAL';
    body.primaryAxisAlignItems = 'CENTER';
    body.paddingLeft = body.paddingRight = isMobile ? 16 : (W - 672) / 2;
    body.paddingTop = isMobile ? 24 : 64;
    body.paddingBottom = 32;
    body.itemSpacing = isMobile ? 16 : 24;
    body.primaryAxisSizingMode = 'FIXED';
    body.counterAxisSizingMode = 'FIXED';
    screen.appendChild(body);

    // Step indicator
    const stepRow = figma.createFrame();
    stepRow.name = 'Step Indicator';
    stepRow.layoutMode = 'HORIZONTAL';
    stepRow.primaryAxisAlignItems = 'CENTER';
    stepRow.counterAxisAlignItems = 'CENTER';
    stepRow.itemSpacing = 0;
    stepRow.fills = [{ type: 'SOLID', color: { r:0,g:0,b:0 }, opacity: 0 }];
    stepRow.primaryAxisSizingMode = 'AUTO';
    stepRow.counterAxisSizingMode = 'AUTO';

    // Step 1 circle (active)
    const s1 = figma.createFrame();
    s1.resize(24, 24);
    s1.cornerRadius = 9999;
    s1.fills = solidPaint('#282828');
    s1.layoutMode = 'HORIZONTAL';
    s1.primaryAxisAlignItems = 'CENTER';
    s1.counterAxisAlignItems = 'CENTER';
    const s1t = figma.createText();
    s1t.fontName = { family: 'Inter', style: 'Bold' };
    s1t.fontSize = 11;
    s1t.characters = '1';
    s1t.fills = solidPaint('#f9f9f9');
    s1.appendChild(s1t);

    if (!isMobile) {
      const s1l = figma.createText();
      s1l.fontName = { family: 'Inter', style: 'SemiBold' };
      s1l.fontSize = 12;
      s1l.characters = ' Add Context';
      s1l.fills = solidPaint('#191919');
      stepRow.appendChild(s1);
      stepRow.appendChild(s1l);
    } else {
      stepRow.appendChild(s1);
    }

    // Connector
    const conn = figma.createLine();
    conn.resize(isMobile ? 32 : 80, 0);
    conn.strokes = solidPaint('#e5e5e5');
    conn.strokeWeight = 1;
    stepRow.appendChild(conn);

    // Step 2 circle (inactive)
    const s2 = figma.createFrame();
    s2.resize(24, 24);
    s2.cornerRadius = 9999;
    s2.fills = [{ type: 'SOLID', color: { r:1,g:1,b:1 }, opacity: 1 }];
    s2.strokes = solidPaint('#e5e5e5');
    s2.strokeWeight = 2;
    s2.layoutMode = 'HORIZONTAL';
    s2.primaryAxisAlignItems = 'CENTER';
    s2.counterAxisAlignItems = 'CENTER';
    const s2t = figma.createText();
    s2t.fontName = { family: 'Inter', style: 'Regular' };
    s2t.fontSize = 11;
    s2t.characters = '2';
    s2t.fills = solidPaint('#a8a8a8');
    s2.appendChild(s2t);
    stepRow.appendChild(s2);

    if (!isMobile) {
      const s2l = figma.createText();
      s2l.fontName = { family: 'Inter', style: 'Regular' };
      s2l.fontSize = 12;
      s2l.characters = ' Choose Template';
      s2l.fills = solidPaint('#a8a8a8');
      stepRow.appendChild(s2l);
    }
    body.appendChild(stepRow);

    // Card (desktop wraps in card; mobile is direct)
    const contentContainer = isMobile ? body : (() => {
      const c = figma.createFrame();
      c.name = 'Content Card';
      c.resize(672, 420);
      c.cornerRadius = 14;
      c.fills = solidPaint('#ffffff');
      c.strokes = solidPaint('#e5e5e5');
      c.strokeWeight = 1;
      c.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.06 }, offset: { x:0,y:1 }, radius: 4, spread: 0, visible: true, blendMode: 'NORMAL' }];
      c.layoutMode = 'VERTICAL';
      c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 32;
      c.itemSpacing = 16;
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'FIXED';
      body.appendChild(c);
      return c;
    })();

    // Heading
    const h = figma.createText();
    h.fontName = { family: 'Inter', style: 'Bold' };
    h.fontSize = isMobile ? 22 : 24;
    h.characters = 'Add Your Content';
    h.fills = solidPaint('#191919');
    contentContainer.appendChild(h);

    const sub = figma.createText();
    sub.fontName = { family: 'Inter', style: 'Regular' };
    sub.fontSize = 14;
    sub.characters = 'Paste your script, notes, or article — the AI builds your reel from this.';
    sub.fills = solidPaint('#777777');
    sub.resize(isMobile ? W - 32 : 608, sub.height);
    sub.textAutoResize = 'HEIGHT';
    contentContainer.appendChild(sub);

    // Tabs
    const tabs = figma.createFrame();
    tabs.name = 'Tabs';
    tabs.layoutMode = 'HORIZONTAL';
    tabs.itemSpacing = 4;
    tabs.paddingLeft = tabs.paddingRight = tabs.paddingTop = tabs.paddingBottom = 4;
    tabs.cornerRadius = 10;
    tabs.fills = solidPaint('#f4f4f4');
    tabs.primaryAxisSizingMode = 'AUTO';
    tabs.counterAxisSizingMode = 'AUTO';

    for (const [tabLabel, active] of [['Text', true], ['PDF', false]]) {
      const tab = figma.createFrame();
      tab.name = `Tab / ${tabLabel}`;
      tab.layoutMode = 'HORIZONTAL';
      tab.primaryAxisAlignItems = 'CENTER';
      tab.counterAxisAlignItems = 'CENTER';
      tab.paddingLeft = tab.paddingRight = 16;
      tab.paddingTop = tab.paddingBottom = 6;
      tab.cornerRadius = 8;
      tab.fills = active ? solidPaint('#ffffff') : [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
      if (active) {
        tab.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.06 }, offset: { x:0,y:1 }, radius: 3, spread: 0, visible: true, blendMode: 'NORMAL' }];
      }
      tab.primaryAxisSizingMode = 'AUTO';
      tab.counterAxisSizingMode = 'AUTO';
      const tt = figma.createText();
      tt.fontName = { family: 'Inter', style: active ? 'SemiBold' : 'Regular' };
      tt.fontSize = 14;
      tt.characters = tabLabel;
      tt.fills = solidPaint(active ? '#191919' : '#777777');
      tab.appendChild(tt);
      tabs.appendChild(tab);
    }
    contentContainer.appendChild(tabs);

    // Textarea
    const textarea = figma.createFrame();
    textarea.name = 'Textarea';
    textarea.resize(isMobile ? W - 32 : 608, isMobile ? 140 : 120);
    textarea.cornerRadius = 8;
    textarea.fills = solidPaint('#ffffff');
    textarea.strokes = solidPaint('#e5e5e5');
    textarea.strokeWeight = 1;
    textarea.paddingLeft = textarea.paddingRight = textarea.paddingTop = textarea.paddingBottom = 12;
    const placeholder = figma.createText();
    placeholder.fontName = { family: 'Inter', style: 'Regular' };
    placeholder.fontSize = 14;
    placeholder.characters = 'Paste your content here…';
    placeholder.fills = solidPaint('#a8a8a8');
    textarea.appendChild(placeholder);
    contentContainer.appendChild(textarea);

    // Counter
    const counter = figma.createText();
    counter.fontName = { family: 'Inter', style: 'Regular' };
    counter.fontSize = 12;
    counter.characters = '0 / 2000 characters';
    counter.fills = solidPaint('#a8a8a8');
    counter.textAlignHorizontal = 'RIGHT';
    counter.resize(isMobile ? W - 32 : 608, counter.height);
    contentContainer.appendChild(counter);

    // CTA Button
    const ctaBtn = figma.createFrame();
    ctaBtn.name = 'Button / Continue';
    ctaBtn.layoutMode = 'HORIZONTAL';
    ctaBtn.primaryAxisAlignItems = 'CENTER';
    ctaBtn.counterAxisAlignItems = 'CENTER';
    ctaBtn.primaryAxisSizingMode = isMobile ? 'FIXED' : 'AUTO';
    ctaBtn.counterAxisSizingMode = 'AUTO';
    if (isMobile) ctaBtn.resize(W - 32, 44);
    ctaBtn.paddingLeft = ctaBtn.paddingRight = 24;
    ctaBtn.paddingTop = ctaBtn.paddingBottom = isMobile ? 0 : 10;
    ctaBtn.cornerRadius = 10;
    ctaBtn.fills = solidPaint('#282828');
    ctaBtn.itemSpacing = 8;
    const ctaText = figma.createText();
    ctaText.fontName = { family: 'Inter', style: 'SemiBold' };
    ctaText.fontSize = isMobile ? 15 : 14;
    ctaText.characters = 'Continue →';
    ctaText.fills = solidPaint('#f9f9f9');
    ctaBtn.appendChild(ctaText);
    contentContainer.appendChild(ctaBtn);

    if (!isMobile) {
      ctaBtn.primaryAxisAlignItems = 'MAX';
    }
  }

  if (opts.wizard) {
    await makeWizardStep1('📱 Reel Wizard — Mobile', 375, 812, true);
    progress(55, 'Building wizard desktop…');
    await makeWizardStep1('💻 Reel Wizard — Desktop', 1440, 900, false);
  }

  log('✓ Wizard screens built', 'ok');
}

// ─── Step 6: Editor Screens ───────────────────────────────────────────────────

async function buildEditorPage(opts) {
  log('Building Reel Editor screens…', 'info');

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // ── Desktop Editor ──
  if (opts.editor) {
    const dPage = getOrCreatePage('🎬 Reel Editor — Desktop');
    figma.currentPage = dPage;
    for (const n of dPage.children) n.remove();

    const W = 1440, H = 900;
    const screen = figma.createFrame();
    screen.name = 'Editor — Idle (1440×900)';
    screen.resize(W, H);
    screen.fills = solidPaint('#ffffff');
    screen.x = 0; screen.y = 0;
    dPage.appendChild(screen);

    // TopNav
    const nav = figma.createFrame();
    nav.name = 'TopNav';
    nav.resize(W, 56);
    nav.y = 0;
    nav.fills = solidPaint('#ffffff');
    nav.strokes = solidPaint('#e5e5e5');
    nav.strokeAlign = 'INSIDE';
    nav.strokeWeight = 1;
    nav.layoutMode = 'HORIZONTAL';
    nav.primaryAxisAlignItems = 'CENTER';
    nav.counterAxisAlignItems = 'CENTER';
    nav.paddingLeft = nav.paddingRight = 24;
    nav.itemSpacing = 12;
    nav.primaryAxisSizingMode = 'FIXED';
    nav.counterAxisSizingMode = 'FIXED';
    screen.appendChild(nav);

    // Back btn
    const backBtn = figma.createFrame();
    backBtn.name = 'Back Button';
    backBtn.resize(36, 36);
    backBtn.cornerRadius = 8;
    backBtn.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    backBtn.layoutMode = 'HORIZONTAL';
    backBtn.primaryAxisAlignItems = 'CENTER';
    backBtn.counterAxisAlignItems = 'CENTER';
    const backArrow = figma.createText();
    backArrow.fontName = { family: 'Inter', style: 'Regular' };
    backArrow.fontSize = 16;
    backArrow.characters = '←';
    backArrow.fills = solidPaint('#282828');
    backBtn.appendChild(backArrow);
    nav.appendChild(backBtn);

    const reelTitle = figma.createText();
    reelTitle.fontName = { family: 'Inter', style: 'SemiBold' };
    reelTitle.fontSize = 18;
    reelTitle.characters = 'My First Reel';
    reelTitle.fills = solidPaint('#191919');
    nav.appendChild(reelTitle);

    const badge = figma.createFrame();
    badge.name = 'Badge / Educational';
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.paddingLeft = badge.paddingRight = 8;
    badge.paddingTop = badge.paddingBottom = 2;
    badge.cornerRadius = 6;
    badge.fills = solidPaint('#f4f4f4');
    badge.primaryAxisSizingMode = 'AUTO';
    badge.counterAxisSizingMode = 'AUTO';
    const badgeT = figma.createText();
    badgeT.fontName = { family: 'Inter', style: 'Regular' };
    badgeT.fontSize = 12;
    badgeT.characters = 'Educational';
    badgeT.fills = solidPaint('#555555');
    badge.appendChild(badgeT);
    nav.appendChild(badge);

    // Spacer
    const spacer = figma.createFrame();
    spacer.name = 'spacer';
    spacer.resize(1, 1);
    spacer.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    spacer.layoutGrow = 1;
    nav.appendChild(spacer);

    // Generate button
    const genBtn = figma.createFrame();
    genBtn.name = 'Button / Generate';
    genBtn.layoutMode = 'HORIZONTAL';
    genBtn.primaryAxisAlignItems = 'CENTER';
    genBtn.counterAxisAlignItems = 'CENTER';
    genBtn.paddingLeft = genBtn.paddingRight = 14;
    genBtn.paddingTop = genBtn.paddingBottom = 7;
    genBtn.cornerRadius = 8;
    genBtn.fills = solidPaint('#282828');
    genBtn.itemSpacing = 6;
    genBtn.primaryAxisSizingMode = 'AUTO';
    genBtn.counterAxisSizingMode = 'AUTO';
    const genIcon = figma.createText();
    genIcon.fontName = { family: 'Inter', style: 'Regular' };
    genIcon.fontSize = 13;
    genIcon.characters = '✦';
    genIcon.fills = solidPaint('#f9f9f9');
    genBtn.appendChild(genIcon);
    const genText = figma.createText();
    genText.fontName = { family: 'Inter', style: 'SemiBold' };
    genText.fontSize = 13;
    genText.characters = 'Generate';
    genText.fills = solidPaint('#f9f9f9');
    genBtn.appendChild(genText);
    nav.appendChild(genBtn);

    // Export button
    const expBtn = figma.createFrame();
    expBtn.name = 'Button / Export';
    expBtn.layoutMode = 'HORIZONTAL';
    expBtn.primaryAxisAlignItems = 'CENTER';
    expBtn.counterAxisAlignItems = 'CENTER';
    expBtn.paddingLeft = expBtn.paddingRight = 14;
    expBtn.paddingTop = expBtn.paddingBottom = 6;
    expBtn.cornerRadius = 8;
    expBtn.fills = solidPaint('#ffffff');
    expBtn.strokes = solidPaint('#e5e5e5');
    expBtn.strokeWeight = 1;
    expBtn.primaryAxisSizingMode = 'AUTO';
    expBtn.counterAxisSizingMode = 'AUTO';
    const expText = figma.createText();
    expText.fontName = { family: 'Inter', style: 'SemiBold' };
    expText.fontSize = 13;
    expText.characters = '↓ Export';
    expText.fills = solidPaint('#282828');
    expBtn.appendChild(expText);
    nav.appendChild(expBtn);

    // Main area
    const mainArea = figma.createFrame();
    mainArea.name = 'Main Area';
    mainArea.resize(W, H - 56);
    mainArea.y = 56;
    mainArea.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    mainArea.layoutMode = 'HORIZONTAL';
    mainArea.primaryAxisSizingMode = 'FIXED';
    mainArea.counterAxisSizingMode = 'FIXED';
    screen.appendChild(mainArea);

    // Scene list
    const sceneList = figma.createFrame();
    sceneList.name = 'Scene List Panel';
    sceneList.resize(288, H - 56);
    sceneList.fills = solidPaint('#ffffff');
    sceneList.strokes = solidPaint('#e5e5e5');
    sceneList.strokeAlign = 'INSIDE';
    sceneList.strokeWeight = 1;
    sceneList.layoutMode = 'VERTICAL';
    sceneList.primaryAxisSizingMode = 'FIXED';
    sceneList.counterAxisSizingMode = 'FIXED';
    mainArea.appendChild(sceneList);

    // List header
    const listHeader = figma.createFrame();
    listHeader.name = 'List Header';
    listHeader.resize(288, 48);
    listHeader.fills = solidPaint('#ffffff');
    listHeader.strokes = solidPaint('#e5e5e5');
    listHeader.strokeAlign = 'INSIDE';
    listHeader.strokeWeight = 1;
    listHeader.layoutMode = 'HORIZONTAL';
    listHeader.primaryAxisAlignItems = 'CENTER';
    listHeader.paddingLeft = listHeader.paddingRight = 16;
    listHeader.itemSpacing = 8;
    listHeader.primaryAxisSizingMode = 'FIXED';
    listHeader.counterAxisSizingMode = 'FIXED';
    sceneList.appendChild(listHeader);

    const listTitle = figma.createText();
    listTitle.fontName = { family: 'Inter', style: 'SemiBold' };
    listTitle.fontSize = 14;
    listTitle.characters = 'Scenes';
    listTitle.fills = solidPaint('#191919');
    listHeader.appendChild(listTitle);

    const sceneCount = figma.createText();
    sceneCount.fontName = { family: 'Inter', style: 'Regular' };
    sceneCount.fontSize = 12;
    sceneCount.characters = '4 scenes';
    sceneCount.fills = solidPaint('#a8a8a8');
    listHeader.appendChild(sceneCount);

    // Scene cards
    const sceneItems = [
      { n: 1, type: 'hook',    time: '0:00–0:05', selected: true,  audio: 'generated', text: 'What if one video could 10× your reach?' },
      { n: 2, type: 'context', time: '0:05–0:20', selected: false, audio: 'generated', text: 'Most creators post daily but get zero traction…' },
      { n: 3, type: 'value',   time: '0:20–0:45', selected: false, audio: 'pending',   text: 'The secret is structure. Hook → Context → Value.' },
      { n: 4, type: 'cta',     time: '0:45–0:55', selected: false, audio: 'pending',   text: 'Follow for daily creator tips. Link in bio.' },
    ];
    const typeBadgeColors = {
      hook:    { bg: '#f3e8ff', text: '#7e22ce' },
      context: { bg: '#dbeafe', text: '#1d4ed8' },
      value:   { bg: '#dcfce7', text: '#15803d' },
      cta:     { bg: '#ffedd5', text: '#c2410c' },
    };

    const listBody = figma.createFrame();
    listBody.name = 'Scene List';
    listBody.resize(288, H - 56 - 48);
    listBody.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    listBody.layoutMode = 'VERTICAL';
    listBody.paddingLeft = listBody.paddingRight = listBody.paddingTop = listBody.paddingBottom = 8;
    listBody.itemSpacing = 4;
    listBody.primaryAxisSizingMode = 'AUTO';
    listBody.counterAxisSizingMode = 'FIXED';
    sceneList.appendChild(listBody);

    for (const sc of sceneItems) {
      const card = figma.createFrame();
      card.name = `Scene ${sc.n} / ${sc.type}`;
      card.resize(272, 80);
      card.cornerRadius = 10;
      card.fills = sc.selected ? solidPaint('#f4f4f4') : [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
      if (sc.selected) {
        card.strokes = solidPaint('#a8a8a8');
        card.strokeWeight = 1.5;
      }
      card.layoutMode = 'HORIZONTAL';
      card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 10;
      card.itemSpacing = 10;
      card.primaryAxisSizingMode = 'FIXED';
      card.counterAxisSizingMode = 'AUTO';
      listBody.appendChild(card);

      // Thumbnail
      const thumb = figma.createFrame();
      thumb.resize(56, 56);
      thumb.cornerRadius = 8;
      thumb.fills = solidPaint('#e5e5e5');
      card.appendChild(thumb);

      // Content
      const content = figma.createFrame();
      content.name = 'content';
      content.layoutMode = 'VERTICAL';
      content.itemSpacing = 3;
      content.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
      content.layoutGrow = 1;
      content.primaryAxisSizingMode = 'AUTO';
      content.counterAxisSizingMode = 'AUTO';
      card.appendChild(content);

      // Type badge
      const typeBadge = figma.createFrame();
      typeBadge.name = `Badge / ${sc.type}`;
      typeBadge.layoutMode = 'HORIZONTAL';
      typeBadge.primaryAxisAlignItems = 'CENTER';
      typeBadge.paddingLeft = typeBadge.paddingRight = 6;
      typeBadge.paddingTop = typeBadge.paddingBottom = 1;
      typeBadge.cornerRadius = 4;
      typeBadge.fills = solidPaint(typeBadgeColors[sc.type].bg);
      typeBadge.primaryAxisSizingMode = 'AUTO';
      typeBadge.counterAxisSizingMode = 'AUTO';
      const typeText = figma.createText();
      typeText.fontName = { family: 'Inter', style: 'SemiBold' };
      typeText.fontSize = 10;
      typeText.characters = sc.type.toUpperCase();
      typeText.fills = solidPaint(typeBadgeColors[sc.type].text);
      typeBadge.appendChild(typeText);
      content.appendChild(typeBadge);

      // Time
      const time = figma.createText();
      time.fontName = { family: 'Inter', style: 'Regular' };
      time.fontSize = 11;
      time.characters = sc.time;
      time.fills = solidPaint('#a8a8a8');
      content.appendChild(time);

      // Script preview
      const preview = figma.createText();
      preview.fontName = { family: 'Inter', style: 'Regular' };
      preview.fontSize = 11;
      preview.characters = sc.text;
      preview.fills = solidPaint('#777777');
      preview.resize(150, preview.height);
      preview.textAutoResize = 'HEIGHT';
      content.appendChild(preview);
    }

    // Preview center
    const previewCenter = figma.createFrame();
    previewCenter.name = 'Preview Center';
    previewCenter.resize(W - 288, H - 56);
    previewCenter.fills = solidPaint('#f4f4f4');
    previewCenter.layoutMode = 'VERTICAL';
    previewCenter.primaryAxisAlignItems = 'CENTER';
    previewCenter.counterAxisAlignItems = 'CENTER';
    previewCenter.primaryAxisSizingMode = 'FIXED';
    previewCenter.counterAxisSizingMode = 'FIXED';
    mainArea.appendChild(previewCenter);

    // Player container — 9:16
    const playerH = Math.min(H - 56 - 80, 720);
    const playerW = Math.round(playerH * 9 / 16);
    const playerContainer = figma.createFrame();
    playerContainer.name = 'Video Player (9:16)';
    playerContainer.resize(playerW, playerH);
    playerContainer.cornerRadius = 14;
    playerContainer.fills = solidPaint('#191919');
    playerContainer.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.25 }, offset: { x:0,y:8 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
    playerContainer.layoutMode = 'VERTICAL';
    playerContainer.primaryAxisAlignItems = 'CENTER';
    playerContainer.counterAxisAlignItems = 'CENTER';
    previewCenter.appendChild(playerContainer);

    const playerLabel = figma.createText();
    playerLabel.fontName = { family: 'Inter', style: 'Regular' };
    playerLabel.fontSize = 13;
    playerLabel.characters = '▶  Preview';
    playerLabel.fills = solidPaint('#555555');
    playerContainer.appendChild(playerLabel);

    // Floating chat widget
    const chatWidget = figma.createFrame();
    chatWidget.name = 'Chat Widget (Collapsed)';
    chatWidget.layoutMode = 'HORIZONTAL';
    chatWidget.primaryAxisAlignItems = 'CENTER';
    chatWidget.counterAxisAlignItems = 'CENTER';
    chatWidget.paddingLeft = chatWidget.paddingRight = 16;
    chatWidget.paddingTop = chatWidget.paddingBottom = 10;
    chatWidget.cornerRadius = 9999;
    chatWidget.fills = solidPaint('#282828');
    chatWidget.itemSpacing = 8;
    chatWidget.primaryAxisSizingMode = 'AUTO';
    chatWidget.counterAxisSizingMode = 'AUTO';
    chatWidget.x = W - 160;
    chatWidget.y = H - 80;
    const chatIcon = figma.createText();
    chatIcon.fontName = { family: 'Inter', style: 'Regular' };
    chatIcon.fontSize = 14;
    chatIcon.characters = '💬';
    chatWidget.appendChild(chatIcon);
    const chatLabel = figma.createText();
    chatLabel.fontName = { family: 'Inter', style: 'SemiBold' };
    chatLabel.fontSize = 13;
    chatLabel.characters = 'Edit Reel';
    chatLabel.fills = solidPaint('#f9f9f9');
    chatWidget.appendChild(chatLabel);
    screen.appendChild(chatWidget);

    // ── Variant: Editor with Chat Open ──
    const screenChat = screen.clone();
    screenChat.name = 'Editor — Chat Open (1440×900)';
    screenChat.x = W + 64;
    dPage.appendChild(screenChat);

    // Remove old chat widget and add expanded panel
    const oldWidget = screenChat.findChild(n => n.name === 'Chat Widget (Collapsed)');
    if (oldWidget) oldWidget.remove();

    const chatPanel = figma.createFrame();
    chatPanel.name = 'Chat Widget (Expanded)';
    chatPanel.resize(360, 480);
    chatPanel.x = W - 384; chatPanel.y = H - 560;
    chatPanel.cornerRadius = 14;
    chatPanel.fills = solidPaint('#ffffff');
    chatPanel.strokes = solidPaint('#e5e5e5');
    chatPanel.strokeWeight = 1;
    chatPanel.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.16 }, offset: { x:0,y:8 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
    chatPanel.layoutMode = 'VERTICAL';
    chatPanel.primaryAxisSizingMode = 'FIXED';
    chatPanel.counterAxisSizingMode = 'FIXED';

    // Chat panel header
    const chatHeader = figma.createFrame();
    chatHeader.name = 'Chat Header';
    chatHeader.resize(360, 48);
    chatHeader.fills = solidPaint('#ffffff');
    chatHeader.strokes = solidPaint('#e5e5e5');
    chatHeader.strokeAlign = 'INSIDE';
    chatHeader.strokeWeight = 1;
    chatHeader.layoutMode = 'HORIZONTAL';
    chatHeader.primaryAxisAlignItems = 'CENTER';
    chatHeader.paddingLeft = chatHeader.paddingRight = 16;
    chatHeader.itemSpacing = 8;
    chatHeader.primaryAxisSizingMode = 'FIXED';
    chatHeader.counterAxisSizingMode = 'FIXED';

    const chatTitle2 = figma.createText();
    chatTitle2.fontName = { family: 'Inter', style: 'SemiBold' };
    chatTitle2.fontSize = 14;
    chatTitle2.characters = 'Edit your reel';
    chatTitle2.fills = solidPaint('#191919');
    chatHeader.appendChild(chatTitle2);

    const chatSpacer = figma.createFrame();
    chatSpacer.resize(1, 1);
    chatSpacer.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    chatSpacer.layoutGrow = 1;
    chatHeader.appendChild(chatSpacer);

    const closeBtn = figma.createText();
    closeBtn.fontName = { family: 'Inter', style: 'Regular' };
    closeBtn.fontSize = 16;
    closeBtn.characters = '×';
    closeBtn.fills = solidPaint('#a8a8a8');
    chatHeader.appendChild(closeBtn);
    chatPanel.appendChild(chatHeader);

    // Messages area
    const msgsArea = figma.createFrame();
    msgsArea.name = 'Messages';
    msgsArea.resize(360, 320);
    msgsArea.fills = solidPaint('#ffffff');
    msgsArea.layoutMode = 'VERTICAL';
    msgsArea.paddingLeft = msgsArea.paddingRight = msgsArea.paddingTop = msgsArea.paddingBottom = 12;
    msgsArea.itemSpacing = 10;
    msgsArea.primaryAxisSizingMode = 'FIXED';
    msgsArea.counterAxisSizingMode = 'FIXED';

    const chatMessages = [
      { role: 'ai',   text: "I'm your reel editor. What would you like to change?" },
      { role: 'user', text: 'Make the hook more dramatic and punchy.' },
      { role: 'ai',   text: "Updated Scene 1 to open with: \"What if one video could 10× your reach?\"" },
    ];
    for (const msg of chatMessages) {
      const bubble = figma.createFrame();
      bubble.layoutMode = 'HORIZONTAL';
      bubble.primaryAxisAlignItems = 'CENTER';
      bubble.paddingLeft = bubble.paddingRight = 12;
      bubble.paddingTop = bubble.paddingBottom = 8;
      bubble.cornerRadius = 14;
      bubble.fills = solidPaint(msg.role === 'user' ? '#282828' : '#f4f4f4');
      bubble.primaryAxisSizingMode = 'AUTO';
      bubble.counterAxisSizingMode = 'AUTO';
      const bt = figma.createText();
      bt.fontName = { family: 'Inter', style: 'Regular' };
      bt.fontSize = 13;
      bt.characters = msg.text;
      bt.fills = solidPaint(msg.role === 'user' ? '#f9f9f9' : '#191919');
      bt.resize(280, bt.height);
      bt.textAutoResize = 'HEIGHT';
      bubble.appendChild(bt);
      bubble.layoutAlign = msg.role === 'user' ? 'MAX' : 'MIN';
      msgsArea.appendChild(bubble);
    }
    chatPanel.appendChild(msgsArea);

    // Input row
    const inputRow = figma.createFrame();
    inputRow.name = 'Input Row';
    inputRow.resize(360, 56);
    inputRow.fills = solidPaint('#ffffff');
    inputRow.strokes = solidPaint('#e5e5e5');
    inputRow.strokeAlign = 'INSIDE';
    inputRow.strokeWeight = 1;
    inputRow.layoutMode = 'HORIZONTAL';
    inputRow.primaryAxisAlignItems = 'CENTER';
    inputRow.counterAxisAlignItems = 'CENTER';
    inputRow.paddingLeft = inputRow.paddingRight = inputRow.paddingTop = inputRow.paddingBottom = 10;
    inputRow.itemSpacing = 8;
    inputRow.primaryAxisSizingMode = 'FIXED';
    inputRow.counterAxisSizingMode = 'FIXED';

    const chatInput = figma.createFrame();
    chatInput.name = 'Chat Input';
    chatInput.resize(280, 36);
    chatInput.cornerRadius = 8;
    chatInput.fills = solidPaint('#f4f4f4');
    chatInput.paddingLeft = chatInput.paddingRight = 12;
    chatInput.paddingTop = chatInput.paddingBottom = 0;
    chatInput.layoutMode = 'HORIZONTAL';
    chatInput.primaryAxisAlignItems = 'CENTER';
    chatInput.primaryAxisSizingMode = 'FIXED';
    chatInput.counterAxisSizingMode = 'FIXED';
    chatInput.layoutGrow = 1;
    const chatPlaceholder = figma.createText();
    chatPlaceholder.fontName = { family: 'Inter', style: 'Regular' };
    chatPlaceholder.fontSize = 13;
    chatPlaceholder.characters = 'Type your changes…';
    chatPlaceholder.fills = solidPaint('#a8a8a8');
    chatInput.appendChild(chatPlaceholder);
    inputRow.appendChild(chatInput);

    const sendBtn = figma.createFrame();
    sendBtn.resize(36, 36);
    sendBtn.cornerRadius = 8;
    sendBtn.fills = solidPaint('#282828');
    sendBtn.layoutMode = 'HORIZONTAL';
    sendBtn.primaryAxisAlignItems = 'CENTER';
    sendBtn.counterAxisAlignItems = 'CENTER';
    const sendArrow = figma.createText();
    sendArrow.fontName = { family: 'Inter', style: 'Regular' };
    sendArrow.fontSize = 14;
    sendArrow.characters = '→';
    sendArrow.fills = solidPaint('#f9f9f9');
    sendBtn.appendChild(sendArrow);
    inputRow.appendChild(sendBtn);
    chatPanel.appendChild(inputRow);
    screenChat.appendChild(chatPanel);
  }

  // ── Mobile Editor ──
  if (opts.editor) {
    const mPage = getOrCreatePage('📱 Reel Editor — Mobile');
    figma.currentPage = mPage;
    for (const n of mPage.children) n.remove();

    const MW = 375, MH = 812;
    const mScreen = figma.createFrame();
    mScreen.name = 'Editor — Default (375×812)';
    mScreen.resize(MW, MH);
    mScreen.fills = solidPaint('#ffffff');
    mScreen.x = 0; mScreen.y = 0;
    mPage.appendChild(mScreen);

    // Mobile TopNav
    const mNav = figma.createFrame();
    mNav.name = 'TopNav';
    mNav.resize(MW, 56);
    mNav.fills = solidPaint('#ffffff');
    mNav.strokes = solidPaint('#e5e5e5');
    mNav.strokeAlign = 'INSIDE';
    mNav.strokeWeight = 1;
    mNav.layoutMode = 'HORIZONTAL';
    mNav.primaryAxisAlignItems = 'CENTER';
    mNav.counterAxisAlignItems = 'CENTER';
    mNav.paddingLeft = mNav.paddingRight = 16;
    mNav.itemSpacing = 10;
    mNav.primaryAxisSizingMode = 'FIXED';
    mNav.counterAxisSizingMode = 'FIXED';
    mScreen.appendChild(mNav);

    const mBack = figma.createText();
    mBack.fontName = { family: 'Inter', style: 'Regular' };
    mBack.fontSize = 18;
    mBack.characters = '←';
    mBack.fills = solidPaint('#282828');
    mNav.appendChild(mBack);

    const mTitle = figma.createText();
    mTitle.fontName = { family: 'Inter', style: 'SemiBold' };
    mTitle.fontSize = 15;
    mTitle.characters = 'My First Reel';
    mTitle.fills = solidPaint('#191919');
    mNav.appendChild(mTitle);

    const mSpacer = figma.createFrame();
    mSpacer.resize(1, 1);
    mSpacer.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    mSpacer.layoutGrow = 1;
    mNav.appendChild(mSpacer);

    const mMenuBtn = figma.createText();
    mMenuBtn.fontName = { family: 'Inter', style: 'Regular' };
    mMenuBtn.fontSize = 18;
    mMenuBtn.characters = '☰';
    mMenuBtn.fills = solidPaint('#282828');
    mNav.appendChild(mMenuBtn);

    // Preview area
    const mPreview = figma.createFrame();
    mPreview.name = 'Preview Area';
    mPreview.resize(MW, MH - 56 - 64);
    mPreview.y = 56;
    mPreview.fills = solidPaint('#f4f4f4');
    mPreview.layoutMode = 'VERTICAL';
    mPreview.primaryAxisAlignItems = 'CENTER';
    mPreview.counterAxisAlignItems = 'CENTER';
    mPreview.primaryAxisSizingMode = 'FIXED';
    mPreview.counterAxisSizingMode = 'FIXED';
    mScreen.appendChild(mPreview);

    const mPlayerH = MH - 56 - 64 - 24;
    const mPlayerW = Math.round(mPlayerH * 9 / 16);
    const mPlayer = figma.createFrame();
    mPlayer.name = 'Video Player (9:16)';
    mPlayer.resize(mPlayerW, mPlayerH);
    mPlayer.cornerRadius = 14;
    mPlayer.fills = solidPaint('#191919');
    mPlayer.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.2 }, offset: { x:0,y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];
    mPreview.appendChild(mPlayer);

    // Mobile bottom action bar
    const mActionBar = figma.createFrame();
    mActionBar.name = 'Bottom Action Bar';
    mActionBar.resize(MW, 64);
    mActionBar.y = MH - 64;
    mActionBar.fills = solidPaint('#ffffff');
    mActionBar.strokes = solidPaint('#e5e5e5');
    mActionBar.strokeAlign = 'INSIDE';
    mActionBar.strokeWeight = 1;
    mActionBar.layoutMode = 'HORIZONTAL';
    mActionBar.primaryAxisAlignItems = 'CENTER';
    mActionBar.counterAxisAlignItems = 'CENTER';
    mActionBar.paddingLeft = mActionBar.paddingRight = 16;
    mActionBar.itemSpacing = 8;
    mActionBar.primaryAxisSizingMode = 'FIXED';
    mActionBar.counterAxisSizingMode = 'FIXED';
    mScreen.appendChild(mActionBar);

    const mScenesBtn = figma.createFrame();
    mScenesBtn.name = 'Scenes Button';
    mScenesBtn.layoutMode = 'VERTICAL';
    mScenesBtn.primaryAxisAlignItems = 'CENTER';
    mScenesBtn.counterAxisAlignItems = 'CENTER';
    mScenesBtn.paddingLeft = mScenesBtn.paddingRight = 12;
    mScenesBtn.itemSpacing = 2;
    mScenesBtn.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    mScenesBtn.primaryAxisSizingMode = 'AUTO';
    mScenesBtn.counterAxisSizingMode = 'AUTO';
    const mScenesIcon = figma.createText();
    mScenesIcon.fontName = { family: 'Inter', style: 'Regular' };
    mScenesIcon.fontSize = 18;
    mScenesIcon.characters = '⊞';
    mScenesIcon.fills = solidPaint('#777777');
    const mScenesLabel = figma.createText();
    mScenesLabel.fontName = { family: 'Inter', style: 'Regular' };
    mScenesLabel.fontSize = 10;
    mScenesLabel.characters = 'Scenes';
    mScenesLabel.fills = solidPaint('#777777');
    mScenesBtn.appendChild(mScenesIcon);
    mScenesBtn.appendChild(mScenesLabel);
    mActionBar.appendChild(mScenesBtn);

    const mGenBtn = figma.createFrame();
    mGenBtn.name = 'Generate Button';
    mGenBtn.layoutMode = 'HORIZONTAL';
    mGenBtn.primaryAxisAlignItems = 'CENTER';
    mGenBtn.counterAxisAlignItems = 'CENTER';
    mGenBtn.paddingLeft = mGenBtn.paddingRight = 20;
    mGenBtn.paddingTop = mGenBtn.paddingBottom = 10;
    mGenBtn.cornerRadius = 10;
    mGenBtn.fills = solidPaint('#282828');
    mGenBtn.itemSpacing = 6;
    mGenBtn.layoutGrow = 1;
    mGenBtn.primaryAxisSizingMode = 'FIXED';
    mGenBtn.counterAxisSizingMode = 'AUTO';
    const mGenIcon2 = figma.createText();
    mGenIcon2.fontName = { family: 'Inter', style: 'Regular' };
    mGenIcon2.fontSize = 14;
    mGenIcon2.characters = '✦';
    mGenIcon2.fills = solidPaint('#f9f9f9');
    const mGenText2 = figma.createText();
    mGenText2.fontName = { family: 'Inter', style: 'SemiBold' };
    mGenText2.fontSize = 14;
    mGenText2.characters = 'Generate';
    mGenText2.fills = solidPaint('#f9f9f9');
    mGenBtn.appendChild(mGenIcon2);
    mGenBtn.appendChild(mGenText2);
    mActionBar.appendChild(mGenBtn);

    const mExpBtn = figma.createFrame();
    mExpBtn.name = 'Export Button';
    mExpBtn.layoutMode = 'VERTICAL';
    mExpBtn.primaryAxisAlignItems = 'CENTER';
    mExpBtn.counterAxisAlignItems = 'CENTER';
    mExpBtn.paddingLeft = mExpBtn.paddingRight = 12;
    mExpBtn.itemSpacing = 2;
    mExpBtn.fills = [{ type: 'SOLID', color:{r:0,g:0,b:0}, opacity:0 }];
    mExpBtn.primaryAxisSizingMode = 'AUTO';
    mExpBtn.counterAxisSizingMode = 'AUTO';
    const mExpIcon = figma.createText();
    mExpIcon.fontName = { family: 'Inter', style: 'Regular' };
    mExpIcon.fontSize = 18;
    mExpIcon.characters = '↓';
    mExpIcon.fills = solidPaint('#777777');
    const mExpLabel = figma.createText();
    mExpLabel.fontName = { family: 'Inter', style: 'Regular' };
    mExpLabel.fontSize = 10;
    mExpLabel.characters = 'Export';
    mExpLabel.fills = solidPaint('#777777');
    mExpBtn.appendChild(mExpIcon);
    mExpBtn.appendChild(mExpLabel);
    mActionBar.appendChild(mExpBtn);
  }

  log('✓ Editor screens built', 'ok');
}

// ─── Step 7: Dark Mode Variants ───────────────────────────────────────────────

async function buildDarkPage(opts) {
  if (!opts.dark) return;
  log('Building Dark Mode variants…', 'info');

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const page = getOrCreatePage('🌙 Dark Mode Variants');
  figma.currentPage = page;
  for (const n of page.children) n.remove();

  // Dark wizard screen
  const dWizard = figma.createFrame();
  dWizard.name = 'Wizard Step 1 — Dark (1440×900)';
  dWizard.resize(1440, 900);
  dWizard.fills = solidPaint('#191919');
  dWizard.x = 0; dWizard.y = 0;
  page.appendChild(dWizard);

  const dNav = figma.createFrame();
  dNav.name = 'TopNav';
  dNav.resize(1440, 56);
  dNav.fills = solidPaint('#191919');
  dNav.strokes = solidPaint('#2a2a2a');
  dNav.strokeAlign = 'INSIDE';
  dNav.strokeWeight = 1;
  dNav.layoutMode = 'HORIZONTAL';
  dNav.primaryAxisAlignItems = 'CENTER';
  dNav.counterAxisAlignItems = 'CENTER';
  dNav.paddingLeft = dNav.paddingRight = 24;
  dNav.primaryAxisSizingMode = 'FIXED';
  dNav.counterAxisSizingMode = 'FIXED';
  dWizard.appendChild(dNav);

  const dLogo = figma.createText();
  dLogo.fontName = { family: 'Inter', style: 'SemiBold' };
  dLogo.fontSize = 16;
  dLogo.characters = '⚡ Reel Creator';
  dLogo.fills = solidPaint('#f9f9f9');
  dNav.appendChild(dLogo);

  // Dark card
  const dBody = figma.createFrame();
  dBody.name = 'Body';
  dBody.resize(1440, 844);
  dBody.y = 56;
  dBody.fills = solidPaint('#191919');
  dBody.layoutMode = 'VERTICAL';
  dBody.primaryAxisAlignItems = 'CENTER';
  dBody.paddingTop = 64;
  dBody.paddingLeft = dBody.paddingRight = (1440 - 672) / 2;
  dBody.itemSpacing = 32;
  dBody.primaryAxisSizingMode = 'FIXED';
  dBody.counterAxisSizingMode = 'FIXED';
  dWizard.appendChild(dBody);

  const dCard = figma.createFrame();
  dCard.name = 'Content Card';
  dCard.resize(672, 380);
  dCard.cornerRadius = 14;
  dCard.fills = solidPaint('#282828');
  dCard.strokes = solidPaint('#333333');
  dCard.strokeWeight = 1;
  dCard.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.4 }, offset: { x:0,y:4 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];
  dCard.layoutMode = 'VERTICAL';
  dCard.paddingLeft = dCard.paddingRight = dCard.paddingTop = dCard.paddingBottom = 32;
  dCard.itemSpacing = 16;
  dCard.primaryAxisSizingMode = 'AUTO';
  dCard.counterAxisSizingMode = 'FIXED';
  dBody.appendChild(dCard);

  const dHeading = figma.createText();
  dHeading.fontName = { family: 'Inter', style: 'Bold' };
  dHeading.fontSize = 24;
  dHeading.characters = 'Add Your Content';
  dHeading.fills = solidPaint('#f9f9f9');
  dCard.appendChild(dHeading);

  const dSub = figma.createText();
  dSub.fontName = { family: 'Inter', style: 'Regular' };
  dSub.fontSize = 14;
  dSub.characters = 'Paste your script, notes, or article — the AI builds your reel from this.';
  dSub.fills = solidPaint('#777777');
  dCard.appendChild(dSub);

  const dTextarea = figma.createFrame();
  dTextarea.name = 'Textarea';
  dTextarea.resize(608, 120);
  dTextarea.cornerRadius = 8;
  dTextarea.fills = solidPaint('#333333');
  dTextarea.strokes = solidPaint('#444444');
  dTextarea.strokeWeight = 1;
  dTextarea.paddingLeft = dTextarea.paddingRight = dTextarea.paddingTop = dTextarea.paddingBottom = 12;
  const dPlaceholder = figma.createText();
  dPlaceholder.fontName = { family: 'Inter', style: 'Regular' };
  dPlaceholder.fontSize = 14;
  dPlaceholder.characters = 'Paste your content here…';
  dPlaceholder.fills = solidPaint('#555555');
  dTextarea.appendChild(dPlaceholder);
  dCard.appendChild(dTextarea);

  const dCta = figma.createFrame();
  dCta.name = 'CTA Button';
  dCta.layoutMode = 'HORIZONTAL';
  dCta.primaryAxisAlignItems = 'CENTER';
  dCta.counterAxisAlignItems = 'CENTER';
  dCta.paddingLeft = dCta.paddingRight = 24;
  dCta.paddingTop = dCta.paddingBottom = 10;
  dCta.cornerRadius = 10;
  dCta.fills = solidPaint('#e5e5e5');
  dCta.primaryAxisSizingMode = 'AUTO';
  dCta.counterAxisSizingMode = 'AUTO';
  const dCtaT = figma.createText();
  dCtaT.fontName = { family: 'Inter', style: 'SemiBold' };
  dCtaT.fontSize = 14;
  dCtaT.characters = 'Continue →';
  dCtaT.fills = solidPaint('#191919');
  dCta.appendChild(dCtaT);
  dCard.appendChild(dCta);

  // Dark editor screen
  const dEditor = figma.createFrame();
  dEditor.name = 'Editor Idle — Dark (1440×900)';
  dEditor.resize(1440, 900);
  dEditor.fills = solidPaint('#191919');
  dEditor.x = 1504; dEditor.y = 0;
  page.appendChild(dEditor);

  const dEditorLabel = figma.createText();
  dEditorLabel.fontName = { family: 'Inter', style: 'Regular' };
  dEditorLabel.fontSize = 14;
  dEditorLabel.characters = 'Editor — Dark Mode\nSame structure as light editor.\nApply dark token set: bg=#191919, card=#282828, border=rgba(255,255,255,0.1)';
  dEditorLabel.fills = solidPaint('#555555');
  dEditorLabel.x = 48; dEditorLabel.y = 48;
  dEditorLabel.resize(400, 80);
  dEditorLabel.textAutoResize = 'HEIGHT';
  dEditor.appendChild(dEditorLabel);

  log('✓ Dark Mode page built', 'ok');
}

// ─── Main Entry ───────────────────────────────────────────────────────────────

async function run(opts) {
  try {
    await loadAllFonts();
    progress(5, 'Fonts loaded…');

    if (opts.styles !== false) {
      log('→ Building color styles…');
      await buildColorStyles();
      progress(15, 'Color styles done');

      log('→ Building text styles…');
      await buildTextStyles();
      progress(25, 'Text styles done');
    }

    if (opts.tokens) {
      log('→ Building token reference page…');
      await buildTokenPage();
      progress(40, 'Token page done');
    }

    if (opts.components) {
      log('→ Building components page…');
      await buildComponentsPage();
      progress(60, 'Components done');
    }

    if (opts.wizard) {
      log('→ Building wizard screens…');
      await buildWizardPages(opts);
      progress(75, 'Wizard screens done');
    }

    if (opts.editor) {
      log('→ Building editor screens…');
      await buildEditorPage(opts);
      progress(90, 'Editor screens done');
    }

    if (opts.dark) {
      log('→ Building dark mode variants…');
      await buildDarkPage(opts);
      progress(98, 'Dark mode done');
    }

    figma.ui.postMessage({ type: 'done' });
    figma.notify('✅ Design system built! Check all pages in the left panel.', { timeout: 4000 });

  } catch (err) {
    console.error(err);
    figma.ui.postMessage({ type: 'error', text: String(err) });
    figma.notify('⚠ Build error: ' + String(err), { error: true });
  }
}

async function runStylesOnly() {
  try {
    await loadAllFonts();
    await buildColorStyles();
    await buildTextStyles();
    figma.ui.postMessage({ type: 'done' });
    figma.notify('✅ Color & text styles created!', { timeout: 3000 });
  } catch (err) {
    figma.ui.postMessage({ type: 'error', text: String(err) });
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'build')       run(msg.opts);
  if (msg.type === 'styles-only') runStylesOnly();
};
