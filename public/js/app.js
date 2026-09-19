// DevOps Tools Hub — Client-side interactions
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('devops_tools_theme', nextTheme);
    });
  }

  // 2. Real-time Client-Side Search Filter (for instant responsiveness)
  const searchInput = document.getElementById('live-search-input');
  const toolCards = document.querySelectorAll('.tool-card');
  const emptyState = document.getElementById('live-empty-state');
  const toolsCountBadge = document.getElementById('visible-tools-count');

  if (searchInput && toolCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      toolCards.forEach(card => {
        const title = card.getAttribute('data-name') || '';
        const category = card.getAttribute('data-category') || '';
        const tags = card.getAttribute('data-tags') || '';
        const tagline = card.getAttribute('data-tagline') || '';

        const matches = title.includes(query) || 
                        category.includes(query) || 
                        tags.includes(query) || 
                        tagline.includes(query);

        if (matches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      if (toolsCountBadge) {
        toolsCountBadge.textContent = visibleCount;
      }
    });
  }

  // 3. One-Click Copy for Quickstart Commands
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeTarget = btn.getAttribute('data-target');
      const codeEl = document.getElementById(codeTarget);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.innerText).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="color:#10b981">Copied!</span>
          `;
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
        });
      }
    });
  });

  // 4. Asynchronous Review Upvote with Optimistic UI
  const upvoteButtons = document.querySelectorAll('.upvote-btn');
  upvoteButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const reviewId = btn.getAttribute('data-review-id');
      const countEl = btn.querySelector('.upvote-count');
      
      // Prevent multiple clicks in same session
      if (btn.classList.contains('voted')) return;

      const currentCount = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = currentCount + 1;
      btn.classList.add('voted');
      btn.style.borderColor = 'var(--accent-blue)';
      btn.style.color = 'var(--accent-cyan)';

      try {
        const res = await fetch(`/api/reviews/${reviewId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          countEl.textContent = data.upvotes;
        }
      } catch (err) {
        console.error('Upvote failed:', err);
      }
    });
  });
});
