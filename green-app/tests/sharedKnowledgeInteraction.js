/* Inject after the actual React page in the self-contained HTML preview.
 * The preview entry supplies ReactDOM.flushSync as window.__skFlush.
 * Exercises the DOM controls rather than calling the model directly. */
(() => {
  let checks = 0;
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
    checks++;
  };
  const button = (text) => [...document.querySelectorAll('button')].find(b => b.textContent.includes(text));
  const click = (text) => {
    const el = button(text);
    if (!el || el.disabled) throw new Error('Unavailable control: ' + text);
    window.__skFlush(() => el.click());
  };
  const stage = (number) => window.__skFlush(() => document.querySelector('#sk-tab-' + number).click());
  const baselines = () => [...document.querySelectorAll('.sk-svg polygon')].map(p => p.getAttribute('points')).join('|');
  try {
    const starting = baselines();
    assert(starting.length > 0, 'Initial maps are present');
    stage(4);
    assert(button('Prepare a provisional note').disabled, 'Cannot skip straight to contribution');
    stage(1);
    assert(document.querySelectorAll('.sk-fieldset').length === 0, 'Withheld context is absent from reconstruction options');
    click('Maya: Share workshop note');
    click('Maya explains context to Leo');
    click('Participants dislike mobile layouts');
    assert(document.querySelector('.sk-feedback--warn'), 'Misinterpretation gets corrective feedback');
    click('Some learners use a shared phone');
    click('Leo: Share website note');
    click('Leo explains context to Maya');
    click('The counter fires on a page visit');
    assert(baselines() === starting, 'Checking specific notes preserves starting competence maps');
    assert(![...document.querySelectorAll('.sk-topic-meta')].some(el => /checked/.test(el.textContent)), 'Specific checks do not certify entire topics');
    stage(2);
    click('Align on this joint question');
    stage(3);
    click('Mixed comparison');
    stage(4);
    click('Examine source, scope');
    click('Prepare a provisional note');
    assert(document.querySelector('.sk-contribution-card')?.textContent.includes('some participants complete an exercise step'), 'Mixed evidence produces a qualified contribution');
    stage(3);
    click('Flexible downloadable practice');
    assert(!document.querySelector('.sk-result-card'), 'Changing hypothesis clears previous evidence');
    click('Contradicting comparison');
    stage(4);
    click('Examine source, scope');
    click('Prepare a provisional note');
    assert(document.querySelector('.sk-contribution-card')?.textContent.includes('does not support'), 'Contradicting evidence can be contributed');
    stage(1);
    click('Leo: Withdraw website note');
    assert(document.querySelectorAll('.sk-fieldset').length === 1, 'Withdrawal removes dependent reconstruction options');
    stage(4);
    assert(!document.querySelector('.sk-contribution-card') && button('Prepare a provisional note').disabled, 'Withdrawal invalidates dependent contribution');
    click('Overlay view');
    click('Measurement');
    click('Reset all');
    assert(document.querySelector('#sk-tab-0').getAttribute('aria-selected') === 'true', 'Reset restores compare stage');
    assert(button('Separate maps').getAttribute('aria-pressed') === 'true' && document.querySelectorAll('.sk-svg').length === 2, 'Reset restores separate maps');
    assert(document.querySelector('.sk-topic-btn[aria-pressed="true"]').textContent.includes('Access'), 'Reset restores topic selection');
    assert(baselines() === starting, 'Reset restores baseline geometry');
    assert(document.documentElement.scrollWidth <= window.innerWidth + 1, 'No horizontal page overflow');
    console.log('Shared knowledge interaction checks: ' + checks + ' passed.');
  } catch (error) { console.error('Shared knowledge interaction check FAILED:', error.message); }
})();
