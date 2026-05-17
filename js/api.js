/* ── api.js ──────────────────────────────────────── */
'use strict';

const API = (() => {

  /**
   * Fetch all accepted submission problem keys for a handle.
   * Returns a Set of strings like "1234_A".
   */
  async function fetchSolvedSet(handle) {
    const url = `${CONFIG.CF_API}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=${CONFIG.MAX_SUBMISSIONS}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Network error ${res.status}`);

    const data = await res.json();
    if (data.status !== 'OK') throw new Error(data.comment || 'user.status API failed');

    const solved = new Set();
    for (const sub of data.result) {
      if (sub.verdict === 'OK' && sub.problem?.contestId && sub.problem?.index) {
        solved.add(`${sub.problem.contestId}_${sub.problem.index}`);
      }
    }
    return solved;
  }

  /**
   * Fetch the full Codeforces problemset.
   * Returns an array of problem objects.
   */
  async function fetchAllProblems() {
    const url  = `${CONFIG.CF_API}/problemset.problems`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Network error ${res.status}`);

    const data = await res.json();
    if (data.status !== 'OK') throw new Error('problemset.problems API failed');

    return data.result.problems.filter(p => p.contestId && p.index && p.name);
  }

  return { fetchSolvedSet, fetchAllProblems };
})();
