---
name: holtsdav.com
description: Refined lightmode portfolio design system inspired by Cindy Ly and Mac Stats
colors:
  page: "#f8f8f6"
  elevated: "#ffffff"
  primary: "#18181b"
  secondary: "#52525b"
  accent: "#2563eb"
typography:
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  control:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 600
rounded:
  control: "10px"
  button: "9999px"
  card: "22px"
spacing:
  compact: "8px"
  related: "16px"
  group: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.elevated}"
    rounded: "{rounded.button}"
    padding: "13px 20px"
  contact-submit:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.elevated}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  contact-input:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
---

# Design System: holtsdav.com

## Overview

The portfolio features a warm, refined **Lightmode Design** inspired by [cindyly.design](https://www.cindyly.design/) paired with a **floating island header** inspired by [Mac Stats](https://mac-stats.com/).

**Key Characteristics:**
- Warm paper/sand canvas (`#f8f8f6`) with an ultra-delicate 32px technical line grid.
- Crisp porcelain elevated surfaces (`#ffffff`) with diffused elevation drop shadows.
- High-contrast obsidian typography (`#18181b`) and royal cobalt accent (`#2563eb`).
- Floating frosted glass island header that transitions seamlessly from transparent at top to a blurred capsule pill on scroll.
- High-definition Three.js particle wordmark with crisp circular discs and no noise artifacts.
- Translucent pill tags and badges with subtle hairline borders.

## Colors

- **Page Canvas (`#f8f8f6`):** Warm off-white sand foundation.
- **Elevated Surfaces (`#ffffff`):** Pure white for cards, hero app squircles, inputs, and modal panels.
- **Primary Text (`#18181b`):** Deep charcoal ink for headings, prominent actions, and high-contrast labels.
- **Secondary Text (`#52525b`):** Muted neutral slate for body copy, descriptions, and metadata.
- **Brand Accent (`#2563eb`):** Royal cobalt for interactive links, focus rings, and the `dav` wordmark accent.
- **Muted Borders (`rgba(0, 0, 0, 0.08)`):** Hairline structural dividing lines.

## Header Architecture (Mac Stats Floating Island)

The header uses a sticky wrapper with a fixed floating container (`.header-floating-wrap`):
- **Base State (Top of page):** Transparent background, no borders, natural blend into the hero canvas.
- **Scrolled State (`data-scrolled="true"` on `scrollY > 16`):**
  - Background: `rgba(255, 255, 255, 0.82)`
  - Backdrop Filter: `blur(20px) saturate(180%)`
  - Border: `1px solid rgba(0, 0, 0, 0.08)`
  - Shape: Fully rounded capsule pill (`border-radius: 9999px`)
  - Shadow: Multi-tier diffused shadow (`0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 4px 10px -4px rgba(0, 0, 0, 0.03)`)
- **Wordmark Logo (Top-left):**
  - Two-tone styling: `holts` in deep dark slate (`#0f172a`), `dav` in radiant cobalt (`#2563eb`).
- **Navigation Items:**
  - Center pill links (`Projects`, `About`) with subtle hover backgrounds.
  - Social link circular buttons (GitHub, LinkedIn, X).
  - High-contrast dark pill `Contact` action button (`#18181b` background, `#ffffff` text, rounded-full).

## Particle Wordmark Polish

- **Shaders:**
  - Vertex shader palettes updated for light canvas contrast: `holts` in deep slate (`#0f172a`), `dav` in royal cobalt (`#2563eb`).
  - Fragment shader uses tight anti-aliasing (`smoothstep(0.72, 1.0, dist)`) to produce crisp circular discs without television-static alpha noise.
- **Density & Physics:**
  - Increased sample density and optimized particle sizes for solid glyph legibility in bright environments.
  - Interactive spring physics, mouse avoidance, and morph mechanics between `holtsdav` and `David Holtschke` are fully preserved.

## Cards & Components

- **Project Gallery Cards:** Porcelain white cards with subtle borders (`rgba(0, 0, 0, 0.07)`), preview image headers, and Cindy Ly translucent pill tags (Platform, Language/Tool, Monetization, AI disclosure).
- **Floating App Constellation:** Hero app icons rendered as white porcelain squircles with multi-tier elevation drop shadows and gentle floating keyframe animations.
- **Buttons & Pills:** Pill shapes (`border-radius: 9999px` or `12px`), dark primary button, translucent secondary badges.
- **Contact Form:** High-contrast white input containers with subtle borders and cobalt focus rings (`#2563eb`).
