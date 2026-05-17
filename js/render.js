/* ── render.js ───────────────────────────────────── */
'use strict';

const Render = (() => {

  /* ── Loading state ──────────────────────────────── */
  function showLoading(msg = 'Fetching…') {
    document.getElementById('mainContent').innerHTML = `
      <div class="center-msg">
        <div class="empty-icon">⟳</div>
        <h3>${CONFIG.esc(msg)}</h3>
        <div class="loading-bar">
          <div class="loading-bar-inner"></div>
        </div>
      </div>`;
  }

  /* ── Error state ────────────────────────────────── */
  function showError(msg) {
    document.getElementById('mainContent').innerHTML = `
      <div class="center-msg">
        <div class="empty-icon" style="color:var(--red)">✗</div>
        <h3>Something went wrong</h3>
        <p>${CONFIG.esc(msg)}</p>
      </div>`;
  }

  /* ── Empty filter result ────────────────────────── */
  function showEmpty() {
    document.getElementById('mainContent').innerHTML = `
      <div class="center-msg">
        <div class="empty-icon">🔍</div>
        <h3>No problems match</h3>
        <p>Try widening your rating range or removing some tag filters.</p>
      </div>`;
  }

  /* ── Main problem page ──────────────────────────── */
  function showPage({ problems, solvedSet, handle, page, pageSize }) {
    const totalPages = Math.ceil(problems.length / pageSize);
    const start      = (page - 1) * pageSize;
    const slice      = problems.slice(start, start + pageSize);

    const statsHtml = _buildStats(problems.length, handle, page, totalPages);
    const tableHtml = _buildTable(slice, solvedSet);
    const pageHtml  = _buildPagination(page, totalPages);

    document.getElementById('mainContent').innerHTML =
      statsHtml + tableHtml + pageHtml;

    // Bind pagination buttons
    document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        App.goPage(parseInt(btn.dataset.page));
      });
    });

    // Scroll main back to top
    document.getElementById('mainContent').scrollTop = 0;
  }

  /* ── Private helpers ────────────────────────────── */

  function _buildStats(total, handle, page, totalPages) {
    return `
      <div class="stats-row">
        <div class="stat-chip">Unsolved: <strong>${total.toLocaleString()}</strong></div>
        <div class="stat-chip">Page: <strong>${page} / ${totalPages}</strong></div>
        <div class="stat-chip">Handle: <strong>${CONFIG.esc(handle)}</strong></div>
      </div>`;
  }

  function _buildTable(slice, solvedSet) {
    const rows = slice.map(p => _buildRow(p, solvedSet)).join('');
    return `
      <div class="problem-grid">
        <div class="grid-header">
          <div>ID</div>
          <div>Problem</div>
          <div style="text-align:center">Rating</div>
          <div class="col-tags">Tags</div>
        </div>
        ${rows}
      </div>`;
  }

  function _buildRow(p, solvedSet) {
    const key      = `${p.contestId}_${p.index}`;
    const isSolved = solvedSet.has(key);
    const rClass   = CONFIG.ratingClass(p.rating);
    const rating   = p.rating || '—';
    const url      = `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;

    const tagsHtml = (p.tags || [])
      .slice(0, 3)
      .map(t => `<span class="mini-tag">${CONFIG.esc(t)}</span>`)
      .join('');

    return `
      <a class="problem-row ${isSolved ? 'solved' : ''}"
         href="${url}" target="_blank" rel="noopener noreferrer">
        ${isSolved ? '<div class="solved-bar"></div>' : ''}
        <div class="prob-id">${p.contestId}${p.index}</div>
        <div class="prob-name">${CONFIG.esc(p.name)}</div>
        <div class="prob-rating ${rClass}">${rating}</div>
        <div class="prob-tags">${tagsHtml}</div>
      </a>`;
  }

  function _buildPagination(cur, total) {
    if (total <= 1) return '';

    const pages = _pageNumbers(cur, total);
    const prevDisabled = cur === 1    ? 'disabled' : '';
    const nextDisabled = cur === total ? 'disabled' : '';

    const btns = pages.map(p => {
      if (p === '…') return `<button class="page-btn ellipsis">…</button>`;
      return `<button class="page-btn ${p === cur ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }).join('');

    return `
      <div class="pagination">
        <button class="page-btn" data-page="${cur - 1}" ${prevDisabled}>‹</button>
        ${btns}
        <button class="page-btn" data-page="${cur + 1}" ${nextDisabled}>›</button>
      </div>`;
  }

  function _pageNumbers(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];
    if (cur > 3)          pages.push('…');
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2)  pages.push('…');
    pages.push(total);
    return pages;
  }

  /* ── Toast notification ─────────────────────────── */
  let _toastTimer;
  function toast(msg, type = '') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className   = `toast show ${type}`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
  }

  /* ── Public API ─────────────────────────────────── */
  return { showLoading, showError, showEmpty, showPage, toast };
})();
