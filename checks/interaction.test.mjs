import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../dist/app.js', import.meta.url), 'utf8');
function setup(reduced = true, storage = new Map(), randomValue = .75) {
  const animations = [];
  const frames = [];
  const scrollState = { x: 0, y: 0 };
  const pendingTimers = [];
  function element() {
    const classes = new Set();
    return {
      append(child) { this.child = child; },
      dataset: {}, style: {}, handlers: {}, attrs: {}, disabled: false, textContent: '',
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle: name => { if (classes.has(name)) { classes.delete(name); return false; } classes.add(name); return true; }
      },
      addEventListener(name, handler) { this.handlers[name] = handler; },
      setAttribute(name, value) { this.attrs[name] = value; },
      getBoundingClientRect: () => ({ left: 100, top: 200, width: 40, height: 40 }),
      focus() { document.activeElement = this; },
      animate(keyframes, options) {
        let resolve;
        const animation = { owner: this, keyframes, options, finished: new Promise(done => { resolve = done; }), cancel() {}, finish() { resolve(); } };
        animations.push(animation);
        return animation;
      }
    };
  }
  const bugs = [element(), element(), element()];
  const nodes = Object.fromEntries(['#web-prey', '#home-eyes', '#silk-thread', '#silk-path', '#bug-hint', '#mascot', '.nav .brand img', '#status', '#puff', '#theme', '.primary', 'meta[name="theme-color"]'].map(key => [key, element()]));
  const document = { querySelector: key => nodes[key], querySelectorAll: selector => selector === '.bug' ? bugs : [], documentElement: element(), body: element() };
  document.activeElement = document.body;
  const preferences = { matches: reduced, addEventListener(name, handler) { this.handler = handler; } };
  const handlers = {};
  const testApi = runInNewContext(source + ';({chooseSection, viewportSectionArea, chooseCatchStyle, findLetterCatchOrigin, showTurnHint, isVisibleCrawlArea, chooseLocalCatchOrigin, scheduleVisitor, setReadingSection: section => { visibleSection = section; visibleSince = Date.now() - 5000; }, sectionEggDelay, retireVisitor, setVisitor: value => { activeVisitor = value; }})', {
    Math: Object.assign(Object.create(Math), { random: () => randomValue }),
    getComputedStyle: () => ({ color: '#8cc3ff' }),
    requestAnimationFrame: callback => { frames.push(callback); return frames.length; },
    get scrollX() { return scrollState.x; }, get scrollY() { return scrollState.y; }, cancelAnimationFrame() {},
    NodeFilter: {SHOW_TEXT:4}, document, matchMedia: () => preferences, innerWidth: 390, innerHeight: 800,
    setTimeout: (callback, delay) => { callback.delay = delay; pendingTimers.push(callback); return pendingTimers.length; }, clearTimeout() {},
    addEventListener: (name, handler) => { const previous=handlers[name]; handlers[name] = previous ? (...args) => {previous(...args);handler(...args);} : handler; }, console,
    sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }
  });
  return { frames, scrollState, bugs, nodes, document, animations, preferences, handlers, pendingTimers, sectionDelay: testApi.sectionEggDelay, lifecycle: testApi };
}

test('reduced motion catches without animation or points and prevents duplicate catches', async () => {
  const state = setup();
  await state.bugs[0].handlers.click({ detail: 0 });
  assert.equal(state.animations.length, 0);
  assert.equal(state.bugs[0].classList.contains('caught'), true);
  assert.equal(state.nodes['#status'].textContent, 'Nice catch!');
  assert.equal(state.bugs[1].disabled, false);
  await state.bugs[0].handlers.click({ detail: 0 });
  assert.equal(state.nodes['#status'].textContent, 'Nice catch!');
  state.pendingTimers.at(-1)();
  assert.equal(state.nodes['#status'].classList.contains('visible'), false);
});

test('concurrent clicks do not start two chases; mascot and controls recover', async () => {
  const state = setup(false);
  const catchPromise = state.bugs[0].handlers.click({ detail: 1 });
  await state.bugs[1].handlers.click({ detail: 1 });
  assert.equal(state.animations.length, 1);
  assert.equal(state.nodes['#mascot'].classList.contains('awake'), true);
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'), true);
  assert.equal(state.nodes['#silk-thread'].classList.contains('visible'), true);
  state.animations[0].finish();
  await new Promise(setImmediate);
  assert.equal(state.bugs[0].classList.contains('caught'), true);
  assert.equal(state.animations.length, 2);
  assert.equal(state.nodes['#web-prey'].classList.contains('visible'), true);
  state.animations[1].finish();
  await new Promise(setImmediate);
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'), false);
  assert.equal(state.nodes['#home-eyes'].classList.contains('awake'), true);
  state.animations[2].finish();
  await catchPromise;
  assert.equal(state.nodes['#web-prey'].classList.contains('visible'), false);
  assert.equal(state.nodes['#home-eyes'].classList.contains('awake'), false);
  assert.equal(state.nodes['#mascot'].classList.contains('visible'), false);
  assert.equal(state.nodes['#mascot'].classList.contains('awake'), false);
  assert.equal(state.nodes['#silk-thread'].classList.contains('visible'), false);
  assert.equal(state.bugs[1].disabled, false);
});

test('original theme control toggles light and dark labels', () => {
  const state = setup();
  const control = state.nodes['#theme'];
  control.handlers.click();
  assert.equal(control.attrs['aria-label'], 'Switch to dark mode');
  assert.equal(state.document.documentElement.classList.contains('light'), true);
  control.handlers.click();
  assert.equal(control.attrs['aria-label'], 'Switch to light mode');
});

test('discovery hint dismisses after a catch and returns on reload', async () => {
  const storage = new Map();
  const state = setup(true, storage);
  assert.equal(state.document.documentElement.classList.contains('introducing-bugs'), true);
  await state.bugs[0].handlers.click({ detail: 0 });
  assert.equal(state.document.documentElement.classList.contains('introducing-bugs'), false);
  assert.equal(setup(true, storage).document.documentElement.classList.contains('introducing-bugs'), true);
});

test('Escape hides cues and focus on another bug makes its tooltip available', () => {
  const state = setup();
  state.handlers.keydown({ key: 'Escape' });
  assert.equal(state.document.documentElement.classList.contains('introducing-bugs'), false);
  assert.equal(state.document.documentElement.classList.contains('hide-bug-tooltips'), true);
  state.bugs[1].handlers.focus();
  assert.equal(state.document.documentElement.classList.contains('hide-bug-tooltips'), false);
});

test('automatic introduction catches only one bug, then prompts beside a survivor', async () => {
  const storage = new Map();
  const state = setup(false, storage);
  const introduction = state.pendingTimers[0]();
  assert.equal(state.animations.length, 1);
  state.animations[0].finish();
  await new Promise(setImmediate);
  state.animations[1].finish();
  await new Promise(setImmediate);
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'), false);
  assert.equal(state.nodes['#home-eyes'].classList.contains('awake'), true);
  state.animations[2].finish();
  await introduction;
  assert.equal(state.bugs.filter(bug => bug.classList.contains('caught')).length, 1);
  assert.equal(state.bugs[1].child, state.nodes['#bug-hint']);
  assert.equal(state.nodes['#status'].classList.contains('visible'), false);
  assert.equal(state.nodes['#bug-hint'].textContent, 'Your turn. Click or tap a bug to squash it.');
  assert.equal(state.document.activeElement, state.document.body);
  assert.equal(setup(false, storage).pendingTimers.length, 2);
});

test('reduced motion shows the prompt without an automatic catch', () => {
  const state = setup(true);
  assert.equal(state.animations.length, 0);
  assert.equal(state.bugs.some(bug => bug.classList.contains('caught')), false);
  assert.equal(state.nodes['#bug-hint'].textContent, 'Your turn. Click or tap a bug to squash it.');
});

test('manual catching before the introduction prevents a second automatic chase', async () => {
  const state = setup(false);
  const introTimer = state.pendingTimers[0];
  const manual = state.bugs[1].handlers.click({ detail: 1 });
  await introTimer();
  assert.equal(state.animations.length, 1);
  state.animations[0].finish();
  await new Promise(setImmediate);
  state.animations[1].finish();
  await new Promise(setImmediate);
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'), false);
  assert.equal(state.nodes['#home-eyes'].classList.contains('awake'), true);
  state.animations[2].finish();
  await manual;
  assert.equal(state.bugs[0].classList.contains('caught'), false);
  assert.equal(state.document.documentElement.classList.contains('introducing-bugs'), false);
});


test('page-wide visitors require initial dwell and the shared cooldown', () => {
  const { sectionDelay } = setup();
  assert.equal(sectionDelay(100000, 100000, -Infinity), 1000);
  assert.equal(sectionDelay(120000, 100000, -Infinity), 0);
  assert.equal(sectionDelay(120000, 100000, 118000), 4000);
  assert.equal(sectionDelay(120000, 100000, 118000), 4000);
  assert.equal(sectionDelay(240000, 220000, 110000), 0);
});


test('ignored visitor retreats before removal; repeated retirement does not restart it', () => {
  const state = setup(false);
  const bug = state.nodes['#mascot'];
  let removed = false;
  state.lifecycle.setVisitor({ bug, nook: { remove() { removed = true; } }, section: {} });
  state.lifecycle.retireVisitor();
  assert.equal(removed, false);
  assert.equal(bug.classList.contains('retreating'), true);
  const timers = state.pendingTimers.length;
  state.lifecycle.retireVisitor();
  assert.equal(state.pendingTimers.length, timers);
  state.pendingTimers.at(-1)();
  assert.equal(removed, true);
});

test('caught visitor is removed directly without a retreat animation', () => {
  const state = setup(false);
  const bug = state.nodes['#mascot'];
  bug.classList.add('caught');
  let removed = false;
  state.lifecycle.setVisitor({ bug, nook: { remove() { removed = true; } }, section: {} });
  state.lifecycle.retireVisitor();
  assert.equal(removed, true);
  assert.equal(bug.classList.contains('retreating'), false);
});


test('scrolling adjusts the active path without finishing the catch', async () => {
  const state = setup(false);
  const catching = state.bugs[0].handlers.click({ detail: 1 });
  state.scrollState.y = 120;
  state.scrollState.x = 10;
  state.frames.at(-1)();
  assert.equal(state.nodes['#mascot'].style.top, '100px');
  assert.equal(state.nodes['#mascot'].style.left, '110px');
  assert.equal(state.bugs[0].classList.contains('caught'), false);
  state.handlers.scroll();
  assert.equal(state.bugs[0].classList.contains('caught'), false);
  state.animations[0].finish();
  await new Promise(setImmediate);
  assert.equal(state.nodes['#puff'].style.top, '220px');
  state.animations[1].finish();
  await new Promise(setImmediate);
  state.animations[2].finish();
  await catching;
  assert.equal(state.nodes['#mascot'].classList.contains('visible'), false);
});


test('section catches originate locally and leave the header logo in place', async () => {
  const state = setup(false);
  const bug = state.bugs[0];
  bug.dataset.sectionEgg = 'true';
  const card = { getBoundingClientRect: () => ({ left: 300, top: 400, right: 600, bottom: 700, width: 300, height: 300 }) };
  const section = { querySelector: () => card };
  let retired = false;
  state.lifecycle.setVisitor({ bug, section, nook: { remove() { retired = true; } } });
  const catching = bug.handlers.click({ detail: 1 });
  assert.equal(state.nodes['#mascot'].style.top, '404px');
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'), false);
  state.animations[0].finish();
  await new Promise(setImmediate);
  state.animations[1].finish();
  await new Promise(setImmediate);
  assert.equal(state.nodes['#home-eyes'].classList.contains('awake'), false);
  state.animations[2].finish();
  await catching;
  assert.equal(retired, true);
  assert.equal(state.nodes['#mascot'].classList.contains('visible'), false);
});


test('swoop selection moves Ziki out and back without a dragged bug', async () => {
  const state = setup(false, new Map(), .1);
  const catching = state.bugs[0].handlers.click({ detail: 1 });
  assert.equal(state.nodes['#mascot'].dataset.catchStyle, 'swoop');
  assert.equal(state.animations[0].options.duration, 1050);
  assert.equal(state.nodes['#silk-thread'].classList.contains('shooting'), false);
  state.animations[0].finish();
  await new Promise(setImmediate);
  assert.equal(state.animations[1].owner, state.nodes['#mascot']);
  assert.equal(state.nodes['#web-prey'].classList.contains('visible'), false);
  state.animations[1].finish();
  await new Promise(setImmediate);
  state.animations[2].finish();
  await catching;
  assert.equal(state.nodes['#mascot'].classList.contains('visible'), false);
});

test('web selection reels the bug while Ziki stays at its origin', async () => {
  const state = setup(false, new Map(), .9);
  const catching = state.bugs[0].handlers.click({ detail: 1 });
  assert.equal(state.nodes['#mascot'].dataset.catchStyle, 'web');
  assert.equal(state.nodes['#silk-thread'].classList.contains('shooting'), true);
  state.animations[0].finish();
  await new Promise(setImmediate);
  assert.equal(state.animations[1].owner, state.nodes['#web-prey']);
  state.animations[1].finish();
  await new Promise(setImmediate);
  state.animations[2].finish();
  await catching;
  assert.equal(state.nodes['#web-prey'].classList.contains('visible'), false);
});


test('pointer press catches immediately without waiting for a click or crawl completion', () => {
  const state = setup(true);
  const bug = state.bugs[0];
  bug.classList.add('is-crawling');
  let prevented = false;
  bug.handlers.pointerdown({ button: 0, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(bug.classList.contains('caught'), true);
  const other = state.bugs[1];
  other.handlers.pointerdown({ button: 2, preventDefault() { throw Error('right click should be ignored'); } });
  assert.equal(other.classList.contains('caught'), false);
});

test('a retreating visitor can be caught before its removal timer', async () => {
  const state = setup(true);
  const bug = state.bugs[0];
  bug.dataset.sectionEgg = 'true';
  bug.classList.add('retreating');
  let removed = false;
  const section = { querySelector: () => null, getBoundingClientRect: () => ({left:0,top:0,right:300,bottom:500,width:300,height:500}) };
  state.lifecycle.setVisitor({bug, section, retreating:true,nook:{remove(){removed=true;}}});
  await bug.handlers.click({detail:1});
  assert.equal(bug.classList.contains('caught'),true);
  assert.equal(removed,true);
});


test('old session flags do not suppress the introduction on reload', () => {
  const storage = new Map([['ziki-bug-intro-shown','true'],['ziki-bugs-discovered','true']]);
  assert.equal(setup(false,storage).pendingTimers.length,2);
  assert.equal(setup(false,storage).pendingTimers.length,2);
});

test('section appearances are scheduled even when the first bug is ignored', () => {
  const state = setup(false);
  assert.equal(state.bugs[0].classList.contains('caught'),false);
  const before = state.pendingTimers.length;
  state.lifecycle.setReadingSection({});
  state.lifecycle.scheduleVisitor();
  assert.equal(state.pendingTimers.length,before+1);
  assert.equal(state.bugs[0].classList.contains('caught'),false);
});


test('offscreen introduction retries once the bug becomes visible', async () => {
  const state = setup(false);
  const bug = state.bugs[0];
  bug.getBoundingClientRect = () => ({left:100,top:900,width:40,height:40});
  await state.pendingTimers[0]();
  assert.equal(state.animations.length,0);
  bug.getBoundingClientRect = () => ({left:100,top:200,width:40,height:40});
  state.handlers.scroll();
  const introduction = state.pendingTimers.at(-1)();
  assert.equal(state.animations.length,1);
  state.animations[0].finish();
  await new Promise(setImmediate);
  state.animations[1].finish();
  await new Promise(setImmediate);
  state.animations[2].finish();
  await introduction;
  assert.equal(bug.classList.contains('caught'),true);
  const timers = state.pendingTimers.length;
  state.handlers.scroll();
  assert.equal(state.pendingTimers.length,timers);
});


test('visible intro still runs when reload restores the header above the viewport', async () => {
  const state = setup(false);
  state.nodes['.nav .brand img'].getBoundingClientRect = () => ({left:30,top:-100,width:35,height:35});
  const intro = state.pendingTimers[0]();
  assert.equal(state.animations.length,1);
  assert.equal(state.nodes['#mascot'].style.top,'-24px');
  state.animations[0].finish();
  await new Promise(setImmediate);
  state.animations[1].finish();
  await new Promise(setImmediate);
  state.animations[2].finish();
  await intro;
  assert.equal(state.bugs[0].classList.contains('caught'),true);
});


test('occasional distant catches use a farther visible card edge', () => {
  const {chooseLocalCatchOrigin} = setup().lifecycle;
  const bounds={left:300,right:750,top:100,bottom:500};
  const target={x:350,y:450};
  const near=chooseLocalCatchOrigin(bounds,target,900,700,()=>.9);
  const far=chooseLocalCatchOrigin(bounds,target,900,700,()=>.1);
  const distance=p=>Math.hypot(p.x-target.x,p.y-target.y);
  assert.ok(distance(far)>distance(near)+60);
  assert.ok(far.x>=24&&far.x<=876&&far.y>=20&&far.y<=680);
});

test('emergence requires the whole crawl area inside the viewport', () => {
  const {isVisibleCrawlArea} = setup().lifecycle;
  const rect = {left:24, top:300, right:366, bottom:505, width:342, height:205};
  assert.equal(isVisibleCrawlArea(rect,390,800), true);
  assert.equal(isVisibleCrawlArea({...rect,top:650,bottom:855},390,800), false);
  assert.equal(isVisibleCrawlArea({...rect,top:-20},390,800), false);
  assert.equal(isVisibleCrawlArea({...rect,right:410},390,800), false);
  assert.equal(isVisibleCrawlArea({...rect,left:-10},390,800), false);
  assert.equal(isVisibleCrawlArea({...rect,width:0},390,800), false);
});

test('scheduler discards an offscreen shelter before registering a bug and retries', () => {
  const state = setup();
  let removed = false;
  const created = [];
  state.document.createElement = () => {
    const classes = new Set();
    const node = {style:{setProperty() {}}, dataset:{},
      classList:{add:name=>classes.add(name), remove:name=>classes.delete(name), contains:name=>classes.has(name)},
      append() {}, addEventListener() {}, setAttribute() {},
      getBoundingClientRect:()=>({left:24,top:750,right:366,bottom:955,width:342,height:205}),
      remove() {removed=true;} };
    created.push(node);
    return node;
  };
  const section = {querySelectorAll:()=>[], append() {},
    getBoundingClientRect:()=>({left:24,top:750,right:366,bottom:1200,width:342,height:450})};
  state.lifecycle.setReadingSection(section);
  state.lifecycle.scheduleVisitor();
  state.pendingTimers.at(-1)();
  assert.equal(removed,true);
  assert.equal(created[0].style.visibility,'hidden');
  assert.equal(state.bugs.length,3);
  // The retry schedules a fresh attempt instead of leaving an active visitor.
  const count=state.pendingTimers.length;
  state.pendingTimers.at(-1)();
  assert.equal(state.pendingTimers.length,count+1);
});

test('button bug waits for its shelter to enter the viewport before starting its crawl', () => {
  const state = setup();
  let top=780;
  state.nodes['.primary-shelter > .hero-nook-b'] = {
    getBoundingClientRect:()=>({left:100,right:235,top,bottom:top+100,width:135,height:100})
  };
  state.document.documentElement.classList.remove('hero-user-turn');
  state.lifecycle.showTurnHint();
  assert.equal(state.document.documentElement.classList.contains('hero-user-turn'),false);
  top=500;
  state.handlers.scroll();
  assert.equal(state.document.documentElement.classList.contains('hero-user-turn'),true);
});

test('three catch styles are available only when a visible letter is available', () => {
  const {chooseCatchStyle} = setup().lifecycle;
  assert.equal(chooseCatchStyle(()=>.1,true),'swoop');
  assert.equal(chooseCatchStyle(()=>.5,true),'web');
  assert.equal(chooseCatchStyle(()=>.9,true),'letter');
  assert.equal(chooseCatchStyle(()=>.9,false),'web');
});

test('letter catch rises, looks, reels the bug and retreats without moving the header', async () => {
  const state=setup(false,new Map(),.9);
  const text={textContent:'Ziki'};
  const heading={};
  const section={querySelectorAll:()=>[heading]};
  state.bugs[0].closest=()=>section;
  state.document.createTreeWalker=()=>{let read=false;return {nextNode:()=>read?null:(read=true,text)};};
  state.document.createRange=()=>({setStart(){},setEnd(){},
    getBoundingClientRect:()=>({left:240,top:150,right:260,bottom:180,width:20,height:30})});
  const catching=state.bugs[0].handlers.click({detail:1});
  assert.equal(state.nodes['#mascot'].dataset.catchStyle,'letter');
  assert.equal(state.nodes['#mascot'].style.left,'250px');
  assert.equal(state.nodes['#mascot'].style.top,'129px');
  assert.equal(state.animations[0].options.duration,480);
  assert.equal(state.nodes['.nav .brand img'].classList.contains('away'),false);
  assert.equal(state.nodes['#silk-thread'].classList.contains('visible'),false);
  state.animations[0].finish(); await new Promise(setImmediate);
  assert.equal(state.animations[1].options.duration,320);
  assert.equal(state.bugs[0].classList.contains('caught'),false);
  state.animations[1].finish(); await new Promise(setImmediate);
  assert.equal(state.animations[2].owner,state.nodes['#web-prey']);
  assert.equal(state.nodes['#silk-thread'].classList.contains('visible'),true);
  state.animations[2].finish(); await new Promise(setImmediate);
  assert.equal(state.animations[3].keyframes[1].clipPath,'inset(0 0 100% 0)');
  state.animations[3].finish(); await catching;
  assert.equal(state.nodes['#mascot'].classList.contains('visible'),false);
  assert.equal(state.bugs[1].disabled,false);
});

test('moving between visible areas keeps elapsed page dwell and permits a partial section', () => {
  const state=setup(false);
  const first={};
  const next={classList:{contains:()=>false},getBoundingClientRect:()=>({left:0,top:-600,right:390,bottom:1500})};
  state.lifecycle.setReadingSection(first);
  state.document.querySelectorAll=selector=>selector==='main > section'?[next]:[];
  state.lifecycle.chooseSection();
  assert.equal(state.pendingTimers.at(-1).delay,100);
});

test('hero re-enters recurring visits after the original button bug is caught', () => {
  const state=setup(false);
  const hero={classList:{contains:name=>name==='hero'},getBoundingClientRect:()=>({left:0,top:80,right:390,bottom:700})};
  state.document.querySelectorAll=selector=>selector==='main > section'?[hero]:[];
  state.document.documentElement.classList.add('hero-user-turn');
  state.lifecycle.setReadingSection({});
  state.lifecycle.chooseSection();
  assert.equal(state.pendingTimers.at(-1).delay,250);
  state.bugs[1].classList.add('caught');
  state.lifecycle.chooseSection();
  assert.equal(state.pendingTimers.at(-1).delay,100);
});

test('a missed offscreen visitor releases its slot with a 400-millisecond relocation pause', () => {
  const state=setup(false);
  const bug=state.bugs[0];
  bug.getBoundingClientRect=()=>({left:20,top:-80,right:60,bottom:-40});
  let removed=false;
  const next={classList:{contains:()=>false},getBoundingClientRect:()=>({left:0,top:0,right:390,bottom:800})};
  state.document.querySelectorAll=selector=>selector==='main > section'?[next]:[];
  state.lifecycle.setReadingSection({});
  state.lifecycle.setVisitor({bug,section:{},nook:{remove(){removed=true;}}});
  state.lifecycle.chooseSection();
  assert.equal(removed,true);
  assert.ok(state.pendingTimers.at(-1).delay>=300 && state.pendingTimers.at(-1).delay<=400);
});

test('a low button shelter falls back to an onscreen edge in the same section', () => {
  const state=setup();
  const created=[];
  state.document.createElement=()=>{
    const classes=new Set();
    const node={style:{setProperty(){}},dataset:{},
      classList:{add:(...names)=>names.forEach(n=>classes.add(n)),remove:(...names)=>names.forEach(n=>classes.delete(n)),contains:n=>classes.has(n)},
      append(){},addEventListener(){},setAttribute(){},remove(){assert.fail('visible fallback should remain');},
      getBoundingClientRect(){const top=this.style.top==='3px'?40:780;return {left:24,right:366,top,bottom:top+90,width:342,height:90};}};
    created.push(node);return node;
  };
  const section={querySelectorAll:()=>[],append(){},getBoundingClientRect:()=>({left:24,top:40,right:366,bottom:900,width:342,height:860})};
  state.lifecycle.setReadingSection(section);state.lifecycle.scheduleVisitor();
  state.pendingTimers.at(-1)();
  assert.equal(created[0].style.visibility,'');
  assert.equal(created[0].style.top,'3px');
  assert.equal(state.pendingTimers.at(-1).delay,12000);
});

test('faster scheduling respects the one-second start and six-second cooldown boundaries', () => {
  const {sectionDelay}=setup();
  assert.equal(sectionDelay(100999,100000,-Infinity),1);
  assert.equal(sectionDelay(101000,100000,-Infinity),0);
  assert.equal(sectionDelay(105999,90000,100000),1);
  assert.equal(sectionDelay(106000,90000,100000),0);
});
