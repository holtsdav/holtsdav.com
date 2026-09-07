---
name: holtsdav.com
description: Existing developer portfolio shell and contact controls
colors:
  page: "#090a0d"
  elevated: "#111319"
  primary: "#f5f7fa"
  secondary: "#c0c4cd"
  accent: "#91a2ff"
typography:
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  control:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 700
rounded:
  control: "10px"
  button: "12px"
spacing:
  compact: "8px"
  related: "16px"
  group: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.page}"
    rounded: "{rounded.button}"
    padding: "13px 20px"
  contact-submit:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.page}"
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

The existing portfolio uses a near-black canvas, pale text, and a blue accent. Contact inherits this restrained shell and keeps the email link and form easy to find.

This is a code-based record of the incumbent global styles and contact addition, not a new brand direction or visual approval. Browser screenshot verification was unavailable.

**Key Characteristics:**
- Dark tonal surfaces and pale readable text.
- Blue links and primary actions.
- Rounded controls with visible keyboard focus.

## Colors

The accent is a cool blue; primary and secondary retain their incumbent names for text roles.

- **Primary accent:** accent colors links, primary actions, selection, and keyboard outlines.
- **Neutrals:** page provides the canvas; elevated distinguishes fields; primary carries headings and control text; secondary carries supporting copy.

**The Shared Palette Rule.** Reuse the global color variables for the shell and contact controls.

## Typography

The incumbent body stack is recorded above. Contact uses a compact hierarchy: a fluid heading (42–64px), section titles (24px), body copy, labels (15px), and feedback (14px). Heading tracking is tighter than body copy. These contact sizes are local composition values, not a universal type scale.

The build also uses Arial as its display face. This is an incumbent compatibility fact, not a newly endorsed display-font rule.

## Layout

The shared container is centered with a maximum width of 1180px and desktop side gutters of 40px. At 760px and below, gutters become 24px. The header spans the viewport and remains sticky.

Contact narrows the shared container to 1000px, placing email beside the form. At 760px it stacks; name and email stack at 460px. These local breakpoints and dimensions describe the current contact surface. Footer content stacks on mobile.

## Elevation & Depth

Contact uses tonal separation and borders rather than elevated cards or shadows. The shared body carries a faint blue radial background wash. Other portfolio surfaces contain project-specific glow and shadow treatments; this narrow record does not promote those into contact rules.

## Shapes

Controls have gently rounded corners. Shared buttons use the button radius; contact fields, submit, and header icon links use the control radius. Thin borders separate the shared header and footer from content.

## Components

- **Buttons:** shared primary buttons use accent fill, dark text, and a small hover lift; secondary buttons use translucent fill and a light border. Contact submit changes fill on hover and dims while disabled, without a hover lift.
- **Fields:** elevated fill, visible border, persistent label, and a blue keyboard outline. Invalid fields and nearby errors use pale red. Success feedback uses pale green. Textareas resize vertically.
- **Navigation:** the wordmark leads home; the envelope leads to contact. Icon links have rounded hover backgrounds and accessible names. Footer links use secondary text and brighten on hover.
- **Focus and motion:** links use a 3px accent outline with a 4px offset; form controls use a 3px offset. Short state transitions use 160ms ease. The shared reduced-motion rule suppresses animation and transition durations.

**The Visible Feedback Rule.** Keep validation and delivery status adjacent to the form, and preserve entered content when submission fails.

## Do's and Don'ts

- Do reuse the shared palette, header, and footer.
- Do keep form labels visible and feedback beside the form.
- Do respect the existing reduced-motion override.
- Don't turn contact into a promotional landing page.
- Don't treat page-specific measurements as universal layout tokens.
