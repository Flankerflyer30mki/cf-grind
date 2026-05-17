/* ── app.js ──────────────────────────────────────── */
'use strict';

const App = (() => {

  /* ── App state ──────────────────────────────────── */
  let state = {
    handle:          '',
    allProblems:     [],   // raw problems from CF (unsolved only)
    filteredProblems:[],   // after active filters
    solvedSet:       new Set(),
    currentPage:     1,
  };

  /* ── Bootstrap ──────────────────────────────────── */
  function init() {
    Filters.renderTagList();

    // Restore handle from localStorage
    const saved = localStorage.getItem('cf_handle');
    if (saved) document.getElementById('handleInput').value = saved;

    // Allow Enter key to trigger fetch
    document.getElementById('handleInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') fetchData();
    });

    // Allow Enter key to trigger apply
    ['ratingMin','ratingMax','pageSize'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') applyFilters();
      });
    });
  }

  /* ── Fetch data from Codeforces ─────────────────── */
  async function fetchData() {
    const handle = document.getElementById('handleInput').value.trim();
    if (!handle) {
      Render.toast('Enter a Codeforces handle first', 'error');
      return;
    }

    // Persist handle
    state.handle = handle;
    localStorage.setItem('cf_handle', handle);

    // UI: loading state
    document.getElementById('fetchBtn').classList.add('loading');
    document.getElementById('fetchBtn').textContent = '...';
    Render.showLoading('Fetching your submissions…');

    try {
      // 1. Solved set
      state.solvedSet = await API.fetchSolvedSet(handle);

      Render.showLoading('Loading full problem set…');

      // 2. All CF problems
      const raw = await API.fetchAllProblems();

      // 3. Keep only unsolved, sort by rating asc
      state.allProblems = raw
        .filter(p => !state.solvedSet.has(`${p.contestId}_${p.index}`))
        .sort((a, b) => (a.rating || 0) - (b.rating || 0));

      Render.toast(`Loaded ${state.allProblems.length.toLocaleString()} unsolved problems`, 'success');
      applyFilters();

    } catch (err) {
      Render.showError(err.message || 'Unknown error. Check the handle or try again.');
      Render.toast(err.message || 'Fetch failed', 'error');
    } finally {
      document.getElementById('fetchBtn').classList.remove('loading');
      document.getElementById('fetchBtn').textContent = 'FETCH';
    }
  }

  /* ── Apply active filters and re-render ─────────── */
  function applyFilters() {
    if (state.allProblems.length === 0) {
      Render.toast('Fetch data first', 'error');
      return;
    }

    state.filteredProblems = Filters.applyTo(state.allProblems);
    state.currentPage      = 1;

    if (state.filteredProblems.length === 0) {
      Render.showEmpty();
      return;
    }

    _renderCurrentPage();
  }

  /* ── Navigate to a page ─────────────────────────── */
  function goPage(n) {
    const pageSize   = _getPageSize();
    const totalPages = Math.ceil(state.filteredProblems.length / pageSize);
    state.currentPage = Math.max(1, Math.min(n, totalPages));
    _renderCurrentPage();
  }

  /* ── Internal render ────────────────────────────── */
  function _renderCurrentPage() {
    Render.showPage({
      problems:  state.filteredProblems,
      solvedSet: state.solvedSet,
      handle:    state.handle,
      page:      state.currentPage,
      pageSize:  _getPageSize(),
    });
  }

  function _getPageSize() {
    return Math.max(1, parseInt(document.getElementById('pageSize').value) || CONFIG.DEFAULT_PAGE_SIZE);
  }

  /* ── Public API ─────────────────────────────────── */
  return { init, fetchData, applyFilters, goPage };
})();

// Kick off
document.addEventListener('DOMContentLoaded', App.init);
