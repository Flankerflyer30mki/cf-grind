/* ── config.js ───────────────────────────────────── */
'use strict';

const CONFIG = {
  CF_API:           'https://codeforces.com/api',
  MAX_SUBMISSIONS:  10000,
  DEFAULT_PAGE_SIZE: 20,

  CF_TAGS: [
    '2-sat', 'binary search', 'bitmasks', 'brute force',
    'chinese remainder theorem', 'combinatorics', 'constructive algorithms',
    'data structures', 'dfs and similar', 'divide and conquer', 'dp', 'dsu',
    'expression parsing', 'fft', 'flows', 'games', 'geometry',
    'graph matchings', 'graphs', 'greedy', 'hashing', 'implementation',
    'interactive', 'math', 'matrices', 'meet-in-the-middle', 'number theory',
    'probabilities', 'schedules', 'shortest paths', 'sortings',
    'string suffix structures', 'strings', 'ternary search', 'trees',
    'two pointers'
  ],

  /** Map a CF rating to a CSS class */
  ratingClass(r) {
    if (!r)      return 'r-none';
    if (r < 1200) return 'r-grey';
    if (r < 1400) return 'r-green';
    if (r < 1600) return 'r-cyan';
    if (r < 1900) return 'r-blue';
    if (r < 2100) return 'r-violet';
    if (r < 2400) return 'r-orange';
    return 'r-red';
  },

  /** Safe HTML escape */
  esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};
