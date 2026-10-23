// Bento, dark-first palette: a neutral page/surface ramp + a single indigo
// accent (with a violet partner used only for gradients). Existing keys are
// preserved so every component keeps working; values are retuned for the look.

export const lightTheme = {
  background: '#faf3f0',
  // "光与蝶"底图：整页日间模式的背景图（叠加柔光雾层保证可读性）
  backgroundImage: 'url(/images/bg/butterfly-light.jpg)',
  backgroundOverlay:
    'linear-gradient(180deg, rgba(250, 243, 240, 0.55), rgba(250, 243, 240, 0.30))',
  color: '#4a2f3b',
  textMuted: '#96707f',
  accentColor: '#c25e7a',
  accentColor2: '#9a7fc0',
  accentSoft: 'rgba(194, 94, 122, 0.14)',
  glow1: 'rgba(247, 232, 216, 0.55)',
  glow2: 'rgba(185, 205, 212, 0.35)',
  chronoTheme: {
    cardBgColor: 'rgba(255, 255, 255, 0.82)',
    cardForeColor: '#4a2f3b',
    titleColor: 'white',
  },
  timelineLineColor: 'rgba(194, 94, 122, 0.25)',
  cardBackground: 'rgba(255, 255, 255, 0.72)',
  cardFooterBackground: 'rgba(255, 250, 248, 0.72)',
  cardBorderColor: 'rgba(194, 94, 122, 0.16)',
  navbarBackground: 'rgba(255, 245, 243, 0.70)',
  shadowSm: '0 1px 2px rgba(154, 80, 105, 0.06), 0 4px 16px rgba(154, 80, 105, 0.10)',
  shadowMd: '0 8px 24px rgba(154, 80, 105, 0.14), 0 16px 48px rgba(154, 80, 105, 0.16)',
  navbarTheme: {
    linkColor: '#8a6472',
    linkHoverColor: '#4a2f3b',
    linkActiveColor: '#c25e7a',
  },
  bsPrimaryVariant: 'light',
  bsSecondaryVariant: 'dark',
  socialIconBgColor: '#4a2f3b',
};

export const darkTheme = {
  background: '#241620',
  // 与日间同一张「光与蝶」底图，叠加深梅紫黑雾层压暗，呈现暗夜光蝶效果
  backgroundImage: 'url(/images/bg/butterfly-light.jpg)',
  backgroundOverlay:
    'linear-gradient(180deg, rgba(28, 16, 24, 0.90), rgba(28, 16, 24, 0.72))',
  color: '#f6eef2',
  textMuted: '#b89aa6',
  accentColor: '#e0889f',
  accentColor2: '#b79ad1',
  accentSoft: 'rgba(224, 136, 159, 0.16)',
  glow1: 'rgba(224, 136, 159, 0.22)',
  glow2: 'rgba(155, 126, 192, 0.18)',
  chronoTheme: {
    cardBgColor: 'rgba(42, 25, 34, 0.82)',
    cardForeColor: '#f6eef2',
    titleColor: 'black',
  },
  timelineLineColor: 'rgba(224, 136, 159, 0.28)',
  cardBackground: 'rgba(42, 25, 34, 0.66)',
  cardFooterBackground: 'rgba(50, 30, 40, 0.66)',
  cardBorderColor: 'rgba(224, 136, 159, 0.20)',
  navbarBackground: 'rgba(30, 18, 25, 0.72)',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.50), 0 4px 16px rgba(0, 0, 0, 0.45)',
  shadowMd: '0 8px 24px rgba(0, 0, 0, 0.60), 0 16px 48px rgba(0, 0, 0, 0.65)',
  navbarTheme: {
    linkColor: '#b89aa6',
    linkHoverColor: '#f6eef2',
    linkActiveColor: '#e0889f',
  },
  bsPrimaryVariant: 'dark',
  bsSecondaryVariant: 'light',
  socialIconBgColor: '#f6eef2',
};
