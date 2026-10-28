## 2026-10-27 — Whimsical homepage prototype

- Objective and starting point: recreate only the public homepage needed to present a playful human–agent bug-catching interaction. No existing Ziki source checkout is present.
- Checkpoint 1 — Investigation: inspected the live homepage and its navigation, hero, workflow, and agent messaging. Use a standalone buildless HTML/CSS/JavaScript prototype; preserve navy/blue styling and human-controlled interaction. Parent workspace is on master with unrelated untracked projects; leave those untouched.
- Constraints: user is creating the repository. Git setup and publication are deferred; no branch has been approved. No accounts, real issue data, backend, or contribution points.
- Checkpoint 2 — Implementation: added the [homepage](../dist/index.html), [responsive styling](../dist/styles.css), local SVG artwork, and [catch interaction](../dist/app.js). User flags a bug, mascot catches it, and a compliment appears; replay, motion controls, keyboard focus, and live announcements support repeatable presentation.
- Checkpoint 3 — Verification: `node --check dist/app.js` passed. Browser observed all three catches, completion at 3/3, replay restoring the bugs, motion toggle state, and Enter activating an instant catch while paused. Visually inspected the narrow desktop layout. Python preview listened but timed out; replaced it with the working [Node static server](../serve.mjs). Phone-width and OS reduced-motion checks remain unverified.
- Checkpoint 4 — Documentation: added [README](../README.md) with actual run/check commands, presentation workflow, implementation boundaries, and verification limits.
- Outcome: homepage prototype implemented locally; repository setup and deployment deferred at user's request. Issues screen is a later feature. Ready for visual feedback.


## 2026-10-27 — Integrate whimsy into the homepage

- Objective and starting point: the first version felt like a separate minigame and changed the product CTAs. User requested the interaction feel native to Ziki, retaining standard buttons and layout.
- Checkpoint 1 — Investigation: traced the panel markup, animation coordinates, replay/score state, and existing homepage styles. Replace the panel with absolute-positioned bugs in existing hero whitespace; animate a copy of the header logo so the navigation remains usable.
- Checkpoint 2 — Implementation: removed the separate panel, instructions, score, and replay controls; restored Get started / Get started free and original navigation labels, plus Developers/Points sections and theme toggle. Catch feedback is a short local compliment. Finite ambient movement settles in under five seconds; reduced motion catches instantly. See [markup](../dist/index.html), [styles](../dist/styles.css), and [interaction](../dist/app.js).
- Checkpoint 3 — Verification: both JavaScript syntax checks and three [regression tests](../checks/interaction.test.mjs) passed. Initial concurrency-test assertion ran before cross-context promise continuation; corrected the test to await the event-loop turn, then all checks passed. Browser confirmed click and keyboard catches on the homepage, focus continuing to a remaining bug, and light theme. Narrow desktop screenshot inspected; phone and OS-level reduced-motion checks remain unverified.
- Checkpoint 4 — Documentation: updated [README](../README.md) for the integrated behavior, standard links, verification commands, and prototype limitations. Earlier separate-panel behavior is superseded by this entry.
- Outcome: revised homepage implemented locally, ready for review. Git setup and publishing remain deferred; no branch or repository operation performed.


## 2026-10-27 — Make the bugs discoverable

- Objective and starting point: integrated bugs were clickable but gave users little reason to discover the action. Keep the original homepage layout and add cues directly to the bugs.
- Checkpoint 1 — Investigation and implementation: reused existing bug buttons and labels. Added hover/focus movement pause, tilt, small pupil reaction, and a click-to-squash tooltip. Added a seven-second introduction beside the blue bug; the first catch dismisses it for the tab with a session-storage fallback. Escape hides cues. Updated [markup](../dist/index.html), [styles](../dist/styles.css), and [interaction](../dist/app.js).
- Checkpoint 2 — Verification and docs: JavaScript syntax check and all five [regression checks](../checks/interaction.test.mjs) passed, including first-catch dismissal, session persistence, and Escape/focus behavior. Browser visually verified the initial hint and a keyboard-focus tooltip. Corrected tooltip rotation after the initial screenshot. Updated [README](../README.md). Phone and OS-level reduced-motion device checks remain unverified.
- Outcome: completed locally; discovery cues added without changing page layout or product CTAs. Repository and publication remain deferred.


## 2026-10-27 — Reference-inspired bug design

- Objective and starting point: user wanted bugs closer to the supplied beetle reference; smiling bugs asking to be squashed made the catch feel less rewarding.
- Investigation and implementation: retained the shared code-native SVG and interaction. Replaced the friendly segmented bodies and smiles with rounded dark shells, offset watchful eyes, angular legs, antennae, and blue/peach/lilac markings. Each bug has a different orientation. Tooltip now says “Spotted a bug? Squash it.” See [SVG](../dist/index.html) and [styles](../dist/styles.css).
- Verification and docs: JavaScript syntax and all five regression checks passed. Browser screenshot visually checked the new blue and peach bugs against the navy homepage. Updated [README](../README.md) to describe the new design and tooltip. Phone and OS-level reduced-motion device verification remain outstanding.
- Outcome: updated bug design implemented locally for review; page layout and catch behavior retained. Repository and deployment still deferred.


## 2026-10-27 — Clarify the beetle silhouette

- Objective and starting point: round shells with radial appendages looked like viruses. User supplied a more elongated insect reference and requested a clearly visible bug shape.
- Investigation and implementation: replaced the shared [SVG](../dist/index.html) with a separate head and shoulder segment, long paired wing covers, a center seam, exactly six jointed legs, and two head-mounted antennae. Preserved blue/peach/lilac coloring, wary eyes, homepage positions, and catch behavior. Updated [README](../README.md).
- Verification and outcome: all five existing regression checks passed. Browser visually verified the blue, peach, and lilac beetle silhouettes on the homepage. Completed locally; phone/device verification and publication remain deferred as previously recorded.


## 2026-10-27 — Remove facial personality

- Objective: user requested mouthless bugs without personality. Existing beetles had no mouths, but large eyes, brows, and pupil reactions still created expression.
- Change: replaced expressive eyes with small plain insect eyes, removed eyebrows and pupil reactions in [SVG markup](../dist/index.html) and [styles](../dist/styles.css). Retained beetle anatomy and colors. Updated [README](../README.md).
- Verification and outcome: all five regression checks passed; browser visually verified the plain mouthless insects. Completed locally, with no Git or publication changes.


## 2026-10-27 — Add reference-style bug eyes

- Objective: user clarified that visible eyes are wanted, matching the supplied insect reference, without adding facial personality.
- Change: replaced tiny side eyes with two rounded protruding front eyes and fixed dark pupils in the shared [SVG](../dist/index.html). No mouths, brows, or eye reactions. Updated [README](../README.md).
- Verification and outcome: visually verified all three SVG bugs in the browser. Artwork-only change; interaction code unchanged, so regression tests were not rerun. Completed locally; publication remains deferred.


## 2026-10-27 — Remove the mouth-like neck seam

- Objective: user identified the outlined head/shoulder join as resembling a mouth.
- Change: replaced overlapping outlined head and shoulder pieces with one continuous filled silhouette in the shared [SVG](../dist/index.html). Kept the front eyes, six legs, antennae, colors, and lower wing seam. Updated [README](../README.md). Interaction code unchanged.
- Verification and outcome: browser screenshot confirmed the continuous silhouette without the curved neck line on all three bugs. Artwork-only change; tests not rerun. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Demonstrate catching on first load

- Objective and starting point: replace a passive introductory hint with Ziki demonstrating the interaction, while keeping the icon artwork unchanged.
- Implementation: added a once-per-tab introduction after 900 ms. The icon rolls to one bug, catches it, returns to the header, and places “Your turn. Click or tap a bug to squash it.” beside a surviving bug. Reduced motion skips the automatic catch. Manual catching or Escape cancels a pending introduction. Offscreen starts are skipped; automatic catches do not move keyboard focus. See [interaction](../dist/app.js) and [styles](../dist/styles.css).
- Verification: JavaScript syntax and all eight [regression checks](../checks/interaction.test.mjs) passed, including once-per-tab behavior, two remaining bugs, hint placement, reduced motion, and an early manual catch. Browser confirmed one automatic catch and the follow-up prompt. Found and corrected invalid CSS `rotate:0` values to `rotate:0deg` so the prompt remains horizontal. Phone and OS-level motion checks remain unverified.
- Documentation and outcome: updated [README](../README.md). Implemented locally; Git and deployment remain deferred.


## 2026-10-27 — Spider-like swoop and waking eyes

- Objective: replace rolling travel with a spider-like swoop, remove catch glow, and temporarily wake the Ziki icon with eyes.
- Investigation and implementation: reused the catch lifecycle and unchanged base icon. Added a thin SVG thread that follows the moving icon, a hanging descent with a small overshoot, and an upward retraction. Added eyes as an overlay only while catching; removed icon/target glow. Cleanup hides both thread and eyes. Reduced-motion instant catches remain supported. See [interaction](../dist/app.js), [markup](../dist/index.html), and [styles](../dist/styles.css).
- Verification and docs: syntax check and all eight regression checks passed, including assertions that thread/eyes activate and clean up. Browser screenshot captured the thread, awake icon, and absence of target/mascot glow during a catch. Updated [README](../README.md). Phone/device motion checks remain unverified.
- Outcome: completed locally for review; Git and deployment remain deferred.


## 2026-10-27 — Departing icon and sleepy return

- Objective: make the header icon actually leave its slot and retain its eyes for a blink after returning.
- Implementation: added a reserved brand-mark wrapper; hide the original image during animated travel without moving the Ziki text or home link. On landing, restore the icon, hide the thread, and show header eyes for an 850 ms hold/blink/sleep sequence. Error cleanup always restores the icon and removes eyes. Updated [markup](../dist/index.html), [styles](../dist/styles.css), and [interaction](../dist/app.js).
- Verification: syntax and all eight [checks](../checks/interaction.test.mjs) passed with added assertions for the empty slot, awake landing phase, and sleeping cleanup. Browser exercised an animated catch; phone/device motion checks remain unverified. Updated [README](../README.md).
- Outcome: implemented locally; Git and deployment remain deferred.


## 2026-10-27 — Show the introduction prompt only beside a surviving bug

- Starting issue: the catch-status element retained its visible state when its text changed to the invitation, creating a duplicate at the squashed bug's location.
- Fix: clear the catch message timer and hide that visual status before announcing the invitation. Only the hint attached to one surviving bug is visible; screen-reader announcement remains available. Updated [interaction](../dist/app.js) and [README](../README.md).
- Verification: syntax check and all eight regression checks passed, including a new assertion that the catch-status element is hidden after the automatic introduction. Browser check not rerun for this focused fix.
- Outcome: completed locally; Git and publication unchanged.


## 2026-10-27 — Quiet timed bugs in reading sections

- Objective: make bugs occasional Easter eggs beyond the hero, without distracting from Ziki's product explanation.
- Investigation and implementation: reused the SVG and catch lifecycle; added visibility-based section dwell, one active section visitor, and delayed reappearance. After 20 seconds of visibility a bug emerges under a section edge, away from its copy. It leaves after 12 seconds if ignored, with a 60-second global and 120-second same-section cooldown. Hidden tabs and section changes reset dwell; focused bugs and ongoing catches are not removed by timeout. No extra prompts or automatic catches. Updated [script](../dist/app.js) and [styles](../dist/styles.css).
- Verification: syntax and all nine regression checks passed, including dwell and both cooldown boundaries. Browser workflow verification in progress.
- Documentation: updated [README](../README.md) with timing, visibility, behavior, and configuration location.

- Browser checkpoint: observed a single bug emerge in the Developers section while the text and API example remained unobstructed, and invoked its catch. For section catches when the header is offscreen, Ziki starts just above the viewport to avoid a long travel path through the page.
- Outcome: quiet section visitors implemented locally; README and work log updated. Nine checks passed; phone/device verification and deployment remain deferred.


## 2026-10-27 — Shorter section bug timing

- Request and change: changed section dwell from 20 to 4 seconds and both global/same-section cooldowns to 15 seconds after disappearance or catch. Kept the 12-second ignored-bug lifetime and one-visitor limit. Updated [script](../dist/app.js), timing assertions in [checks](../checks/interaction.test.mjs), and [README](../README.md).
- Verification and outcome: syntax check and all nine regression checks passed with the revised 4-second dwell and 15-second cooldown assertions. Browser timing not rerun for this configuration-only edit. Completed locally; Git and publication unchanged.


## 2026-10-27 — Crawl in and crawl out

- Objective: ignored bugs should visibly crawl back into shelter instead of disappearing at timeout.
- Implementation: split SVG legs into alternating stepping groups. Section visitors emerge head first, pause their legs at rest, turn, and crawl under the same clipped edge after their 12-second appearance. Removal and the 15-second cooldown start only after the 1.8-second retreat finishes. Catching still uses the squash effect. Focus protection, one-visitor limit, and reduced-motion support remain. Repeated retirement calls cannot cancel an in-progress exit. Updated [SVG](../dist/index.html), [styles](../dist/styles.css), and [lifecycle](../dist/app.js).
- Verification and docs: syntax check and all eleven regression checks passed, including delayed removal for retreat and immediate retirement of caught bugs. Updated [README](../README.md). Browser visual verification in progress; phone/device motion checks remain unverified.
- Browser checkpoint and outcome: screenshot captured the visitor at its shelter edge; DOM confirmed the retreating/is-crawling state, crawl-out animation, and upward-facing SVG during exit. Completed locally; Git and publication unchanged.


## 2026-10-27 — Keep the swoop smooth during scrolling

- Starting issue and cause: scrolling explicitly called `activeAnimation.finish()`, skipping the remaining swoop. Coordinates captured before scrolling also left fixed overlays behind their document targets.
- Fix: removed scroll-to-finish handling, compensate the fixed mascot and thread origin for scroll displacement each animation frame, and position catch feedback in document space. Existing animation progress continues uninterrupted. Resizing still finishes the active phase because layout may reflow. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [README](../README.md).
- Verification: syntax and all twelve regression checks passed, including scrolling mid-catch without early completion and correctly anchored catch feedback. Browser scrolled 232 pixels during a catch; screenshot confirmed the active icon and thread stayed aligned with the bug. Phone/device checks remain unverified.
- Outcome: fixed locally; Git and deployment unchanged.


## 2026-10-27 — Smaller bugs behind cards and heading words

- Objective: vary hiding places to include divs and words, and reduce bug size.
- Implementation: section visitors alternate between card edges and the measured end of a heading's final word, with a safe card/section fallback when there is insufficient space. Word visitors crawl sideways out and back; card visitors crawl vertically. SVG artwork reduced to 36 px for hero bugs and 32 px for section visitors, with smaller mobile sizes. No heading markup changes; timing remains 4-second dwell and 15-second cooldown. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [README](../README.md).
- Verification: syntax check and all twelve existing regression checks passed. Browser visual verification in progress; phone/device layout checks remain unverified.
- Browser checkpoint and outcome: verified a 32 px visitor emerging beside the final word of the Developers heading, with unchanged text and product controls. Screenshot saved for review. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Longer crawling paths

- Objective: bugs barely moved beyond their hiding places.
- Change: expanded clipped travel areas and paths so card bugs crawl 60 pixels beyond the edge, and word bugs emerge sideways, turn, and crawl 68 pixels down before resting. Return travel retraces the route. Entry takes 3 seconds; retirement waits for the longer return before removal and cooldown. Reduced-motion visitors remain stationary. Updated [styles](../dist/styles.css), [script](../dist/app.js), and [README](../README.md).
- Verification and outcome: syntax and all twelve regression checks passed. Browser confirmed the word visitor reached translate 8px 68px, stopped its crawling state, and remained in the gap beside the content without covering text. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Ziki emerges from the current section

- Objective: outside the hero, have Ziki pop out from that section for a spider-web-style catch instead of travelling from the header.
- Implementation: section catches anchor to a nearby card/section edge, scale into view with awake eyes, swoop along a short thread, return, and fold back into that local shelter. They leave the header icon in place and skip its return blink. Hero catches retain the existing header departure and sleep sequence. Scroll compensation and reduced-motion behavior remain. Updated [interaction](../dist/app.js) and [README](../README.md).
- Verification and outcome: syntax and all thirteen regression checks passed, including a new section-local catch/cleanup check. Browser screenshot confirmed Ziki emerging at the Developers card edge with a short thread. Completed locally; phone/device verification, Git setup, and deployment remain deferred.


## 2026-10-27 — Varied crawling and web reeling

- Objective: reduce predictable spawning/movement, eliminate floating return motion, and have Ziki shoot a web to drag a bug to its position.
- Implementation: randomly choose safe heading/card shelters, card-edge positions, 40–72 px travel lengths, left/right drift, and 2.6–4 second entry speeds. Return paths retrace the chosen route; corrected hover rules so legs and direction changes continue during retreat. Ziki now pops awake at its origin, shoots a strand, and reels a temporary bug drawing back along it; feedback appears on arrival, then Ziki retreats/sleeps. Captured bugs stop walking as they are pulled. Local origins use the nearer visible card edge. Scroll compensation and motion preferences remain supported. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [markup](../dist/index.html).
- Verification: syntax and thirteen regression checks passed, including added assertions for the dragged bug's appearance and cleanup. Browser exercised a randomized card visitor and web shot. Updated [README](../README.md). Phone/device checks remain unverified.
- Outcome: implemented locally for review; Git and deployment unchanged.


## 2026-10-27 — Optional guided reading crawl

- Objective: use a crawl to support understanding of Ziki's report-to-merge workflow without requiring interaction to read the page. Also align the agreed hero demonstration with crawling bugs.
- Implementation: added an opt-in six-stage guide, user-paced Next/Finish controls, stage highlighting and live explanations, and a small crawler along the workflow edge. Wrapped rows bring the active card into view with a sticky explanation; Close/Escape exit and return focus to the start control. Ordinary section visitors wait while guiding. The hero demonstrates one crawling bug, then reveals a second with the user hint; previously floating extra bugs are hidden. See [markup](../dist/index.html), [script](../dist/app.js), and [styles](../dist/styles.css).
- Verification: syntax and all fourteen regression checks passed, including guide explanation coverage. Browser exercised opening and all six stages through Merge; guide copy and controls rendered correctly on the narrow desktop layout. Phone and OS-level reduced-motion checks remain unverified. Hero timed respawning after the second catch remains outside this pass.
- Documentation: updated [README](../README.md) with guide usage, verification, hero sequence, and limits.
- Outcome: implemented locally; Git and publication unchanged.
- Final browser checkpoint: verified all six stages, Finish returning focus to the launch control, and reopening at Report. Saved the guide preview with its explanation, crawler, highlighted card, and unchanged workflow copy.


## 2026-10-27 — Remove the optional workflow guide

- Request: remove the How it works guide.
- Change: removed its launch/Next/Close controls, explanation block, guided crawler, highlighting, guide script/styles, and guide-only regression test. Restored normal section visitor scheduling; retained the original six workflow cards, hero crawling sequence, and bug-catching interactions. Updated [README](../README.md).
- Verification and outcome: syntax and all thirteen remaining regression checks passed; source search found no guide references in implementation/tests/README. Browser confirmed the guide is absent and all six original workflow cards remain. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Randomly use both Ziki catch animations

- Objective and starting point: web dragging had replaced the swoop. User requested both be chosen randomly.
- Implementation: restored swoop-and-grab alongside web dragging and added one independent 50/50 selection per accepted catch. Both work from hero/header and local section origins. Feedback occurs where the capture completes; cleanup, eyes, scrolling, and reduced-motion behavior are shared. Updated [interaction](../dist/app.js) and [README](../README.md).
- Verification and outcome: syntax and all fifteen regression checks passed. New deterministic checks force each random branch and verify whether the moving animation belongs to Ziki or to the dragged bug, plus cleanup. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Longer walks and immediate catches

- Objective: increase travel and allow catching before a bug stops walking.
- Implementation: increased randomized travel to 100–160 px. Card bugs turn and walk left/right below their card; word bugs travel down the adjacent gutter. Widened clipping areas and cap card distance on narrow screens. Catch starts on primary pointer press (mouse/touch), with click/keyboard fallback, and freezes the current position. Retreating visitors remain catchable; their pending removal is canceled when caught. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [README](../README.md).
- Verification: syntax and all seventeen regression checks passed, including immediate pointer catch, right-click exclusion, and interrupting a retreat. Phone/device layout remains unverified.
- Browser checkpoint and outcome: visually verified the longer word-gutter path and invoked a pointer catch. The observed visitor had already reached rest, so mid-motion capture is covered by the automated pointer/retreat checks rather than claimed as browser-verified. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Varied routes, turns, and pacing

- Objective: make movement less linear, with straight crawls, diagonal travel, turns, and varied timing in empty space.
- Implementation: replaced section CSS-only paths with per-visitor waypoint routes. Select a route type different from the previous visitor, randomize direction/distance, use a 3.8–6.2 second crawl with a varied brief pause, and derive facing from each segment. Return reverses the exact waypoints at 80% duration. Position and heading pause together on hover/focus or capture; cleanup cancels both. Hero crawls also use varied routes within their shelters, retaining their 2.4-second introduction timing. Existing 4-second emergence and 15-second cooldown remain. See [route generator and playback](../dist/app.js) and [styles](../dist/styles.css).
- Verification: syntax and all nineteen regression checks passed. New checks cover non-repeating route types, bounded card waypoints, pause positions, reverse endpoints, and reversed facing. Browser observed a generated straight route, its downward facing, and stopped state in the Developers gutter. Full phone/device and all-route visual checks remain unverified.
- Documentation and outcome: updated [README](../README.md). Implemented locally; Git and publication unchanged.


## 2026-10-27 — Restore the earlier crawl, vary only the path

- Correction: user rejected the waypoint-based motion as floating and requested the previous crawl with simpler directional variants.
- Change: removed the new waypoint player and hero route override, restoring the earlier CSS stepping, pace, and return lifecycle. Added straight-across, upward-turn, downward-turn, and diagonal variants in wide card margins; narrow word gutters use upward/downward variants only. Facing changes and return headings follow these simple paths. Existing 4-second emergence, 15-second cooldown, immediate catches, and random Ziki catch styles remain. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [README](../README.md).
- Verification: syntax and all seventeen remaining checks passed; removed two tests specific to the rejected waypoint system. Browser visual check in progress. Device checks remain unverified.
- Browser checkpoint and outcome: confirmed the restored CSS word-up-in animation and upward variant in the Developers gutter, with the visitor resting after travel. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Optimize light mode

- Investigation: several metadata, code, reward, and animation colors were still tuned for the navy theme, and pale bugs/threads lacked definition on the light background.
- Implementation: added light-specific white surfaces, inkier text and metadata, darker blue/peach/lilac bug colors, darker silk and capture feedback, accessible focus color, and clearer hint borders. Kept the existing layout and motion. Switching theme during a drag also updates the moving bug's color. Updated [styles](../dist/styles.css), [script](../dist/app.js), and [README](../README.md).
- Verification: syntax and all seventeen regression checks passed. Browser visually inspected hero and Developers sections including a small section bug. Twelve computed text/background contrast samples ranged from 5.53:1 to 7.35:1. These spot checks do not establish a complete accessibility audit; device checks remain unverified.
- Outcome: completed locally; Git and deployment unchanged.
- Follow-up verification: restarted the stopped local preview, rechecked the current light palette in a fresh browser tab, and confirmed the darker bug/web and pale toggle colors are loaded. Repeated twelve text contrast samples: 5.53:1–7.35:1; syntax and all seventeen checks passed. Saved docs/light-mode-preview.png. Existing light-mode implementation and documentation were retained.


## 2026-10-27 — First bug crawls from beneath the CTA

- Objective: the introductory bug should visibly emerge from under Get started free rather than appear in open space.
- Investigation and change: moved its existing shelter into a layout-neutral wrapper around the original CTA. The clipped opening follows the button across screen sizes; the bug crawls out from below its right edge into the adjacent whitespace. Preserved the button link, layout, Ziki catch choices, and second-bug prompt. Updated [markup](../dist/index.html), [styles](../dist/styles.css), [animation-end handling](../dist/app.js), and [README](../README.md).
- Verification and outcome: syntax and all seventeen checks passed. Fresh-tab browser screenshot confirmed the first bug emerges at the lower-right edge of Get started free. The offscreen guard now allows a partly visible bug to be captured. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Replay on reload, independent section bugs

- Objective: replay the introduction on each reload and allow other section bugs even if the first hero bug is ignored.
- Investigation and implementation: removed session-storage suppression of the introduction and hint; each page load schedules the opening sequence. Section visibility timers were already independent and retain that behavior. Skipping the hero does not gate other sections; the shared busy flag only prevents overlapping catch animations. Reduced motion still shows a direct hint. Updated [script](../dist/app.js) and [README](../README.md).
- Verification: syntax and all nineteen checks passed, including old session flags not suppressing reload and section scheduling while the first bug remains uncaught. Browser verification in progress.
- Browser checkpoint and outcome: two consecutive reloads restored the first bug without repeat suppression. Skipped directly to Developers; confirmed a section bug appeared while the first hero bug remained uncaught. Saved the independent-section preview. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Repair the opening animation visibility check

- Cause: the CTA-anchored bug could fall below a short viewport, and browser scroll restoration could place the header above it. The one-shot guard silently abandoned the introduction.
- Fix: keep the first bug's exit closer to the CTA, retain a pending introduction when offscreen, and retry on scroll/resize/tab visibility without interrupting active catches. A visible bug can trigger the introduction even with the header just offscreen; Ziki enters from the top edge. The sequence starts only once per load; section bugs remain independent. Updated [script](../dist/app.js), [styles](../dist/styles.css), and [README](../README.md).
- Verification: syntax and all twenty-one checks passed, including offscreen retry, no duplicate replay, and a header above the viewport. Browser reproduced the restored-scroll failure, then confirmed firstCaught=true, secondRevealed=true, and awake=false after the repaired introduction.
- Outcome: fixed locally; Git and deployment unchanged. Phone/device verification remains outstanding.


## 2026-10-27 — Correct the hero bug roles

- Correction: user clarified that the bug emerging under Get started free is for the user to catch; the introductory automatic capture should use its original hero emergence.
- Change: moved the peach user-bug shelter beneath the CTA and returned the blue automatic bug to the original hero shelter. The script selects these roles explicitly rather than relying on DOM order; the hint belongs to the user bug. Kept reload replay, visibility retry, and independent section bugs. Updated [markup](../dist/index.html), [styles](../dist/styles.css), [script](../dist/app.js), and [README](../README.md).
- Verification: syntax and all twenty-one checks passed; browser visual verification in progress.
- Browser checkpoint and outcome: confirmed the automatic blue bug is caught, the peach user bug is beneath the CTA, and the hint is attached to that peach bug. Positioned its hint to the side to keep the CTA clear. Completed locally; Git and deployment unchanged.


## 2026-10-27 — Simple straight crawl from the button

- Request: keep the button bug's movement simple and focus on how it renders coming out.
- Change: replaced its diagonal movement and reveal mask with a straight horizontal crawl. The existing button covers the bug until it clears the edge; the bug faces right and retains leg stepping. No fade or special reveal. Updated [styles](../dist/styles.css) and [README](../README.md).
- Verification and outcome: all twenty-one checks passed. Browser confirmed button-crawl ends at a horizontal 72px translation, with no SVG animation or clipping mask. Saved the preview; completed locally with Git and deployment unchanged.


## 2026-10-27 — Prepare the first GitHub push

- Objective: push the prototype to the user-specified repository, https://github.com/sanmi21/ziki-whimsy-bugs.git, and outline the exact commands used.
- Investigation: destination HEAD listing succeeded with no refs, indicating an empty repository. The project has no own Git metadata and inherits the larger workspace's master branch with unrelated untracked projects. Create a separate repository in this project folder; preserve the parent workspace.
- Preparation: added [.gitignore](../.gitignore) for dependencies, environment secrets, and local logs. Updated [README](../README.md) with the repository URL and undeployed status. Asked the user for the exact initial branch name as required by their Git agreement; no branch created yet.

- Checkpoint — Repository setup: user approved `main`; initialized a standalone repository at this project root and added the requested GitHub origin. Rechecked remote HEAD with approved network access; still empty. Both syntax checks and all twenty-one regression checks passed during preparation. Added [push command record](push-commands.md). Initial commit and push next.

- Checkpoint — Initial publication: committed the prototype as `a97b1f79fb11b7fe2ce7f9b285c8d2b27bd4fd6c` and successfully pushed `main` to the requested origin. Remote `refs/heads/main` matched local HEAD and the working tree was clean. Removed one trailing-whitespace line found during the staged diff check before committing; no behavior changed.
- Outcome: prototype source published to GitHub on `main`; website deployment has not been performed. The final handoff documentation is being committed and pushed with the exact commands in [push-commands.md](push-commands.md). All twenty-one regression checks and both syntax checks passed during preparation.


## 2026-10-27 — Clean emergence and occasional longer catches

- Objective and starting point: preserve the existing homepage and crawling animations; remove the dark line at emergence and occasionally increase the mascot-to-bug distance.
- Checkpoint 1 — Investigation: the opaque background-colored pseudo-element at shelter edges became visible over the closing gradient, especially beside words. Local catches always chose a nearby edge.
- Checkpoint 2 — Implementation: disabled that generated strip in [styles](../dist/styles.css), keeping the clipped crawl and button occlusion. Added a 30% chance to select the farthest visible corner of the same card/section in [script](../dist/app.js), provided it adds over 60 pixels; both catch styles share this origin.
- Checkpoint 3 — Verification and docs: both JavaScript syntax checks and all 22 regression checks passed, including near/far origin selection and viewport bounds. Browser confirmed the closing heading visitor has no generated edge strip; saved [preview](clean-emergence-preview.png). Updated [README](../README.md) with the actual emergence and catch behavior.
- Outcome: completed locally for review. No commit, push, or deployment performed. Existing layout, timing, and crawl paths preserved.


## 2026-10-27 — Keep emerging visitors in view

- Objective and starting point: section visibility alone could select an offscreen heading/card and start a bug below the viewport. Preserve existing crawl paths, timing, and the previous uncommitted corrections.
- Checkpoint 1 — Investigation: section visitors are created by the dwell scheduler, then positioned at random shelters. Validate their clipped crawl area before revealing them; retry when no safe area is available.
- Checkpoint 2 — Implementation: filter offscreen headings/cards and measure the complete clipped crawl shelter before revealing a section visitor, with a 12-pixel viewport margin. Rejected visitors remain hidden, are removed, and retry after a short delay without resetting cooldowns. The button bug and invitation also wait for their shelter to fit onscreen; the automatic introduction now checks the target’s full bounds. Existing movements and layout are unchanged.
- Checkpoint 3 — Verification and docs: both syntax checks and all 25 regression checks passed. New checks cover viewport edges, hidden rejection/retry, and the button bug waiting for scroll. Corrected an incomplete test mock during verification. Browser measured the closing visitor shelter at x575–633/y230–435 inside an 848×662 viewport; saved [preview](viewport-emergence-preview.png). Updated [README](../README.md).
- Outcome: completed locally. Users may scroll an already-emerged bug out of view naturally; new visitors will not start offscreen. Previous uncommitted changes are preserved; no commit, push, or deployment performed.


## 2026-10-27 — Letter peek and web catch

- Objective and starting point: add a third mascot motion alongside swoop and web drag, without replacing existing behavior or changing the page layout.
- Checkpoint 1 — Investigation: catches share a fixed mascot overlay, scroll-tracked thread, and cleanup. Measure a visible heading letter with DOM Range; reuse web reeling and local return cleanup, with a rising reveal and directed glance before the thread fires.
- Checkpoint 2 — Implementation: added a third eligible manual-catch choice, measured visible heading letters without changing text markup, and added an upward clipped reveal, a directed pupil glance, web drag, and retreat behind the same letter. Retained both original motions, the original introduction, reduced-motion instant catches, and scroll tracking. Header stays untouched for letter catches. Updated [script](../dist/app.js) and [styles](../dist/styles.css).
- Checkpoint 3 — Verification and docs: syntax checks and all 27 regression tests passed, including random selection, the full letter sequence, and cleanup. Browser exercised both original styles. Temporarily selected the letter branch for visual inspection, captured [preview](letter-peek-preview.png), then restored random selection. Confirmed the local server serves the updated script. Updated [README](../README.md).
- Outcome: completed locally; no commit, push, or deployment. Suitable letters must fit onscreen above the target section; otherwise the two original catch styles remain available.


## 2026-10-27 — Publish animation refinements

- Objective: user authorized pushing all pending corrections to the existing `main` branch.
- Investigation and verification: confirmed the intended origin, preserved the existing branch, fetched `origin/main`, and found no divergence. Both syntax checks, all 27 regression checks, and the diff whitespace check passed. Reviewed the pending source changes; temporary visual-test selection is absent.
- Publication checkpoint: include clean emergence, occasional longer catches, viewport-gated visitors, the letter-peek catch, tests, README, work log, and three preview images in `Refine bug emergence and add letter-peek catches`. Commit and push are the remaining publication steps; their final result will be reported in chat. The command record is in [push-commands.md](push-commands.md).


## 2026-10-27 — Page-wide visits and recurring hero bugs

- Objective and starting point: fast scrolling reset section dwell timers, offscreen visitors blocked replacements, and the hero was excluded from recurrence. Preserve current motion, visible emergence, and sparse presentation.
- Checkpoint 1 — Investigation: replace section-ratio gating with current viewport geometry and a page-wide dwell clock; let missed offscreen visitors release their slot with a short relocation pause. Include the hero after the original user bug is caught, keeping the original introduction.
- Scope clarification: user confirmed the interaction must remain based on sections. Keep section-owned shelters and catches; only carry the wait across section changes and include the hero in recurrence. No free-floating viewport bugs or unrelated placements.
- Checkpoint 2 — Implementation: current viewport geometry selects the visible section without a 40% ratio gate. A shared dwell clock survives scrolling, with one recurring visitor and the normal 15-second cooldown. Fully offscreen missed visitors release their slot with a 2-second relocation pause; focused bugs and active catches remain protected. Hero recurrence starts after the original user bug is caught or its introduction was skipped by manual interaction. Updated [script](../dist/app.js).
- Checkpoint 3 — Verification and docs: both syntax checks, all 31 regression checks, and the whitespace check passed. New checks cover elapsed dwell across sections, hero recurrence, missed-visitor relocation, and a same-section edge fallback when a button is too low. Updated the event-listener mock to preserve multiple scroll listeners and adjusted timer expectations for the shared scheduler. Browser caught the original button bug, returned to the hero, and confirmed a new visitor owned by section `top`, with its shelter at y330–535 inside the viewport. Saved [preview](recurring-hero-preview.png); updated [README](../README.md).
- Outcome: completed locally. Sections still own all shelters and catches; only timing is shared. Existing artwork, crawl paths, and catch styles are preserved. No commit, push, or deployment performed for this revision.


## 2026-10-27 — Publish recurring section visits

- Objective: user authorized pushing the section-based timing and recurring hero changes on existing `main`.
- Verification: checked the branch, destination, pending files, and whitespace; both syntax checks and all 31 regression checks passed. Fetched `origin/main`; no divergence.
- Publication checkpoint: commit the implementation, tests, README, work log, command record, and recurring-hero preview as `Keep section bugs recurring while browsing`. Push and remote verification follow; final publication result is reported in chat.


## 2026-10-28 — Faster bug appearances

- Objective and starting point: users can scroll past the page before encountering recurring bugs. Existing shared timing waits 4 seconds initially, 15 seconds between visitors, and 2 seconds to relocate missed visitors. Preserve section-owned shelters, one recurring visitor, safe viewport placement, crawl motion, and catch styles.
- Checkpoint 1 — Investigation: appearance timing is centralized in `eggTiming`; additional scheduler retries can add another 1–2 seconds. Shorten the initial wait to 1 second, normal cooldown to 6 seconds, relocation pause to 400 ms, and scheduler retries to 250 ms. Keep the 12-second visitor lifetime and focus/catch protection.
- Checkpoint 2 — Implementation: changed only scheduler timing constants and retry delays in [script](../dist/app.js); updated [README](../README.md) with the new waits and safe-placement requirements. Section placement, crawl speed, original hero introduction, and all three mascot catch styles remain unchanged.
- Checkpoint 3 — Verification: both syntax checks, all 32 regression tests, and the whitespace check passed. Updated timing expectations and added exact start/cooldown boundary coverage. Existing tests still cover section transitions, hero recurrence, relocation, and viewport rejection. Browser timing was not remeasured for this constants-only revision.
- Outcome: completed locally; reload the preview to use the faster scheduler. No commit, push, or deployment performed.


## 2026-10-28 — Publish faster appearances

- Objective: user authorized committing and pushing the faster scheduler on existing `main`.
- Verification: confirmed the intended branch and remote, fetched `origin/main`, and found no divergence. Both syntax checks, all 32 regression tests, and the whitespace check passed.
- Publication checkpoint: commit timing changes, regression checks, README, work log, and command record as `Make bug encounters appear sooner`, then push and verify the remote hash. Final publication result is reported in chat.
