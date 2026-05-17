/* ── filters.js ──────────────────────────────────── */
'use strict';

const Filters = (() => {

  /* ── State ─────────────────────────────────────── */
  let tagMode    = 'include';           // 'include' | 'exclude'
  let tagFilters = {};                  // { tagName: 'include' | 'exclude' }

  /* ── Tag mode ───────────────────────────────────── */
  function setTagMode(mode) {
    tagMode = mode;
    const incBtn = document.getElementById('includeBtn');
    const excBtn = document.getElementById('excludeBtn');
    incBtn.className = 'tag-mode-btn' + (mode === 'include' ? ' active-include' : '');
    excBtn.className = 'tag-mode-btn' + (mode === 'exclude' ? ' active-exclude' : '');
  }

  /* ── Render tag chip list ───────────────────────── */
  function renderTagList() {
    const q    = (document.getElementById('tagSearch').value || '').toLowerCase();
    const list = document.getElementById('tagsList');
    list.innerHTML = '';

    CONFIG.CF_TAGS
      .filter(t => t.includes(q))
      .forEach(tag => {
        const el    = document.createElement('div');
        const state = tagFilters[tag];
        el.className = 'tag-chip' + (state === 'include' ? ' included' : state === 'exclude' ? ' excluded' : '');
        el.textContent = tag;
        el.addEventListener('click', () => toggleTag(tag));
        list.appendChild(el);
      });
  }

  /* ── Toggle a tag (include / exclude / clear) ───── */
  function toggleTag(tag) {
    if (!tagFilters[tag]) {
      tagFilters[tag] = tagMode;
    } else if (tagFilters[tag] === tagMode) {
      delete tagFilters[tag];            // clicking same mode twice clears it
    } else {
      tagFilters[tag] = tagMode;         // switch mode
    }
    renderTagList();
    renderSelectedTags();
  }

  /* ── Remove a tag filter ────────────────────────── */
  function removeTag(tag) {
    delete tagFilters[tag];
    renderTagList();
    renderSelectedTags();
  }

  /* ── Render active filter pills ─────────────────── */
  function renderSelectedTags() {
    const wrap    = document.getElementById('selectedTags');
    const group   = document.getElementById('selectedTagsGroup');
    const entries = Object.entries(tagFilters);

    if (entries.length === 0) {
      group.style.display = 'none';
      return;
    }
    group.style.display = '';
    wrap.innerHTML = '';

    entries.forEach(([tag, mode]) => {
      const el   = document.createElement('div');
      el.className = `sel-tag ${mode === 'include' ? 'inc' : 'exc'}`;
      el.innerHTML = `
        ${CONFIG.esc(tag)}
        <span class="remove-tag" data-tag="${CONFIG.esc(tag)}">✕</span>`;
      el.querySelector('.remove-tag').addEventListener('click', () => removeTag(tag));
      wrap.appendChild(el);
    });
  }

  /* ── Apply all active filters to a problem list ─── */
  function applyTo(problems) {
    const minR = parseInt(document.getElementById('ratingMin').value) || 0;
    const maxR = parseInt(document.getElementById('ratingMax').value) || 9999;

    const included = Object.entries(tagFilters).filter(([, v]) => v === 'include').map(([k]) => k);
    const excluded = Object.entries(tagFilters).filter(([, v]) => v === 'exclude').map(([k]) => k);

    return problems.filter(p => {
      const r    = p.rating || 0;
      const tags = p.tags  || [];

      // Rating filter (skip unrated problems from rating check)
      if (r && (r < minR || r > maxR)) return false;

      // Included tags: problem must have ALL included tags
      if (included.length > 0 && !included.every(t => tags.includes(t))) return false;

      // Excluded tags: problem must have NONE of the excluded tags
      if (excluded.some(t => tags.includes(t))) return false;

      return true;
    });
  }

  /* ── Public API ─────────────────────────────────── */
  return { setTagMode, renderTagList, renderSelectedTags, removeTag, applyTo };
})();
