# Ziki — Better together

A focused homepage recreation inspired by [ziki.dev](https://ziki.dev), with a subtle bug-catching interaction integrated into its existing hero. No separate game panel or game-specific call to action.

## Implemented features

- Ziki-inspired navy/blue homepage, headline, workflow overview, agent section, developers section, contribution rewards, and closing call to action.
- Original navigation labels and **Get started** / **Get started free** buttons restored. Sign-in and API links point to the real Ziki site; section links stay on this page.
- Beetle-shaped bugs have a continuous head-to-body silhouette without a mouth-like neck line, elongated paired wing covers with a center seam, six jointed legs, and two antennae, with blue, peach, and lilac shells. They have two rounded protruding eyes at the front of the head, with fixed dark pupils and no mouths, eyebrows, or facial expressions.
- Three small bugs occupy hero whitespace without adding layout space. Press or tap a bug while it is crawling to catch it immediately; keyboard users can use Tab and Enter/Space. Bugs can also be caught during retreat. A temporary copy of the header logo wakes with two small eyes, shoots a thin web-like strand, reels the bug back to its position, and finishes with a small sparkle. The header icon leaves an empty reserved slot during travel. On return, the thread disappears, the icon stays awake for about 850 ms with a blink, and its eyes then disappear. The icon and target have no catch glow. The Ziki home link stays usable while the icon is away, and its reserved slot prevents layout shifts.
- Discovery cues: bugs freeze and tilt on hover or keyboard focus, with a “Spotted a bug? Squash it.” tooltip. On every page load, Ziki swoops from the header on a thin thread, squashes one bug, and returns home. Then a seven-second “Your turn. Click or tap a bug to squash it.” hint appears beside exactly one remaining bug; no duplicate invitation appears at the squashed bug’s position. The base icon artwork is unchanged; temporary eyes appear only on the moving copy during a catch. Reloading always resets the introduction and its hint; there is no session flag suppressing it. Reduced-motion users see the hint directly without the automatic catch. A manual catch before the introduction cancels it. Escape dismisses visible cues.
- Brief compliments appear near the catch; no score, replay panel, or game invitation. Bugs stay caught until the page reloads.
- Bugs move gently for less than five seconds, then settle. OS reduced-motion preference disables movement and uses instant catches.
- Light/dark theme toggle, keyboard focus, live catch announcements, and responsive layouts.

## Light mode

Use the sun/moon control in the header. Light mode uses white cards on a pale blue background, dark ink for body text and metadata, stronger bug colors, a darker silk thread, readable white hints, and a blue keyboard-focus outline. A dragged bug also changes to a contrasting color if the theme is switched during capture.

Browser spot checks of twelve text samples measured 5.53:1–7.35:1 contrast against their nearest solid backgrounds. This is a targeted check, not a complete accessibility audit. Hero and Developers layouts were visually inspected in light mode; phone/device testing remains outstanding.

## Random catch styles

Manual catches independently choose among three styles with equal probability when a suitable heading letter is visible. The first-load demonstration and catches without a safe letter retain the original two-style choice:

- **Swoop and grab:** Ziki travels down its thread to the bug, catches it, and returns to its origin.
- **Web drag:** Ziki stays at its origin, shoots a strand, and reels the bug back to its position.
- **Letter peek:** Ziki rises above a measured heading letter (480 ms), looks toward the clicked bug (320 ms), then shoots a strand and reels it in. It slips back behind the letter afterward. This uses a clipped reveal without a colored opening or changes to the heading markup. The header logo stays in place.

The original two styles use the header origin for hero bugs and a local section origin for section bugs. Letter peeks use a visible heading in the clicked bug’s section, with room above it and separation from the target. Eyes, sleep/retreat cleanup, scroll tracking, and reduced-motion instant catches are shared. Independent randomness can repeat the same style consecutively. Section catches have a 30% chance to launch from a farther visible corner of the same card or section, when it adds at least 60 pixels of distance; otherwise they use the nearby edge.

## Hero introduction

The blue introductory bug crawls from its original hero shelter and Ziki catches it automatically. Then the peach user bug crawls in a straight horizontal line from behind the right edge of **Get started free**, with the “Your turn” hint beside it. The button itself hides the bug before it clears the edge; there is no fade, reveal mask, or turning effect. The button remains clickable and in its original position. If its bug shelter is offscreen, both the user crawl and invitation wait until scrolling or resizing brings the shelter fully into view. Every reload schedules the demonstration after 1 second. If its bug is below the viewport, the introduction waits and retries when scrolling, resizing, or returning to the tab makes it visible. A header just above the viewport no longer blocks the catch; Ziki can enter from the top edge. Skipping or ignoring it never prevents bugs appearing in other sections; the recurring visitor timer runs independently. The hero also supports recurring visitors after the original button bug is caught.

## Quiet section visitors with shared timing

Bugs remain attached to the section currently in view: their hiding places and mascot catches use that section’s content. Presentation timing uses a shared timer that starts after 0.25 seconds of visible page time. Moving between sections does not restart it. The scheduler chooses a shelter currently in view, including the hero, How it works, AI agents, Developers, Points, and the closing section; it no longer requires 40% of a section to be visible. In the hero, the original button bug keeps its turn until caught; recurring bugs can then emerge there too. Before revealing a visitor, the scheduler checks that its entire clipped crawl area fits inside the current viewport with a 12-pixel margin. Offscreen headings/cards are excluded; if the chosen shelter is too low, it tries the same section’s edge. If neither fits, it waits and checks again rather than spawning below the screen. Scrolling after emergence can still move an existing bug out of view naturally. It does not block copy or controls and has no introductory prompt. Click it and Ziki pops out from a nearby card edge in that section, shoots a strand toward the bug, reels it back to its position, and folds back into the same edge. The header icon stays in place for section catches; hero catches still depart from the header.

Only one recurring visitor exists at a time, and no extra visitor is added beside the original button bug in the hero. An ignored visitor begins retreating after 6 seconds, unless it has keyboard focus or a catch is running. It turns and crawls back beneath the same card/word edge over roughly 3–5 seconds, depending on its chosen route, rather than vanishing. Six legs step in alternating groups during entry and exit, and stop while it rests. Squashed bugs use the catch effect instead of retreating. After it is fully hidden or its catch finishes, all sections, including the same section, wait at least 2 seconds. Moving between sections preserves the page timer. If scrolling leaves a visitor fully offscreen, its slot is released and a replacement can emerge at a visible shelter after 0.1 seconds. Focused bugs and running catches are protected. Returning from a hidden tab starts a fresh 0.25-second dwell. Timing is temporary for the current page load. With reduced motion, the bug appears without crawling.

Hero bug artwork is 36 pixels (32 on narrow screens), and section visitor artwork is 32 pixels (30 on narrow screens). Hero click targets remain larger than the artwork. Hiding places randomly choose among card edges and measured heading-word edges; when a word has insufficient side space, a card/section edge is used instead. Text is measured without changing its markup. Emergence uses the existing clipped shelter without an opaque edge strip, so no dark opening appears over gradients; the hero button itself covers its emerging bug. Visitors retain the earlier CSS stepping and 2.6–4 second pace. Wider card margins vary between straight-across paths, upward/downward turns, and diagonals. Narrow word gutters use upward/downward turns only. Each uses the corresponding reverse path when leaving. For the presentation, the initial dwell is 0.25 seconds and the cooldown is 2 seconds; missed offscreen visitors use a 0.1-second relocation pause. Failed shelter attempts and busy-animation retries are checked again after 100 ms. These are minimum waits: a visible safe shelter and an available catch slot are still required. Hero crawling retains its earlier motion.

Timing constants live in `eggTiming` in [dist/app.js](dist/app.js). No tracking or external service is involved.

## Quick start

Requires Node.js supporting ES modules. No package installation or build step is needed.

```sh
node serve.mjs
```

Open http://127.0.0.1:4175. Stop with Ctrl+C. The server binds only to the local computer. Google Fonts is optional; installed sans-serif fonts serve as fallbacks offline.

## Usage

Use the homepage normally. The small bugs near the hero's edges can be clicked to discover Ziki's response. Hover or focus a bug to reveal the action hint; touch users see the brief introductory hint without needing hover. Reload to see them again. Get started opens the real Ziki sign-in page; this prototype has no authentication.

The initial design placed bugs in a separate interactive panel and changed the main buttons to invite play. This revision removes that panel and restores product-focused navigation, so the interaction feels like part of the homepage.

## Implementation

- [dist/index.html](dist/index.html): homepage sections, standard navigation, SVG bugs, and non-interactive animation overlays.
- [dist/styles.css](dist/styles.css): layout, theme, finite ambient movement, and absolute-positioned bugs in hero margins. The overlay ignores pointer events except on bugs.
- [dist/app.js](dist/app.js): shared catch lock, logo travel, transient compliments, motion preference, and theme toggle. No real issue state or contribution points are changed.
- [serve.mjs](serve.mjs): local static server serving only the four public assets.
- [checks/interaction.test.mjs](checks/interaction.test.mjs): regression checks for reduced motion, duplicate/concurrent catches, recovery after travel, and theme controls using a lightweight DOM simulation.

## Verification

```sh
node --check dist/app.js
node --check serve.mjs
node --test checks/interaction.test.mjs
```

Browser workflow: reload, catch a bug, and expect an empty header icon slot during the thread-guided swoop, temporary eyes, a sparkle, a brief compliment, and the logo returning home. Its thread disappears on landing; its eyes linger, blink, then disappear. The moving icon and target should have no glow. Catch another with Enter; keyboard focus should continue to a remaining bug. Confirm normal navigation links and Get started targets, and toggle light/dark mode. Enable OS reduced motion and repeat: catches should be instant. Check phone widths for readable content and bugs clear of controls. Catches do not create real issues or resolve them.

Observed checks for this revision: both syntax checks and all thirty-three regression tests passed. Browser verified the first-load catch, two remaining bugs, and the follow-up prompt. Earlier checks verified direct homepage catching, keyboard catching, focus moving to the next bug, and the light theme in the earlier revision. For the discovery cues, visually checked the initial hint and the tooltip on keyboard focus; hint dismissal, replay on reload, and independent section scheduling pass regression checks. Narrow desktop layout visually inspected. Phone-width and OS reduced-motion device checks remain unverified; reduced-motion logic is covered by the simulated check.

## Limitations

This remains a focused recreation, not Ziki's actual source or a pixel-exact full-site clone. No Issues screen, backend, accounts, real issue changes, production points, or deployment. Repository: [sanmi21/ziki-whimsy-bugs](https://github.com/sanmi21/ziki-whimsy-bugs). Website deployment has not been performed. Logo artwork is locally recreated SVG; agent conversations and event/reward examples are illustrative. The introduction automatically catches one bug on each page load when visible and motion is enabled. Subsequent catches require user input. Hero bugs reset on reload; recurring visitors use one page-wide timer, including the hero.

Progress: [docs/work-log.md](docs/work-log.md).
