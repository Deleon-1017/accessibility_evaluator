/**
 * WCAG Sidebar Application
 * 
 * This module provides the JavaScript functionality for the WCAG Guidelines
 * sidebar layout, including data management, URL state handling, sidebar
 * navigation, and main content display.
 */

/**
 * AccessibilityScorer
 *
 * Performs heuristic HTML analysis to produce an accessibility score out of 100.
 * Uses a detached document so no live DOM is mutated.
 */
class LegacyAccessibilityScorer {
  /**
   * Score definition: each entry has a name, description, max points, and checker.
   * @private
   */
  static get CHECKS() {
    return [
      {
        id: 'alt-text',
        name: 'Alt text on images',
        description: 'Images have meaningful alt attributes',
        maxPoints: 15,
        check(doc) {
          const imgs = Array.from(doc.querySelectorAll('img'));
          if (imgs.length === 0) return 15; // no images → not applicable, full credit
          const allPass = imgs.every(img => img.hasAttribute('alt'));
          const anyMeaningful = imgs.some(img => {
            const alt = img.getAttribute('alt');
            return alt !== null && alt.trim().length > 0;
          });
          if (allPass && anyMeaningful) return 15;
          if (anyMeaningful) return 8;
          if (allPass) return 5; // all empty alt (decorative only)
          return 0;
        }
      },
      {
        id: 'form-labels',
        name: 'Form labels',
        description: 'Inputs have associated labels or aria-label',
        maxPoints: 12,
        check(doc) {
          const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea'));
          if (inputs.length === 0) return 12;
          const labels = Array.from(doc.querySelectorAll('label'));
          const labelledIds = new Set(labels.map(l => l.getAttribute('for')).filter(Boolean));
          const passing = inputs.filter(input => {
            const id = input.getAttribute('id');
            return (id && labelledIds.has(id))
              || input.hasAttribute('aria-label')
              || input.hasAttribute('aria-labelledby')
              || input.closest('label') !== null;
          });
          if (passing.length === inputs.length) return 12;
          if (passing.length > 0) return Math.round((passing.length / inputs.length) * 12);
          return 0;
        }
      },
      {
        id: 'heading-hierarchy',
        name: 'Heading hierarchy',
        description: 'Heading levels are not skipped',
        maxPoints: 10,
        check(doc) {
          const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'));
          if (headings.length === 0) return 10;
          let prevLevel = 0;
          let skipped = false;
          for (const h of headings) {
            const level = parseInt(h.tagName[1], 10);
            if (prevLevel > 0 && level > prevLevel + 1) { skipped = true; break; }
            prevLevel = level;
          }
          return skipped ? 4 : 10;
        }
      },
      {
        id: 'button-link-purpose',
        name: 'Button & link purpose',
        description: 'Interactive elements have descriptive labels',
        maxPoints: 10,
        check(doc) {
          const interactives = Array.from(doc.querySelectorAll('a, button'));
          if (interactives.length === 0) return 10;
          const passing = interactives.filter(el => {
            const text = el.textContent.trim();
            const label = el.getAttribute('aria-label') || el.getAttribute('title') || '';
            const hasImg = el.querySelector('img[alt]');
            return text.length > 0 || label.length > 0 || hasImg;
          });
          if (passing.length === interactives.length) return 10;
          if (passing.length > 0) return Math.round((passing.length / interactives.length) * 10);
          return 0;
        }
      },
      {
        id: 'aria-attributes',
        name: 'ARIA attributes',
        description: 'ARIA roles and attributes are used meaningfully',
        maxPoints: 10,
        check(doc) {
          const ariaEls = Array.from(doc.querySelectorAll('[role],[aria-label],[aria-labelledby],[aria-describedby],[aria-hidden],[aria-live],[aria-expanded],[aria-controls],[aria-required],[aria-invalid]'));
          // Bonus if meaningful ARIA is present
          const hasRole = doc.querySelector('[role]');
          const hasLabel = doc.querySelector('[aria-label],[aria-labelledby]');
          const hasDescribe = doc.querySelector('[aria-describedby]');
          if (ariaEls.length === 0) {
            // No ARIA at all — check if ARIA is even needed (no form, no interactive)
            const needsAria = doc.querySelector('input,select,textarea,button,a,video,audio');
            return needsAria ? 4 : 10;
          }
          let pts = 4;
          if (hasRole) pts += 2;
          if (hasLabel) pts += 2;
          if (hasDescribe) pts += 2;
          return pts;
        }
      },
      {
        id: 'semantic-structure',
        name: 'Semantic HTML',
        description: 'Semantic elements used for structure',
        maxPoints: 8,
        check(doc) {
          const semanticTags = ['main','nav','header','footer','article','section','aside','figure','figcaption','time','mark','address'];
          const divSpanCount = doc.querySelectorAll('div,span').length;
          const semanticCount = semanticTags.reduce((n, tag) => n + doc.querySelectorAll(tag).length, 0);
          if (semanticCount >= 2) return 8;
          if (semanticCount === 1) return 5;
          if (divSpanCount === 0) return 8; // Minimal markup — ok
          return 2;
        }
      },
      {
        id: 'keyboard-focus',
        name: 'Keyboard accessibility',
        description: 'No positive tabindex or focus traps',
        maxPoints: 8,
        check(doc) {
          const badTabindex = Array.from(doc.querySelectorAll('[tabindex]')).filter(el => {
            const val = parseInt(el.getAttribute('tabindex'), 10);
            return val > 0;
          });
          const onclickDivs = Array.from(doc.querySelectorAll('div[onclick],span[onclick]'));
          if (badTabindex.length === 0 && onclickDivs.length === 0) return 8;
          if (badTabindex.length > 0 && onclickDivs.length > 0) return 0;
          return 3;
        }
      },
      {
        id: 'media-captions',
        name: 'Media captions',
        description: 'Video/audio has captions or transcript',
        maxPoints: 8,
        check(doc) {
          const mediaEls = doc.querySelectorAll('video,audio');
          if (mediaEls.length === 0) return 8;
          const hasTracks = doc.querySelectorAll('track[kind="captions"],track[kind="subtitles"]').length > 0;
          const hasTranscriptLink = Array.from(doc.querySelectorAll('a')).some(a => {
            const text = (a.textContent + a.getAttribute('href')).toLowerCase();
            return text.includes('transcript') || text.includes('caption') || text.includes('.vtt') || text.includes('.srt');
          });
          if (hasTracks || hasTranscriptLink) return 8;
          return 0;
        }
      },
      {
        id: 'table-headers',
        name: 'Table structure',
        description: 'Tables have appropriate headers',
        maxPoints: 8,
        check(doc) {
          const tables = doc.querySelectorAll('table');
          if (tables.length === 0) return 8;
          const allHaveHeaders = Array.from(tables).every(t => t.querySelector('th') !== null);
          const hasCaption = Array.from(tables).some(t => t.querySelector('caption') !== null);
          if (allHaveHeaders && hasCaption) return 8;
          if (allHaveHeaders) return 6;
          return 0;
        }
      },
      {
        id: 'color-contrast',
        name: 'Color contrast',
        description: 'No very low contrast inline styles',
        maxPoints: 6,
        check(doc) {
          // Heuristic: penalize elements with very light inline color on white/light bg
          const lightColors = ['#fff','#ffffff','white','#eee','#eeeeee','#f9fafb','#f5f5f5','#fafafa'];
          const withStyle = Array.from(doc.querySelectorAll('[style]'));
          const lowContrast = withStyle.filter(el => {
            const s = el.getAttribute('style').toLowerCase();
            return lightColors.some(c => s.includes(`color:${c}`) || s.includes(`color: ${c}`));
          });
          return lowContrast.length > 0 ? 0 : 6;
        }
      },
      {
        id: 'skip-links',
        name: 'Skip navigation',
        description: 'Skip to content links provided',
        maxPoints: 5,
        check(doc) {
          const links = Array.from(doc.querySelectorAll('a'));
          const hasSkip = links.some(a => {
            const text = a.textContent.toLowerCase();
            const href = (a.getAttribute('href') || '').toLowerCase();
            return (text.includes('skip') && (text.includes('content') || text.includes('main'))) || href === '#main' || href === '#content' || href === '#main-content';
          });
          return hasSkip ? 5 : 0;
        }
      }
    ];
  }

  /**
   * Score an HTML snippet
   * @param {string} html - Raw HTML string to analyze
   * @returns {{ total: number, max: number, grade: string, color: string, checks: Array }}
   */
  static score(html) {
    if (!html || typeof html !== 'string') {
      return { total: 0, max: 100, grade: 'N/A', color: '#94a3b8', checks: [] };
    }

    // Parse into a detached DOM
    const doc = document.createElement('div');
    doc.innerHTML = html;

    const checks = AccessibilityScorer.CHECKS;
    let totalEarned = 0;
    const maxPossible = checks.reduce((s, c) => s + c.maxPoints, 0);

    const results = checks.map(check => {
      let earned = 0;
      try {
        earned = Math.min(check.maxPoints, Math.max(0, check.check(doc)));
      } catch (e) {
        earned = 0;
      }
      totalEarned += earned;
      return {
        id: check.id,
        name: check.name,
        description: check.description,
        maxPoints: check.maxPoints,
        earned,
        passed: earned >= check.maxPoints
      };
    });

    // Normalize to 100
    const total = Math.round((totalEarned / maxPossible) * 100);
    const { grade, color } = AccessibilityScorer.getGrade(total);

    return { total, max: 100, grade, color, checks: results };
  }

  /**
   * Return grade label and color for a score
   * @param {number} score
   * @returns {{ grade: string, color: string }}
   */
  static getGrade(score) {
    if (score >= 90) return { grade: 'Excellent', color: '#16a34a' };
    if (score >= 75) return { grade: 'Good',      color: '#65a30d' };
    if (score >= 55) return { grade: 'Fair',      color: '#d97706' };
    if (score >= 30) return { grade: 'Poor',      color: '#ea580c' };
    return                  { grade: 'Fail',      color: '#dc2626' };
  }
}

/**
 * Scan-compatible scorer for the educational code examples.
 *
 * The examples are fragments rather than full pages, so this keeps their
 * focused checks while using the exact deduction formula from scan.php.
 */
class AccessibilityScorer {
  static get DEDUCTIONS() {
    return { error: 5, warning: 2, info: 1 };
  }

  // Database-backed scanner checks grouped by the WCAG success criterion they
  // evaluate. The score remains scanner-compatible; this mapping controls
  // which criteria are shown for a guideline's focused teaching example.
  static get CHECK_IDS_BY_WCAG() {
    return {
      '1.1.1': ['img_missing_alt', 'image_input_no_alt'],
      '1.2.1': ['audio_no_transcript'],
      '1.2.2': ['video_no_captions'],
      '1.2.3': ['video_no_audio_desc'],
      '1.2.4': ['video_no_basic_attrs'],
      '1.3.1': ['skipped_heading_level', 'table_no_headers', 'radio_no_fieldset', 'hidden_content_accessibility', 'bullets_not_lists'],
      '1.3.2': ['css_reordering', 'layout_no_semantic'],
      '1.4.1': ['color_only_info'],
      '1.4.2': ['autoplay_media'],
      '1.4.4': ['fixed_font_size', 'zoom_disabled', 'no_viewport_meta'],
      '1.4.5': ['image_for_text'],
      '2.1.1': ['non_semantic_clickable'],
      '2.1.4': ['char_key_shortcuts'],
      '2.2.1': ['meta_refresh'],
      '2.2.2': ['marquee_element'],
      '2.3.1': ['rapid_flashing'],
      '2.4.1': ['no_skip_link', 'missing_main_landmark', 'missing_nav_landmark'],
      '2.4.2': ['missing_page_title'],
      '2.4.3': ['positive_tabindex'],
      '2.4.4': ['link_no_accessible_name', 'placeholder_link', 'inconsistent_link_text', 'vague_link_text'],
      '2.4.5': ['limited_navigation'],
      '2.4.6': ['missing_h1', 'multiple_h1', 'empty_heading', 'generic_heading'],
      '2.4.7': ['focus_outline_removed'],
      '2.5.1': ['touch_no_fallback'],
      '3.1.1': ['missing_lang_attr'],
      '3.1.2': ['no_lang_markup_non_latin'],
      '3.2.1': ['form_auto_submit'],
      '3.3.1': ['required_no_error_structure'],
      '3.3.2': ['form_control_no_label'],
      '3.3.3': ['no_client_error_handling'],
      '3.3.4': ['form_no_confirmation'],
      '3.3.5': ['complex_input_no_help'],
      '4.1.1': ['html_parsing_errors'],
      '4.1.2': ['button_input_no_label', 'button_no_accessible_name', 'iframe_no_title', 'aria_role_no_name', 'form_no_aria'],
      '4.1.3': ['no_aria_live_regions']
    };
  }

  static get CHECKS() {
    const hasName = element => Boolean(
      (element.getAttribute('aria-label') || '').trim()
      || (element.getAttribute('aria-labelledby') || '').trim()
      || (element.getAttribute('title') || '').trim()
      || element.textContent.trim()
      || element.querySelector('img[alt]:not([alt=""])')
    );
    const check = (id, name, description, type, detect) => ({ id, name, description, type, detect });

    // These checks mirror the conditions in scan-check-implementations.php.
    // Keeping the rules here makes the educational comparison immediate while
    // keeping its deductions consistent with scan.php.
    return [
      check('img_missing_alt', 'Image alternative text', 'Images with a source need alt text unless hidden or presentational.', 'error', doc => Array.from(doc.querySelectorAll('img')).filter(img => img.getAttribute('src') && !img.hasAttribute('alt') && img.getAttribute('aria-hidden') !== 'true' && !['presentation', 'none'].includes((img.getAttribute('role') || '').toLowerCase())).length),
      check('missing_page_title', 'Page title', 'A document needs a non-empty title element.', 'error', doc => doc.querySelector('title')?.textContent.trim() ? 0 : 1),
      check('missing_lang_attr', 'Document language', 'The html element needs a language declaration.', 'error', doc => doc.querySelector('html[lang]')?.getAttribute('lang')?.trim() ? 0 : 1),
      check('missing_h1', 'Primary heading', 'A page needs an h1 heading.', 'warning', doc => doc.querySelector('h1') ? 0 : 1),
      check('multiple_h1', 'Multiple primary headings', 'A page should use one primary heading.', 'info', doc => doc.querySelectorAll('h1').length > 1 ? 1 : 0),
      check('skipped_heading_level', 'Skipped heading levels', 'Heading levels must not skip levels.', 'warning', doc => { let previous = 0; let issues = 0; doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => { const level = Number(h.tagName[1]); if (previous && level > previous + 1) issues++; previous = level; }); return issues; }),
      check('link_no_accessible_name', 'Link accessible names', 'Links need text, an accessible name, or an image alternative.', 'error', doc => Array.from(doc.querySelectorAll('a')).filter(link => !hasName(link)).length),
      check('placeholder_link', 'Placeholder links', 'Links must provide a real destination.', 'warning', doc => Array.from(doc.querySelectorAll('a[href]')).filter(link => /^(#|javascript:)/i.test(link.getAttribute('href').trim())).length),
      check('form_control_no_label', 'Form control labels', 'Form controls need an associated label or accessible name.', 'error', doc => { const labels = new Set(Array.from(doc.querySelectorAll('label[for]')).map(label => label.getAttribute('for'))); return Array.from(doc.querySelectorAll('input,textarea,select')).filter(control => { const type = (control.getAttribute('type') || '').toLowerCase(); if (['hidden', 'submit', 'reset', 'button', 'image'].includes(type)) return false; return !(control.closest('label') || (control.id && labels.has(control.id)) || hasName(control)); }).length; }),
      check('button_input_no_label', 'Button input labels', 'Button inputs need a value or accessible name.', 'error', doc => Array.from(doc.querySelectorAll('input[type="submit"],input[type="reset"],input[type="button"]')).filter(input => !(input.getAttribute('value') || '').trim() && !hasName(input)).length),
      check('image_input_no_alt', 'Image input alternatives', 'Image buttons need alt text.', 'error', doc => Array.from(doc.querySelectorAll('input[type="image"]')).filter(input => !(input.getAttribute('alt') || '').trim()).length),
      check('button_no_accessible_name', 'Button accessible names', 'Buttons need visible text or an accessible name.', 'error', doc => Array.from(doc.querySelectorAll('button')).filter(button => !hasName(button)).length),
      check('iframe_no_title', 'Frame titles', 'Frames need descriptive titles.', 'error', doc => Array.from(doc.querySelectorAll('iframe')).filter(frame => !(frame.getAttribute('title') || '').trim()).length),
      check('table_no_headers', 'Table headers', 'Data tables need headers or a caption.', 'warning', doc => Array.from(doc.querySelectorAll('table')).filter(table => !table.querySelector('th,caption')).length),
      check('audio_no_transcript', 'Audio alternatives', 'Audio needs a transcript or track.', 'warning', doc => Array.from(doc.querySelectorAll('audio')).filter(audio => !audio.querySelector('track')).length),
      check('video_no_captions', 'Video captions', 'Video needs captions or subtitles.', 'warning', doc => Array.from(doc.querySelectorAll('video')).filter(video => !video.querySelector('track[kind="captions"],track[kind="subtitles"]')).length),
      check('autoplay_media', 'Autoplay controls', 'Autoplaying media must provide controls.', 'warning', doc => doc.querySelectorAll('audio[autoplay]:not([controls]),video[autoplay]:not([controls])').length),
      check('meta_refresh', 'Timed refresh', 'Timed refresh redirects can disrupt users.', 'warning', doc => doc.querySelectorAll('meta[http-equiv="refresh"]').length),
      check('no_skip_link', 'Skip navigation', 'A page needs a skip link.', 'info', doc => doc.querySelector('a[href="#main"],a[href="#content"],a[href="#maincontent"]') ? 0 : 1),
      check('positive_tabindex', 'Positive tabindex', 'Positive tabindex disrupts focus order.', 'warning', doc => Array.from(doc.querySelectorAll('[tabindex]')).filter(el => Number(el.getAttribute('tabindex')) > 0).length),
      check('required_no_error_structure', 'Required-field errors', 'Required fields need an error-message structure.', 'info', doc => Array.from(doc.querySelectorAll('[required],[aria-required="true"]')).filter(el => !el.hasAttribute('aria-describedby') && !el.hasAttribute('aria-invalid')).length),
      check('no_lang_markup_non_latin', 'Language changes', 'Non-Latin text needs language markup.', 'info', (doc, source) => /[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/u.test(source) && doc.querySelectorAll('[lang]').length < 2 ? 1 : 0),
      check('radio_no_fieldset', 'Radio grouping', 'Related radio buttons need a fieldset.', 'warning', doc => { const groups = new Map(); doc.querySelectorAll('input[type="radio"][name]').forEach(radio => { const group = groups.get(radio.name) || []; group.push(radio); groups.set(radio.name, group); }); return Array.from(groups.values()).filter(group => group.length > 1 && !group[0].closest('fieldset')).length; }),
      check('no_aria_live_regions', 'Form status messages', 'Forms need a live region for dynamic updates.', 'info', doc => doc.querySelector('form') && !doc.querySelector('[role="alert"],[aria-live]') ? 1 : 0),
      check('empty_heading', 'Empty headings', 'Headings cannot be empty.', 'warning', doc => Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(h => !h.textContent.trim()).length),
      check('generic_heading', 'Generic headings', 'Headings need descriptive text.', 'info', doc => Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(h => ['untitled', 'heading', 'title', 'header', 'section', 'content'].includes(h.textContent.trim().toLowerCase())).length),
      check('hidden_content_accessibility', 'Hidden content', 'Hidden content may need an explicit screen-reader state.', 'info', doc => Array.from(doc.querySelectorAll('[hidden],[style*="display: none"],[style*="display:none"]')).filter(el => !el.hasAttribute('aria-hidden')).length),
      check('aria_role_no_name', 'ARIA control names', 'Interactive ARIA roles need an accessible name.', 'error', doc => Array.from(doc.querySelectorAll('[role]')).filter(el => ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch', 'textbox'].includes((el.getAttribute('role') || '').toLowerCase()) && !hasName(el)).length),
      check('missing_main_landmark', 'Main landmark', 'A page needs a main landmark.', 'info', doc => doc.querySelector('main,[role="main"]') ? 0 : 1),
      check('missing_nav_landmark', 'Navigation landmark', 'A page needs a navigation landmark.', 'info', doc => doc.querySelector('nav,[role="navigation"]') ? 0 : 1),
      check('video_no_audio_desc', 'Video descriptions', 'Video needs an audio-description alternative.', 'info', doc => Array.from(doc.querySelectorAll('video')).filter(video => !video.querySelector('track[kind="descriptions"]')).length),
      check('css_reordering', 'CSS reordering', 'CSS order properties can change reading order.', 'warning', doc => doc.querySelectorAll('[style*="flex-direction"],[style*="order"]').length),
      check('color_only_info', 'Colour-only information', 'Colour alone cannot convey information.', 'info', doc => doc.querySelectorAll('[style*="color"],[style*="background-color"]').length > 3 ? 1 : 0),
      check('image_for_text', 'Images of text', 'Avoid images used as text where practical.', 'info', doc => Array.from(doc.querySelectorAll('img[alt]')).filter(img => /text|heading|title|button|label|sign|banner/i.test(img.getAttribute('alt'))).length),
      check('non_semantic_clickable', 'Non-semantic click targets', 'Clickable divs and spans need a role and tabindex.', 'warning', doc => Array.from(doc.querySelectorAll('div[onclick],span[onclick]')).filter(el => !el.hasAttribute('role') || !el.hasAttribute('tabindex')).length),
      check('marquee_element', 'Marquee content', 'Marquee elements are inaccessible.', 'error', doc => doc.querySelectorAll('marquee').length),
      check('rapid_flashing', 'Rapid flashing', 'Animations faster than three flashes per second are unsafe.', 'error', (doc, source) => /animation.*?(\d+)ms/i.test(source) && Number(RegExp.$1) < 333 ? 1 : 0),
      check('focus_outline_removed', 'Focus indicator', 'Focus outlines must not be removed without a replacement.', 'error', (doc, source) => /:focus\s*\{[^}]*outline\s*:\s*(none|0)/i.test(source) ? 1 : 0),
      check('limited_navigation', 'Navigation methods', 'Pages need more than one way to locate content.', 'info', doc => !doc.querySelector('input[type="search"],[role="search"]') && doc.querySelectorAll('nav,[role="navigation"]').length < 2 ? 1 : 0),
      check('form_auto_submit', 'Automatic form submission', 'Changes must not automatically submit a form.', 'error', doc => Array.from(doc.querySelectorAll('select[onchange],input[onchange]')).filter(el => /submit|location/i.test(el.getAttribute('onchange'))).length),
      check('form_no_confirmation', 'High-risk form confirmation', 'High-risk actions need a confirmation step.', 'warning', doc => Array.from(doc.querySelectorAll('form')).filter(form => /delete|remove|cancel|payment|purchase|transaction/i.test(form.innerHTML) && !/confirm|are you sure/i.test(form.innerHTML)).length),
      check('no_client_error_handling', 'Form validation', 'Forms need client-side validation where appropriate.', 'info', doc => Array.from(doc.querySelectorAll('form')).filter(form => !form.querySelector('[required],[pattern],[min],[max],[minlength],[maxlength]')).length),
      check('complex_input_no_help', 'Complex input help', 'Complex inputs need format instructions.', 'info', doc => Array.from(doc.querySelectorAll('input[pattern],input[type="date"],input[type="time"],input[type="tel"]')).filter(input => !input.hasAttribute('title') && !input.hasAttribute('placeholder') && !input.hasAttribute('aria-describedby')).length),
      check('touch_no_fallback', 'Touch-only controls', 'Touch event handlers need a fallback.', 'warning', (doc, source) => /ontouchstart|ontouchmove|ontouchend/i.test(source) ? 1 : 0),
      check('char_key_shortcuts', 'Character key shortcuts', 'Character shortcuts need a way to disable or remap them.', 'warning', (doc, source) => /onkeypress|addEventListener.*keypress/i.test(source) ? 1 : 0),
      check('inconsistent_link_text', 'Consistent link text', 'The same destination should use consistent text.', 'info', doc => { const destinations = new Map(); doc.querySelectorAll('a[href]').forEach(link => { const href = link.getAttribute('href'); const texts = destinations.get(href) || new Set(); texts.add(link.textContent.trim()); destinations.set(href, texts); }); return Array.from(destinations.values()).filter(texts => texts.size > 1).length; }),
      check('video_no_basic_attrs', 'Video controls and poster', 'Video needs controls and a poster image.', 'warning', doc => Array.from(doc.querySelectorAll('video')).filter(video => !video.hasAttribute('controls') || !video.hasAttribute('poster')).length),
      check('fixed_font_size', 'Fixed text size', 'Body text should not use a fixed pixel size.', 'warning', (doc, source) => /(?:body|p)\s*\{[^}]*font-size\s*:\s*\d+px/i.test(source) ? 1 : 0),
      check('layout_no_semantic', 'Semantic layout', 'Complex layouts need semantic structure.', 'info', doc => doc.querySelectorAll('[style*="position"],[style*="grid"],[style*="flex"]').length > 5 && doc.querySelectorAll('section,article,aside,header,footer,nav,main').length < 2 ? 1 : 0),
      check('zoom_disabled', 'Zoom restriction', 'Users must be able to zoom content.', 'error', doc => Array.from(doc.querySelectorAll('meta[name="viewport"]')).filter(meta => /user-scalable=no|maximum-scale=1/i.test(meta.getAttribute('content') || '')).length),
      check('no_viewport_meta', 'Viewport settings', 'Pages need a viewport meta tag.', 'info', doc => doc.querySelector('meta[name="viewport"]') ? 0 : 1),
      check('form_no_aria', 'Form accessibility metadata', 'Large forms need accessible error/help metadata.', 'info', doc => Array.from(doc.querySelectorAll('form')).filter(form => form.querySelectorAll('input,textarea,select').length > 2 && !form.querySelector('[aria-label],[aria-describedby],[aria-invalid]')).length),
      check('bullets_not_lists', 'List semantics', 'Bullet points should use list markup.', 'warning', (doc, source) => /[•\-*]\s+\w+/u.test(source) && !doc.querySelector('ul,ol') ? 1 : 0),
      check('vague_link_text', 'Vague link text', 'Link text must describe its destination.', 'warning', doc => Array.from(doc.querySelectorAll('a')).filter(link => ['click here', 'here', 'more', 'read more', 'link', 'this', 'continue'].includes(link.textContent.trim().toLowerCase())).length),
      // DOMParser recovers malformed markup, so browser-side examples cannot
      // expose libxml's parser error count. scan.php reports this separately.
      check('html_parsing_errors', 'HTML parsing', 'Invalid HTML can affect assistive technologies.', 'warning', () => 0)
    ];
  }

  static score(html, css = '', js = '') {
    if (!html || typeof html !== 'string') {
      return { total: 0, max: 100, grade: 'N/A', color: '#94a3b8', checks: [] };
    }

    const exampleAssets = `<style>${css}</style><script>${js}</script>`;
    const isDocument = /<!DOCTYPE\s+html|<html\s+/i.test(html);
    // scan.php wraps submitted fragments with these document essentials before
    // scanning. Do exactly the same so snippets are not penalised for metadata
    // that is outside the teaching example's scope.
    const source = isDocument
      ? `${html}\n${exampleAssets}`
      : `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Scanned Page</title>${exampleAssets}</head><body>${html}</body></html>`;
    // DOMParser retains document-level elements (html, title, viewport), which
    // are part of scan.php's checks and are discarded by a div fragment parser.
    const doc = new DOMParser().parseFromString(source, 'text/html');

    let totalDeduction = 0;
    const checks = AccessibilityScorer.CHECKS.map(check => {
      let issues = 0;
      try {
        issues = Math.max(0, check.detect(doc, source));
      } catch (error) {
        issues = 0;
      }

      const deduction = issues * AccessibilityScorer.DEDUCTIONS[check.type];
      totalDeduction += deduction;
      return {
        ...check,
        issues,
        deduction,
        passed: issues === 0
      };
    });

    const total = Math.max(100 - Math.min(totalDeduction, 70), 0);
    const { grade, color } = AccessibilityScorer.getGrade(total);
    return { total, max: 100, grade, color, checks };
  }

  static getGrade(score) {
    if (score >= 90) return { grade: 'Excellent', color: '#16a34a' };
    if (score >= 75) return { grade: 'Good', color: '#65a30d' };
    if (score >= 55) return { grade: 'Fair', color: '#d97706' };
    if (score >= 30) return { grade: 'Poor', color: '#ea580c' };
    return { grade: 'Fail', color: '#dc2626' };
  }
}

/**
 * WCAGDataManager
 * 
 * Manages WCAG guidelines data fetching, caching, and retrieval.
 * Provides methods for accessing guidelines by ID or grouped by principle.
 */
class WCAGDataManager {
  /**
   * Create a new WCAGDataManager instance
   * @param {string} apiEndpoint - The API endpoint URL for fetching guidelines
   */
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.guidelines = [];
    this.guidelinesMap = new Map();
    this.loading = false;
    this.error = null;
  }
  
  /**
   * Fetch guidelines from the API
   * @returns {Promise<Array>} Array of guideline objects
   * @throws {Error} If the API request fails
   */
  async fetchGuidelines() {
    // Prevent multiple simultaneous fetches
    if (this.loading) {
      return this.guidelines;
    }
    
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch(this.apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load guidelines');
      }
      
      this.guidelines = result.data;
      this.buildGuidelinesMap();
      this.loading = false;
      
      return this.guidelines;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      throw new Error(`Failed to fetch guidelines: ${error.message}`);
    }
  }
  
  /**
   * Build a Map for quick guideline lookup by ID
   * @private
   */
  buildGuidelinesMap() {
    this.guidelinesMap.clear();
    this.guidelines.forEach(guideline => {
      this.guidelinesMap.set(guideline.id, guideline);
    });
  }
  
  /**
   * Get a specific guideline by ID
   * @param {string} guidelineId - The guideline ID (e.g., "1.1.1")
   * @returns {Object|undefined} The guideline object or undefined if not found
   */
  getGuideline(guidelineId) {
    if (!guidelineId) {
      return undefined;
    }

    if (this.guidelinesMap.has(guidelineId)) {
      return this.guidelinesMap.get(guidelineId);
    }

    if (/^\d+\.\d+$/.test(guidelineId)) {
      const candidate = Array.from(this.guidelinesMap.keys()).find(id => id.startsWith(`${guidelineId}.`));
      return candidate ? this.guidelinesMap.get(candidate) : undefined;
    }

    return undefined;
  }
  
  /**
   * Get guidelines grouped by principle
   * @returns {Object} Object with principle names as keys and arrays of guidelines as values
   */
  getGuidelinesByPrinciple() {
    const grouped = {
      'Perceivable': [],
      'Operable': [],
      'Understandable': [],
      'Robust': []
    };
    
    this.guidelines.forEach(guideline => {
      if (grouped[guideline.principle]) {
        grouped[guideline.principle].push(guideline);
      }
    });
    
    return grouped;
  }
}

/**
 * URLStateManager
 * 
 * Manages URL state for shareable links and browser navigation.
 * Handles URL parameter updates and popstate events for back/forward navigation.
 */
class URLStateManager {
  /**
   * Create a new URLStateManager instance
   * @param {Function} onStateChange - Callback function invoked when URL state changes
   */
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.init();
  }
  
  /**
   * Initialize popstate event listener for browser back/forward navigation
   * @private
   */
  init() {
    window.addEventListener('popstate', (event) => {
      const guidelineId = this.getCurrentGuideline();
      if (this.onStateChange) {
        this.onStateChange(guidelineId);
      }
    });
  }
  
  /**
   * Get the current guideline ID from URL parameters
   * @returns {string|null} The guideline ID or null if not present
   */
  getCurrentGuideline() {
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (hash.startsWith('guideline-')) {
      const guidelineId = hash.replace(/^guideline-/, '').replace(/-/g, '.');
      if (guidelineId) {
        return guidelineId;
      }
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('guideline');
  }
  
  /**
   * Update the URL with a guideline parameter
   * @param {string} guidelineId - The guideline ID to add to the URL
   */
  updateURL(guidelineId) {
    if (guidelineId) {
      const url = `?guideline=${encodeURIComponent(guidelineId)}`;
      window.history.pushState({ guideline: guidelineId }, '', url);
    }
  }
  
  /**
   * Clear the guideline parameter from the URL
   */
  clearURL() {
    window.history.pushState({}, '', window.location.pathname);
  }
}
/**
 * WCAGSidebar
 * 
 * Manages the sidebar navigation component including rendering guidelines,
 * handling expand/collapse of principle groups, and managing active states.
 */
class WCAGSidebar {
  /**
   * Create a new WCAGSidebar instance
   * @param {HTMLElement} sidebarElement - The sidebar DOM element
   * @param {Function} onGuidelineSelect - Callback function invoked when a guideline is selected
   * @param {Function} onPrincipleToggle - Callback function invoked when a principle is expanded/collapsed
   */
  constructor(sidebarElement, onGuidelineSelect, onPrincipleToggle) {
    this.sidebar = sidebarElement;
    this.onGuidelineSelect = onGuidelineSelect;
    this.onPrincipleToggle = onPrincipleToggle;
    this.activeGuideline = null;
    this.expandedPrinciples = new Set(['Perceivable', 'Operable', 'Understandable', 'Robust']); // All expanded by default
    this.init();
  }
  
  /**
   * Initialize event listeners
   * @private
   */
  init() {
    // Event delegation for guideline link clicks
    this.sidebar.addEventListener('click', (event) => {
      // Handle guideline link clicks
      const guidelineLink = event.target.closest('.guideline-link');
      if (guidelineLink) {
        event.preventDefault();
        const guidelineId = guidelineLink.dataset.guidelineId;
        if (guidelineId && this.onGuidelineSelect) {
          this.onGuidelineSelect(guidelineId);
        }
        return;
      }
      
      // Handle principle header clicks
      const principleHeader = event.target.closest('.principle-header');
      if (principleHeader) {
        const principleGroup = principleHeader.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          this.togglePrinciple(principleName);
        }
      }
    });
    
    // Add keyboard navigation support
    this.sidebar.addEventListener('keydown', (event) => {
      this.handleKeyboardNav(event);
    });
  }
  
  /**
   * Render sidebar with guidelines data
   * @param {Object} guidelinesByPrinciple - Object with principle names as keys and arrays of guidelines as values
   */
  render(guidelinesByPrinciple) {
    const sidebarNav = this.sidebar.querySelector('.sidebar-nav');
    if (!sidebarNav) {
      console.error('Sidebar navigation container not found');
      return;
    }
    
    // Clear existing content
    sidebarNav.innerHTML = '';
    
    // Define principle order and icons
    const principleConfig = {
      'Perceivable': { icon: 'bi-eye', class: 'perceivable' },
      'Operable': { icon: 'bi-hand-index', class: 'operable' },
      'Understandable': { icon: 'bi-lightbulb', class: 'understandable' },
      'Robust': { icon: 'bi-shield-check', class: 'robust' }
    };
    
    // Render each principle group
    Object.keys(principleConfig).forEach(principleName => {
      const guidelines = guidelinesByPrinciple[principleName] || [];
      if (guidelines.length === 0) return;
      
      const config = principleConfig[principleName];
      const isExpanded = this.expandedPrinciples.has(principleName);
      const principleId = `principle-${principleName.toLowerCase()}`;
      
      // Create principle group
      const principleGroup = document.createElement('div');
      principleGroup.className = 'principle-group';
      principleGroup.dataset.principle = principleName;
      
      // Create principle header
      const principleHeader = document.createElement('button');
      principleHeader.className = 'principle-header';
      principleHeader.setAttribute('aria-expanded', isExpanded.toString());
      principleHeader.setAttribute('aria-controls', principleId);
      principleHeader.innerHTML = `
        <span class="principle-icon ${config.class}">
          <i class="${config.icon}"></i>
        </span>
        <span class="principle-name">${principleName}</span>
        <i class="bi bi-chevron-down expand-icon"></i>
      `;
      
      // Create guideline list
      const guidelineList = document.createElement('ul');
      guidelineList.className = 'guideline-list';
      guidelineList.id = principleId;
      guidelineList.setAttribute('role', 'list');
      if (!isExpanded) {
        guidelineList.style.display = 'none';
      }
      
      // Add guidelines to list
      guidelines.forEach(guideline => {
        const listItem = document.createElement('li');
        listItem.className = 'guideline-item';
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'guideline-link';
        link.dataset.guidelineId = guideline.id;
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.innerHTML = `
          <span class="guideline-id">${guideline.id}</span>
          <span class="guideline-title">${this.escapeHtml(guideline.title)}</span>
          <span class="level-badge level-${guideline.level}">${guideline.level}</span>
        `;
        
        listItem.appendChild(link);
        guidelineList.appendChild(listItem);
      });
      
      // Assemble principle group
      principleGroup.appendChild(principleHeader);
      principleGroup.appendChild(guidelineList);
      sidebarNav.appendChild(principleGroup);
    });
  }
  
  /**
   * Toggle principle expansion/collapse
   * @param {string} principleName - The name of the principle to toggle
   */
  togglePrinciple(principleName) {
    const principleGroup = this.sidebar.querySelector(`[data-principle="${principleName}"]`);
    if (!principleGroup) return;
    
    const principleHeader = principleGroup.querySelector('.principle-header');
    const guidelineList = principleGroup.querySelector('.guideline-list');
    
    if (!principleHeader || !guidelineList) return;
    
    const isExpanded = this.expandedPrinciples.has(principleName);
    
    if (isExpanded) {
      // Collapse
      this.expandedPrinciples.delete(principleName);
      principleHeader.setAttribute('aria-expanded', 'false');
      guidelineList.style.display = 'none';
      principleGroup.classList.remove('expanded');
      
      // Announce collapse to screen readers
      if (this.onPrincipleToggle) {
        this.onPrincipleToggle(principleName, false);
      }
    } else {
      // Expand
      this.expandedPrinciples.add(principleName);
      principleHeader.setAttribute('aria-expanded', 'true');
      guidelineList.style.display = 'block';
      principleGroup.classList.add('expanded');
      
      // Announce expansion to screen readers
      if (this.onPrincipleToggle) {
        this.onPrincipleToggle(principleName, true);
      }
    }
  }
  
  /**
   * Set active guideline and highlight it in the sidebar
   * @param {string} guidelineId - The guideline ID to set as active
   */
  setActiveGuideline(guidelineId) {
    // Remove active class from previously active guideline
    const previousActive = this.sidebar.querySelector('.guideline-link.active');
    if (previousActive) {
      previousActive.classList.remove('active');
      previousActive.removeAttribute('aria-current');
    }
    
    // Set new active guideline
    this.activeGuideline = guidelineId;
    
    if (guidelineId) {
      const newActive = this.sidebar.querySelector(`[data-guideline-id="${guidelineId}"]`);
      if (newActive) {
        newActive.classList.add('active');
        newActive.setAttribute('aria-current', 'page');
        
        // Ensure the principle containing this guideline is expanded
        const principleGroup = newActive.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          if (!this.expandedPrinciples.has(principleName)) {
            this.togglePrinciple(principleName);
          }
        }
        
        // Scroll the active guideline into view if needed
        newActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }
  
  /**
   * Toggle sidebar visibility (for mobile)
   */
  toggleSidebar() {
    this.sidebar.classList.toggle('sidebar-open');
    const isOpen = this.sidebar.classList.contains('sidebar-open');
    
    // Update toggle button aria-expanded state
    const toggleButton = document.getElementById('sidebarToggle');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', isOpen.toString());
    }
    
    // Manage overlay backdrop
    this.toggleOverlay(isOpen);
    
    // Manage body scroll lock on mobile
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Toggle sidebar width (collapsed/expanded for desktop)
   */
  toggleCollapse() {
    this.sidebar.classList.toggle('collapsed');
    const isCollapsed = this.sidebar.classList.contains('collapsed');
    
    // Toggle layout container class for grid adjustment
    const container = document.querySelector('.wcag-layout-container');
    if (container) {
      container.classList.toggle('sidebar-collapsed');
    }
    
    // Update aria state on collapse button
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn) {
      collapseBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
    }
    
    return isCollapsed;
  }
  
  /**
   * Toggle overlay backdrop visibility
   * @param {boolean} show - Whether to show the overlay
   * @private
   */
  toggleOverlay(show) {
    let overlay = document.getElementById('sidebarOverlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sidebarOverlay';
      overlay.className = 'sidebar-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      
      // Close sidebar when overlay is clicked
      overlay.addEventListener('click', () => {
        if (this.sidebar.classList.contains('sidebar-open')) {
          this.toggleSidebar();
        }
      });
      
      document.body.appendChild(overlay);
    }
    
    // Show or hide overlay
    if (show) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  }
  
  /**
   * Handle keyboard navigation within the sidebar
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeyboardNav(event) {
    const target = event.target;
    
    // Handle Enter and Space keys on guideline links
    if (target.classList.contains('guideline-link')) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const guidelineId = target.dataset.guidelineId;
        if (guidelineId && this.onGuidelineSelect) {
          this.onGuidelineSelect(guidelineId);
        }
        return;
      }
      
      // Handle arrow key navigation within guideline lists
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateGuidelines(target, event.key === 'ArrowDown' ? 1 : -1);
        return;
      }
    }
    
    // Handle Enter and Space keys on principle headers
    if (target.classList.contains('principle-header')) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const principleGroup = target.closest('.principle-group');
        if (principleGroup) {
          const principleName = principleGroup.dataset.principle;
          this.togglePrinciple(principleName);
        }
        return;
      }
    }
    
    // Handle Escape key to close mobile sidebar
    if (event.key === 'Escape') {
      const isOpen = this.sidebar.classList.contains('sidebar-open');
      if (isOpen) {
        event.preventDefault();
        this.toggleSidebar();
        
        // Return focus to toggle button
        const toggleButton = document.getElementById('sidebarToggle');
        if (toggleButton) {
          toggleButton.focus();
        }
      }
    }
  }
  
  /**
   * Navigate between guidelines using arrow keys
   * @param {HTMLElement} currentLink - The currently focused guideline link
   * @param {number} direction - Direction to navigate (1 for down, -1 for up)
   * @private
   */
  navigateGuidelines(currentLink, direction) {
    // Get all visible guideline links
    const allLinks = Array.from(this.sidebar.querySelectorAll('.guideline-link'));
    const visibleLinks = allLinks.filter(link => {
      const guidelineList = link.closest('.guideline-list');
      return guidelineList && guidelineList.style.display !== 'none';
    });
    
    if (visibleLinks.length === 0) return;
    
    // Find current index
    const currentIndex = visibleLinks.indexOf(currentLink);
    if (currentIndex === -1) return;
    
    // Calculate next index with wrapping
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
      nextIndex = visibleLinks.length - 1;
    } else if (nextIndex >= visibleLinks.length) {
      nextIndex = 0;
    }
    
    // Focus the next link
    const nextLink = visibleLinks[nextIndex];
    if (nextLink) {
      nextLink.focus();
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * WCAGMainContent
 * 
 * Manages the main content area component including landing page display,
 * guideline detail view rendering, and screen reader announcements.
 */
class WCAGMainContent {
  /**
   * Create a new WCAGMainContent instance
   * @param {HTMLElement} contentElement - The main content DOM element
   */
  constructor(contentElement) {
    this.content = contentElement;
    this.landingPage = document.getElementById('landingPage');
    this.detailView = document.getElementById('guidelineDetailView');
    this.ariaLiveRegion = this.createAriaLiveRegion();
  }
  
  /**
   * Create ARIA live region for screen reader announcements
   * @returns {HTMLElement} The ARIA live region element
   * @private
   */
  createAriaLiveRegion() {
    let liveRegion = document.getElementById('wcagAriaLive');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'wcagAriaLive';
      liveRegion.className = 'visually-hidden';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
  }
  
  /**
   * Show the landing page view
   */
  showLandingPage() {
    if (this.landingPage) {
      this.landingPage.style.display = 'block';
    }
    
    if (this.detailView) {
      this.detailView.style.display = 'none';
    }
    
    // Scroll to top
    this.content.scrollTop = 0;
    
    // Manage focus - move focus to the main heading for keyboard users
    const heroHeading = this.landingPage?.querySelector('#hero-heading');
    if (heroHeading) {
      // Make heading focusable temporarily
      heroHeading.setAttribute('tabindex', '-1');
      // Focus the heading
      heroHeading.focus();
      // Remove tabindex after focus to prevent it from being in tab order
      heroHeading.addEventListener('blur', function removeTabindex() {
        heroHeading.removeAttribute('tabindex');
        heroHeading.removeEventListener('blur', removeTabindex);
      }, { once: true });
    }
    
    // Announce to screen readers
    this.announceContentChange('Showing WCAG Guidelines landing page');
  }
  
  /**
   * Show guideline detail view
   * @param {Object} guideline - The guideline object to display
   */
  showGuidelineDetail(guideline) {
    if (!guideline) {
      console.error('No guideline provided to showGuidelineDetail');
      this.showLandingPage();
      return;
    }
    
    // Hide landing page
    if (this.landingPage) {
      this.landingPage.style.display = 'none';
    }
    
    // Render guideline detail content
    this.renderGuidelineDetail(guideline);
    
    // Show detail view
    if (this.detailView) {
      this.detailView.style.display = 'block';
    }
    
    // Scroll to top
    this.content.scrollTop = 0;
    
    // Manage focus - move focus to the detail view heading for keyboard users
    // This ensures keyboard users know the content has changed
    const detailHeading = this.detailView.querySelector('.guideline-detail-title');
    if (detailHeading) {
      // Make heading focusable temporarily
      detailHeading.setAttribute('tabindex', '-1');
      // Focus the heading
      detailHeading.focus();
      // Remove tabindex after focus to prevent it from being in tab order
      detailHeading.addEventListener('blur', function removeTabindex() {
        detailHeading.removeAttribute('tabindex');
        detailHeading.removeEventListener('blur', removeTabindex);
      }, { once: true });
    }
    
    // Announce to screen readers
    this.announceContentChange(`Showing details for WCAG ${guideline.id}: ${guideline.title}`);
  }
  
  /**
   * Render guideline detail content
   * @param {Object} guideline - The guideline object to render
   */
  renderGuidelineDetail(guideline) {
    if (!this.detailView) {
      console.error('Detail view element not found');
      return;
    }
    
    // Build detail HTML using the same format as the modal
    const anchorId = `guideline-${guideline.id.replace(/\./g, '-')}`;
    const detailHTML = `
      <section id="${anchorId}" class="wcag-guideline-section">
        <div class="guideline-detail-header">
          <h1 class="guideline-detail-title">WCAG ${guideline.id}: ${guideline.title}</h1>
          <div class="guideline-detail-meta">
            <span class="badge principle-badge principle-${guideline.principle.toLowerCase()}">${guideline.principle}</span>
            <span class="level-badge level-${guideline.level}">Level ${guideline.level}</span>
          </div>
        </div>
      
        <div class="guideline-details">
        <!-- Description -->
        <div class="wcag-modal-description">
          <p>${guideline.description}</p>
        </div>

        ${this.renderRedesignedExamples(guideline)}

        ${this.renderUserExperienceImpact(guideline)}

        ${guideline.techniques && guideline.techniques.length > 0 ? this.renderTechniques(guideline.techniques) : ''}

        ${guideline.examples && guideline.examples.userGroups ? this.renderWhoBenefits(guideline.examples.userGroups) : ''}
        </div>
      </section>
    `;
    
    this.detailView.innerHTML = detailHTML;
    const targetSection = this.detailView.querySelector(`#${anchorId}`);
    if (targetSection) {
      targetSection.classList.add('guideline-highlight');
      setTimeout(() => targetSection.classList.remove('guideline-highlight'), 2200);
    }
    
    // Attach interactive listeners
    this.attachCopyButtonListeners();
    this.attachCodeViewerListeners();
  }
  
  /**
   * Render accessibility score comparison section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for score section
   * @private
   */
  renderAccessibilityScore(guideline) {
    const beforeExample = guideline.examples?.before || {};
    const afterExample = guideline.examples?.after || {};
    const beforeHtml = beforeExample.html || '';
    const afterHtml  = afterExample.html || '';

    if (!beforeHtml && !afterHtml) return '';

    // scan.php evaluates one complete source string. Include the companion CSS
    // and JavaScript so style- and behaviour-related barriers affect the score.
    const beforeScore = AccessibilityScorer.score(beforeHtml, beforeExample.css || '', beforeExample.js || '');
    const afterScore  = AccessibilityScorer.score(afterHtml, afterExample.css || '', afterExample.js || '');
    const relevantCheckIds = new Set(AccessibilityScorer.CHECK_IDS_BY_WCAG[guideline.id] || []);
    const delta = afterScore.total - beforeScore.total;

    const renderRing = (result, cardType, labelId) => {
      const radius = 52;
      const circumference = 2 * Math.PI * radius;
      const isInaccessible = cardType === 'before';
      const relevantChecks = result.checks.filter(check => relevantCheckIds.has(check.id));
      // The label identifies the teaching example; the ring reflects its
      // calculated scanner grade instead of always showing red for "before".
      const ringColor = result.color;

      return `
        <div class="wcag-score-card wcag-score-card--${cardType}" role="group" aria-labelledby="${labelId}">
          <div class="wcag-score-card-header">
            <span class="wcag-score-card-badge wcag-score-card-badge--${cardType}">
              ${isInaccessible
                ? '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Inaccessible'
                : '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Accessible'
              }
            </span>
            <span class="wcag-score-example-label" id="${labelId}">${isInaccessible ? 'Before (Bad Code)' : 'After (Good Code)'}</span>
          </div>

          <div class="wcag-score-ring-wrap">
            <svg class="wcag-score-ring-svg" viewBox="0 0 130 130" aria-hidden="true">
              <!-- Track -->
              <circle cx="65" cy="65" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="10"/>
              <!-- Progress ring (animated via JS) -->
              <circle
                class="wcag-score-ring-progress"
                cx="65" cy="65" r="${radius}"
                fill="none"
                stroke="${ringColor}"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
                data-target-score="${result.total}"
                data-circumference="${circumference}"
                transform="rotate(-90 65 65)"
              />
            </svg>
            <div class="wcag-score-center" aria-label="Score: ${result.total} out of 100">
              <span class="wcag-score-number" data-final="${result.total}">0</span>
              <span class="wcag-score-denom">/100</span>
            </div>
          </div>

          <div class="wcag-score-grade" style="--grade-color: ${ringColor}">
            <span class="wcag-score-grade-pill" style="background:${ringColor}20; color:${ringColor}; border-color:${ringColor}40">${result.grade}</span>
          </div>

          <div class="wcag-score-checks" aria-label="Check breakdown">
            ${relevantChecks.map(c => `
              <div class="wcag-score-check-pill wcag-score-check-pill--${c.passed ? 'pass' : 'fail'}" title="${this.escapeHtml(c.description)} (${c.issues} issue${c.issues === 1 ? '' : 's'}; −${c.deduction} points)">
                <span class="wcag-score-check-icon" aria-hidden="true">${c.passed ? '✓' : '✗'}</span>
                <span class="wcag-score-check-name">${this.escapeHtml(c.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    const beforeLabelId = `score-label-before-${Date.now()}`;
    const afterLabelId  = `score-label-after-${Date.now() + 1}`;

    const deltaHtml = delta !== 0 ? `
      <div class="wcag-score-delta" aria-label="Accessibility improvement: ${delta > 0 ? '+' : ''}${delta} points">
        <span class="wcag-score-delta-icon" aria-hidden="true">${delta > 0 ? '▲' : '▼'}</span>
        <span class="wcag-score-delta-value">${delta > 0 ? '+' : ''}${delta} pts improvement</span>
      </div>
    ` : '';

    return `
      <section class="wcag-score-section" aria-labelledby="score-section-heading">
        <h3 class="wcag-modal-section-heading" id="score-section-heading">Accessibility Score</h3>
        <p class="wcag-score-subtitle">Uses the same deduction model as the scanner: errors −5, warnings −2, and info issues −1 (up to 70 points).</p>
        ${deltaHtml}
        <div class="wcag-score-grid">
          ${renderRing(beforeScore, 'before', beforeLabelId)}
          ${renderRing(afterScore,  'after',  afterLabelId)}
        </div>
      </section>
    `;
  }

  /**
   * Attach and trigger score ring animations after content is inserted
   * Animates the SVG ring stroke-dashoffset and the counter number
   * @private
   */
  attachScoreAnimationListeners() {
    const rings = this.detailView.querySelectorAll('.wcag-score-ring-progress');
    const counters = this.detailView.querySelectorAll('.wcag-score-number');

    const DURATION = 900; // ms
    const EASING = t => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = EASING(progress);

      rings.forEach(ring => {
        const circumference = parseFloat(ring.dataset.circumference);
        const targetScore = parseInt(ring.dataset.targetScore, 10);
        const offset = circumference - (eased * (targetScore / 100) * circumference);
        ring.style.strokeDashoffset = offset;
      });

      counters.forEach(counter => {
        const final = parseInt(counter.dataset.final, 10);
        counter.textContent = Math.round(eased * final);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure exact final values
        rings.forEach(ring => {
          const circumference = parseFloat(ring.dataset.circumference);
          const targetScore = parseInt(ring.dataset.targetScore, 10);
          ring.style.strokeDashoffset = circumference - (targetScore / 100) * circumference;
        });
        counters.forEach(counter => {
          counter.textContent = counter.dataset.final;
        });
      }
    };

    // Small delay so the DOM is painted before animation starts
    setTimeout(() => requestAnimationFrame(animate), 80);
  }

  /**
   * Render redesigned examples section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for examples section
   * @private
   */
  renderRedesignedExamples(guideline) {
    if (!guideline.examples || (!guideline.examples.before && !guideline.examples.after)) {
      return '';
    }

    const before = guideline.examples.before;
    const after = guideline.examples.after;

    return `
      <!-- Before and After Comparisons -->
      <h3 class="wcag-modal-section-heading">Before and After Comparisons</h3>
      
      <!-- Code Comparison -->
      <div class="wcag-modal-comparison-grid">
        ${this.renderCodeViewer('Before: Code', before, 'before', guideline.id)}

        ${this.renderCodeViewer('After: Code', after, 'after', guideline.id)}
      </div>

      <!-- Output Comparison (if available) -->
      ${this.renderOutputComparison(before, after)}
    `;
  }

  /**
   * Render user experience impact section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for UX impact section
   * @private
   */
  renderUserExperienceImpact(guideline) {
    if (!guideline.examples || (!guideline.examples.before && !guideline.examples.after)) {
      return '';
    }

    const before = guideline.examples.before;
    const after = guideline.examples.after;

    return `
      <!-- Impact Comparison -->
      <div class="wcag-modal-impact-box full-width">
        <div class="wcag-modal-impact-header">
          <span class="wcag-modal-impact-label">User Experience Impact</span>
        </div>
        <div class="wcag-modal-impact-content-combined">
          ${before && before.context ? `
          <div class="impact-column before">
            <div class="impact-sub-label">Before</div>
            <p class="wcag-modal-impact-text">${this.highlightInaccessible(before.context)}</p>
          </div>
          ` : ''}
          
          ${before && before.context && after && after.context ? '<div class="impact-vertical-divider"></div>' : ''}

          ${after && after.context ? `
          <div class="impact-column after">
            <div class="impact-sub-label">After</div>
            <p class="wcag-modal-impact-text">${this.highlightAccessible(after.context)}</p>
          </div>
          ` : ''}
        </div>
      </div>

      ${this.renderKeySummary(guideline)}
    `;
  }

  /**
   * Render tabbed HTML/CSS code viewer
   * @param {string} title - Visible title for the code viewer
   * @param {Object} example - Example object with separated HTML/CSS code
   * @param {string} variant - Variant identifier
   * @param {string} guidelineId - Guideline ID for unique controls
   * @returns {string} HTML string for the code viewer
   * @private
   */
  renderCodeViewer(title, example, variant, guidelineId) {
    const sourceCodeByGuideline = {
      '1.2.2': `wcag-1-2-2-sample.mp4 (video/mp4)

wcag-1-2-2-sample.vtt (text/vtt)
WEBVTT

NOTE WCAG 1.2.2 sample captions for prerecorded audio.

00:00:00.000 --> 00:00:02.500
[Audio track starts]
A short sample video is playing.

00:00:02.500 --> 00:00:05.000
[Audio continues]
Captions stay synchronized with the video timeline.`,
      '1.4.2': 'js-variables-lesson.wav (audio/wav)'
    };
    const sourceCode = variant === 'after' ? sourceCodeByGuideline[guidelineId] || '' : '';

    if (!example?.html && !example?.css && !sourceCode) {
      return '';
    }

    const safeBaseId = this.createSafeId(`wcag-${guidelineId}-${variant}`);
    const languages = [
      { key: 'html', label: 'HTML', code: example.html || '' },
      ...(example.css && example.css.trim() ? [{ key: 'css', label: 'CSS', code: example.css }] : []),
      ...(sourceCode ? [{ key: 'src', label: 'SRC', code: sourceCode }] : [])
    ].filter(language => language.code);

    if (languages.length === 0) {
      return '';
    }

    return `
      <div class="wcag-modal-code-box wcag-code-viewer" data-code-viewer>
        <div class="wcag-code-viewer-toolbar">
          <span class="wcag-modal-code-label">${this.escapeHtml(title)}</span>
          <div class="wcag-code-tabs" role="tablist" aria-label="${this.escapeHtml(title)} languages">
            ${languages.map((language, index) => {
              const tabId = `${safeBaseId}-${language.key}-tab`;
              const panelId = `${safeBaseId}-${language.key}-panel`;
              return `
                <button
                  type="button"
                  class="wcag-code-tab${index === 0 ? ' active' : ''}"
                  id="${tabId}"
                  role="tab"
                  aria-selected="${index === 0 ? 'true' : 'false'}"
                  aria-controls="${panelId}"
                  data-code-tab="${language.key}">
                  ${language.label}
                </button>
              `;
            }).join('')}
          </div>
        </div>
        <div class="wcag-code-panels">
          ${languages.map((language, index) => {
            const tabId = `${safeBaseId}-${language.key}-tab`;
            const panelId = `${safeBaseId}-${language.key}-panel`;
            return `
              <div
                class="wcag-code-panel${index === 0 ? ' active' : ''}"
                id="${panelId}"
                role="tabpanel"
                aria-labelledby="${tabId}"
                data-code-panel="${language.key}"
                ${index === 0 ? '' : 'hidden'}>
                <div class="wcag-modal-code-content" tabindex="0" aria-label="${language.label} source code">
                  ${this.formatCodeWithLineNumbers(language.code, language.key)}
                </div>
                <textarea class="wcag-code-source" data-code-source="${language.key}" hidden readonly>${this.escapeTextarea(language.code)}</textarea>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Format code with line numbers
   * @param {string} code - The code to format
   * @param {string} language - Code language
   * @returns {string} HTML string with line numbers
   * @private
   */
  formatCodeWithLineNumbers(code, language = 'html') {
    const lines = code.trim().split('\n');
    return lines.map((line, index) => `
      <div class="wcag-modal-code-line">
        <span class="wcag-modal-line-number">${index + 1}</span>
        <span class="wcag-modal-line-code">${this.highlightCodeLine(line, language)}</span>
      </div>
    `).join('');
  }

  /**
   * Highlight a single line of code
   * @param {string} line - Source line to highlight
   * @param {string} language - Code language
   * @returns {string} Highlighted HTML
   * @private
   */
  highlightCodeLine(line, language) {
    if (language === 'css') {
      return this.highlightCssLine(line);
    }

    return this.highlightHtmlLine(line);
  }

  /**
   * Highlight a line of HTML source
   * @param {string} line - Source line to highlight
   * @returns {string} Highlighted HTML
   * @private
   */
  highlightHtmlLine(line) {
    const tokenPattern = /(<!--.*?-->)|(<\/?)([A-Za-z][\w:-]*)|(\s+)([A-Za-z_:][\w:.-]*)(=)("[^"]*"|'[^']*'|[^\s>]+)|(&[A-Za-z#0-9]+;)|([<>/=])/g;
    return this.highlightWithPattern(line, tokenPattern, match => {
      if (match[1]) {
        return `<span class="wcag-code-token token-comment">${this.escapeHtml(match[1])}</span>`;
      }

      if (match[2] && match[3]) {
        return `${this.escapeHtml(match[2])}<span class="wcag-code-token token-tag">${this.escapeHtml(match[3])}</span>`;
      }

      if (match[4] && match[5] && match[6]) {
        const value = match[7] || '';
        return `${this.escapeHtml(match[4])}<span class="wcag-code-token token-attr">${this.escapeHtml(match[5])}</span>${this.escapeHtml(match[6])}<span class="wcag-code-token token-string">${this.escapeHtml(value)}</span>`;
      }

      if (match[8]) {
        return `<span class="wcag-code-token token-entity">${this.escapeHtml(match[8])}</span>`;
      }

      return `<span class="wcag-code-token token-punctuation">${this.escapeHtml(match[9])}</span>`;
    });
  }

  /**
   * Highlight a line of CSS source
   * @param {string} line - Source line to highlight
   * @returns {string} Highlighted HTML
   * @private
   */
  highlightCssLine(line) {
    const tokenPattern = /(\/\*.*?\*\/)|("(?:\\.|[^"])*"|'(?:\\.|[^'])*')|(#[0-9a-fA-F]{3,8})|(\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b)|(\b-?[_a-zA-Z][\w-]*)(?=\s*:)|([{}:;(),.])/g;
    return this.highlightWithPattern(line, tokenPattern, match => {
      if (match[1]) {
        return `<span class="wcag-code-token token-comment">${this.escapeHtml(match[1])}</span>`;
      }

      if (match[2]) {
        return `<span class="wcag-code-token token-string">${this.escapeHtml(match[2])}</span>`;
      }

      if (match[3] || match[4]) {
        return `<span class="wcag-code-token token-value">${this.escapeHtml(match[3] || match[4])}</span>`;
      }

      if (match[5]) {
        return `<span class="wcag-code-token token-property">${this.escapeHtml(match[5])}</span>`;
      }

      return `<span class="wcag-code-token token-punctuation">${this.escapeHtml(match[6])}</span>`;
    });
  }

  /**
   * Apply syntax highlighting with a token pattern
   * @param {string} line - Source line to highlight
   * @param {RegExp} pattern - Token pattern
   * @param {Function} renderToken - Token renderer
   * @returns {string} Highlighted HTML
   * @private
   */
  highlightWithPattern(line, pattern, renderToken) {
    let highlighted = '';
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(line)) !== null) {
      highlighted += this.escapeHtml(line.slice(lastIndex, match.index));
      highlighted += renderToken(match);
      lastIndex = pattern.lastIndex;
    }

    highlighted += this.escapeHtml(line.slice(lastIndex));
    return highlighted;
  }
  
  /**
   * Render output comparison section
   * @param {Object} before - Before example object
   * @param {Object} after - After example object
   * @returns {string} HTML string for output comparison
   * @private
   */
  renderOutputComparison(before, after) {
    // Only render if we have HTML to display
    if (!before?.html && !after?.html) {
      return '';
    }

    const labelSeed = Date.now();
    const beforeOutputLabelId = `wcag-before-output-label-${labelSeed}`;
    const afterOutputLabelId = `wcag-after-output-label-${labelSeed}`;
    // Shared group ID so both iframes can be equalized after loading
    const pairGroupId = `output-pair-${labelSeed}`;

    return `
      <!-- Visual Output Comparison -->
      <div class="wcag-modal-comparison-grid" data-iframe-group="${pairGroupId}">
        ${before?.html ? `
        <div class="wcag-modal-output-box" role="group" aria-labelledby="${beforeOutputLabelId}">
          <div class="wcag-modal-output-header">
            <span class="wcag-modal-output-label">Before: Output</span>
          </div>
          <div class="wcag-modal-output-content">
            <span id="${beforeOutputLabelId}" class="visually-hidden">Before output preview</span>
            <div class="wcag-modal-output-preview">
              ${this.renderVisualPreview(before.html, before.css, before.js, 'before', pairGroupId)}
            </div>
          </div>
        </div>
        ` : ''}

        ${after?.html ? `
        <div class="wcag-modal-output-box" role="group" aria-labelledby="${afterOutputLabelId}">
          <div class="wcag-modal-output-header">
            <span class="wcag-modal-output-label">After: Output</span>
          </div>
          <div class="wcag-modal-output-content">
            <span id="${afterOutputLabelId}" class="visually-hidden">After output preview</span>
            <div class="wcag-modal-output-preview">
              ${this.renderVisualPreview(after.html, after.css, after.js, 'after', pairGroupId)}
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Render visual preview in iframe
   * @param {string} html - HTML code
   * @param {string} css - CSS code
   * @param {string} js - JavaScript code
   * @param {string} type - Type identifier ('before' or 'after')
   * @returns {string} HTML string for iframe preview
   * @private
   */
  renderVisualPreview(html, css, js, type, pairGroupId) {
    // Create a unique ID for this preview
    const previewId = `preview-${type}-${Date.now()}`;
    
    // Get the base URL for resolving relative paths
    const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    
    // Build the complete HTML document for the iframe
    const iframeContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="${baseUrl}">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        body {
            padding: 20px;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        ${css || ''}
    </style>
</head>
<body>
    ${html}
    ${js ? `<script>${js}<\/script>` : ''}
    <script>
      // Report natural content height to parent for equalization
      function reportHeight() {
        // Reset any forced height before measuring
        document.documentElement.style.height = 'auto';
        document.body.style.height = 'auto';
        const height = document.body.scrollHeight || document.body.offsetHeight;
        window.parent.postMessage({
          type: 'resize-iframe',
          id: '${previewId}',
          groupId: '${pairGroupId || ''}',
          height: height
        }, '*');
      }
      if (document.readyState === 'complete') {
        reportHeight();
      } else {
        window.addEventListener('load', reportHeight);
      }
    <\/script>
</body>
</html>`;

    // Escape for srcdoc attribute
    const escapedContent = iframeContent
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');

    // Return iframe element
    return `
      <iframe 
        id="${previewId}"
        class="wcag-visual-preview-iframe"
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms"
        title="${type === 'before' ? 'Before code output preview' : 'After code output preview'}"
        srcdoc="${escapedContent}"
        style="width: 100%; border: none; display: block; background: white;">
      </iframe>
    `;
  }
  
  /**
   * Highlight inaccessible terms in text
   * @param {string} text - Text to highlight
   * @returns {string} HTML string with highlighted terms
   * @private
   */
  highlightInaccessible(text) {
    // Highlight key problematic terms in red
    return text.replace(/(image|filename|no meaningful information|inaccessible|cannot understand|lost)/gi, 
      '<span class="wcag-modal-impact-highlight">$1</span>');
  }
  
  /**
   * Highlight accessible terms in text
   * @param {string} text - Text to highlight
   * @returns {string} HTML string with highlighted terms
   * @private
   */
  highlightAccessible(text) {
    // Highlight key positive terms in green
    return text.replace(/(descriptive|accessible|clear|meaningful|understand|provides context)/gi, 
      '<span class="wcag-modal-impact-highlight accessible">$1</span>');
  }
  
  /**
   * Render key summary section
   * @param {Object} guideline - The guideline object
   * @returns {string} HTML string for key summary
   * @private
   */
  renderKeySummary(guideline) {
    if (!guideline.explanation && !guideline.examples.keySummary) {
      return '';
    }

    // Generate key summary points from explanation or use provided summary
    const summaryPoints = guideline.examples.keySummary || this.generateSummaryPoints(guideline);

    if (!summaryPoints || summaryPoints.length === 0) {
      return '';
    }

    return `
      <h3 class="wcag-modal-section-heading">Key Summary of Accessible Code</h3>
      <div class="wcag-modal-key-summary">
        <ul class="wcag-modal-summary-list">
          ${summaryPoints.map(point => `<li class="wcag-modal-summary-item">${point}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  /**
   * Generate summary points for a guideline
   * @param {Object} guideline - The guideline object
   * @returns {Array<string>} Array of summary points
   * @private
   */
  generateSummaryPoints(guideline) {
    // Default summary points based on guideline ID
    const summaries = {
      '1.1.1': [
        'Use descriptive alt text that conveys the purpose of the image',
        'For decorative images, use empty alt attribute (alt="")',
        'Avoid redundant phrases like "image of" or "picture of"',
        'Keep alt text concise but meaningful (typically under 150 characters)',
        'For complex images, provide longer descriptions using aria-describedby'
      ]
    };

    return summaries[guideline.id] || [];
  }
  
  /**
   * Render techniques section
   * @param {Array<string>} techniques - Array of technique codes
   * @returns {string} HTML string for techniques section
   * @private
   */
  renderTechniques(techniques) {
    // Split techniques into two columns
    const half = Math.ceil(techniques.length / 2);
    const leftColumn = techniques.slice(0, half);
    const rightColumn = techniques.slice(half);

    return `
      <h3 class="wcag-modal-section-heading">Techniques</h3>
      <div class="wcag-modal-techniques">
        <div class="wcag-modal-techniques-grid">
          <ul class="wcag-modal-summary-list">
            ${leftColumn.map(tech => `<li class="wcag-modal-technique-item">${tech}</li>`).join('')}
          </ul>
          ${rightColumn.length > 0 ? `
          <ul class="wcag-modal-summary-list">
            ${rightColumn.map(tech => `<li class="wcag-modal-technique-item">${tech}</li>`).join('')}
          </ul>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  /**
   * Render who benefits section
   * @param {Array<string>} userGroups - Array of user group names
   * @returns {string} HTML string for who benefits section
   * @private
   */
  renderWhoBenefits(userGroups) {
    if (!userGroups || userGroups.length === 0) {
      return '';
    }

    return `
      <div class="wcag-modal-benefits">
        <h4 class="wcag-modal-benefits-heading">Who Benefits from This</h4>
        <div class="wcag-modal-benefits-tags">
          ${userGroups.map(group => `<span class="wcag-modal-benefit-tag">${group}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Attach copy button event listeners
   * @private
   */
  attachCopyButtonListeners() {
    const copyButtons = this.detailView.querySelectorAll('.wcag-modal-copy-btn');
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-copy-target');
        const codeElement = document.getElementById(targetId);
        
        if (codeElement) {
          const codeText = Array.from(codeElement.querySelectorAll('.wcag-modal-line-code'))
            .map(line => line.textContent)
            .join('\n');
          
          navigator.clipboard.writeText(codeText).then(() => {
            const copyText = this.querySelector('.copy-text');
            const originalText = copyText.textContent;
            
            this.classList.add('copied');
            copyText.textContent = 'Copied!';
            
            setTimeout(() => {
              this.classList.remove('copied');
              copyText.textContent = originalText;
            }, 2000);
          });
        }
      });
    });
  }

  /**
   * Attach tab switching listeners for code viewers
   * @private
   */
  attachCodeViewerListeners() {
    const viewers = this.detailView.querySelectorAll('[data-code-viewer]');

    viewers.forEach(viewer => {
      const tabs = Array.from(viewer.querySelectorAll('[data-code-tab]'));
      const panels = Array.from(viewer.querySelectorAll('[data-code-panel]'));

      const activateTab = selectedTab => {
        const selectedLanguage = selectedTab.getAttribute('data-code-tab');

        tabs.forEach(tab => {
          const isSelected = tab === selectedTab;
          tab.classList.toggle('active', isSelected);
          tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        });

        panels.forEach(panel => {
          const isSelected = panel.getAttribute('data-code-panel') === selectedLanguage;
          panel.classList.toggle('active', isSelected);
          panel.hidden = !isSelected;
        });
      };

      tabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1');

        tab.addEventListener('click', () => {
          activateTab(tab);
        });

        tab.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            return;
          }

          event.preventDefault();
          const currentIndex = tabs.indexOf(tab);
          let nextIndex = currentIndex;

          if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % tabs.length;
          } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          } else if (event.key === 'Home') {
            nextIndex = 0;
          } else if (event.key === 'End') {
            nextIndex = tabs.length - 1;
          }

          tabs[nextIndex].focus();
          activateTab(tabs[nextIndex]);
        });
      });
    });
  }
  
  /**
   * Announce content change to screen readers
   * @param {string} message - The message to announce
   */
  announceContentChange(message) {
    if (!this.ariaLiveRegion) {
      return;
    }
    
    // Clear previous message
    this.ariaLiveRegion.textContent = '';
    
    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      this.ariaLiveRegion.textContent = message;
      
      // Clear message after announcement
      setTimeout(() => {
        this.ariaLiveRegion.textContent = '';
      }, 1000);
    }, 100);
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Escape code for hidden textarea storage
   * @param {string} text - Text to escape
   * @returns {string} Escaped textarea text
   * @private
   */
  escapeTextarea(text) {
    return this.escapeHtml(text);
  }

  /**
   * Create a safe DOM id fragment
   * @param {string} value - Source value
   * @returns {string} Safe id
   * @private
   */
  createSafeId(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }
}

/**
 * WCAGApp
 * 
 * Main application controller that coordinates all components and manages
 * the application lifecycle. Handles initialization, data loading, and
 * event coordination between sidebar, main content, and URL state.
 */
class WCAGApp {
  /**
   * Create a new WCAGApp instance
   * @param {Object} config - Configuration object
   * @param {string} config.apiEndpoint - API endpoint for fetching guidelines
   * @param {string} config.sidebarElementId - ID of the sidebar element
   * @param {string} config.mainContentElementId - ID of the main content element
   * @param {string} config.sidebarToggleId - ID of the sidebar toggle button
   */
  constructor(config) {
    this.config = {
      apiEndpoint: config.apiEndpoint || 'api/get-wcag-guidelines.php',
      sidebarElementId: config.sidebarElementId || 'wcagSidebar',
      mainContentElementId: config.mainContentElementId || 'wcagMainContent',
      sidebarToggleId: config.sidebarToggleId || 'sidebarToggle'
    };
    
    // Component instances
    this.dataManager = null;
    this.urlStateManager = null;
    this.sidebar = null;
    this.mainContent = null;
    
    // State
    this.initialized = false;
    this.loading = false;
  }
  
  /**
   * Initialize the application
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      console.warn('[WCAGApp] Application already initialized');
      return;
    }
    
    try {
      console.log('[WCAGApp] Starting initialization');
      
      // Initialize data manager
      this.dataManager = new WCAGDataManager(this.config.apiEndpoint);
      console.log('[WCAGApp] Data manager created');
      
      // Initialize main content component
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (!mainContentElement) {
        throw new Error(`Main content element #${this.config.mainContentElementId} not found`);
      }
      this.mainContent = new WCAGMainContent(mainContentElement);
      console.log('[WCAGApp] Main content component created');
      
      // Initialize sidebar component
      const sidebarElement = document.getElementById(this.config.sidebarElementId);
      if (!sidebarElement) {
        throw new Error(`Sidebar element #${this.config.sidebarElementId} not found`);
      }
      this.sidebar = new WCAGSidebar(
        sidebarElement, 
        this.handleGuidelineSelect.bind(this),
        this.handlePrincipleToggle.bind(this)
      );
      console.log('[WCAGApp] Sidebar component created');
      
      // Initialize URL state manager
      this.urlStateManager = new URLStateManager(this.handleURLStateChange.bind(this));
      console.log('[WCAGApp] URL state manager created');
      
      // Setup sidebar toggle button
      this.setupSidebarToggle();
      
      // Setup iframe auto-resize listener
      this.setupIframeResizeListener();
      
      // Load initial data
      await this.loadData();
      
      // Handle initial URL state
      this.handleInitialState();
      
      this.initialized = true;
      console.log('[WCAGApp] Initialization complete');
      
    } catch (error) {
      console.error('[WCAGApp] Initialization error:', error);
      this.showError(error.message);
      throw error;
    }
  }
  
  /**
   * Load guidelines data from API
   * @returns {Promise<void>}
   * @private
   */
  async loadData() {
    if (this.loading) {
      console.warn('[WCAGApp] Data loading already in progress');
      return;
    }
    
    this.loading = true;
    
    try {
      console.log('[WCAGApp] Fetching guidelines...');
      
      // Show loading state
      this.showLoading();
      
      // Fetch guidelines
      const guidelines = await this.dataManager.fetchGuidelines();
      console.log('[WCAGApp] Guidelines fetched:', guidelines.length);
      
      // Render sidebar with guidelines
      const guidelinesByPrinciple = this.dataManager.getGuidelinesByPrinciple();
      this.sidebar.render(guidelinesByPrinciple);
      console.log('[WCAGApp] Sidebar rendered');
      
      // Hide loading state
      this.hideLoading();
      
      this.loading = false;
      
    } catch (error) {
      console.error('[WCAGApp] Error loading data:', error);
      this.loading = false;
      this.showError(`Failed to load guidelines: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Handle initial page state based on URL parameters
   * @private
   */
  handleInitialState() {
    const initialGuideline = this.urlStateManager.getCurrentGuideline();
    
    if (initialGuideline) {
      console.log('[WCAGApp] Initial guideline from URL:', initialGuideline);
      
      // Display guideline details
      const guideline = this.dataManager.getGuideline(initialGuideline);
      if (guideline) {
        // Set active guideline in sidebar
        this.sidebar.setActiveGuideline(initialGuideline);
        this.mainContent.showGuidelineDetail(guideline);
      } else {
        // Invalid guideline ID - show error notification and landing page
        console.warn('[WCAGApp] Invalid guideline ID from URL:', initialGuideline);
        this.showInvalidGuidelineNotification(initialGuideline);
        this.mainContent.showLandingPage();
        this.urlStateManager.clearURL();
      }
    } else {
      console.log('[WCAGApp] No initial guideline, showing landing page');
      this.mainContent.showLandingPage();
    }
  }
  
  /**
   * Show notification for invalid guideline ID
   * @param {string} guidelineId - The invalid guideline ID
   * @private
   */
  showInvalidGuidelineNotification(guidelineId) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'wcag-notification alert alert-warning';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <div class="flex-grow-1">
          <strong>Guideline Not Found</strong>
          <p class="mb-0">The guideline "${this.escapeHtml(guidelineId)}" does not exist. Please select a guideline from the sidebar.</p>
        </div>
        <button type="button" class="btn-close" aria-label="Close notification"></button>
      </div>
    `;
    
    // Insert notification at the top of main content
    const mainContentElement = document.getElementById(this.config.mainContentElementId);
    if (mainContentElement) {
      mainContentElement.insertBefore(notification, mainContentElement.firstChild);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);
      
      // Add close button functionality
      const closeButton = notification.querySelector('.btn-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
    }
  }
  
  /**
   * Handle guideline selection from sidebar
   * @param {string} guidelineId - The selected guideline ID
   * @private
   */
  handleGuidelineSelect(guidelineId) {
    console.log('[WCAGApp] Guideline selected:', guidelineId);
    
    // Update sidebar active state
    this.sidebar.setActiveGuideline(guidelineId);
    
    // Update URL
    this.urlStateManager.updateURL(guidelineId);
    
    // Display guideline details
    const guideline = this.dataManager.getGuideline(guidelineId);
    if (guideline) {
      this.mainContent.showGuidelineDetail(guideline);
    } else {
      console.error('[WCAGApp] Guideline not found:', guidelineId);
      this.mainContent.showLandingPage();
    }
    
    // Close mobile sidebar after selection
    if (window.innerWidth < 768 && this.sidebar.sidebar.classList.contains('sidebar-open')) {
      this.sidebar.toggleSidebar();
    }
  }
  
  /**
   * Handle principle expansion/collapse from sidebar
   * @param {string} principleName - The principle name that was toggled
   * @param {boolean} isExpanded - Whether the principle is now expanded
   * @private
   */
  handlePrincipleToggle(principleName, isExpanded) {
    const action = isExpanded ? 'expanded' : 'collapsed';
    this.mainContent.announceContentChange(`${principleName} principle ${action}`);
  }
  
  /**
   * Handle URL state changes (browser back/forward navigation)
   * @param {string|null} guidelineId - The guideline ID from URL
   * @private
   */
  handleURLStateChange(guidelineId) {
    console.log('[WCAGApp] URL state changed:', guidelineId);
    
    if (guidelineId) {
      // Set active guideline in sidebar
      this.sidebar.setActiveGuideline(guidelineId);
      
      // Display guideline details
      const guideline = this.dataManager.getGuideline(guidelineId);
      if (guideline) {
        this.mainContent.showGuidelineDetail(guideline);
      } else {
        console.warn('[WCAGApp] Guideline not found:', guidelineId);
        this.mainContent.showLandingPage();
        this.sidebar.setActiveGuideline(null);
      }
    } else {
      // No guideline selected, show landing page
      this.sidebar.setActiveGuideline(null);
      this.mainContent.showLandingPage();
    }
  }
  
  /**
   * Setup sidebar toggle button event listener
   * @private
   */
  setupSidebarToggle() {
    // 1. Mobile Sidebar Toggle (Offcanvas)
    const mobileToggleButton = document.getElementById(this.config.sidebarToggleId);
    if (mobileToggleButton) {
      mobileToggleButton.addEventListener('click', () => {
        this.sidebar.toggleSidebar();
      });
      console.log('[WCAGApp] Mobile sidebar toggle configured');
    }
    
    // 2. Desktop Sidebar Collapse Toggle
    const collapseButton = document.getElementById('sidebarCollapseBtn');
    if (collapseButton) {
      collapseButton.addEventListener('click', () => {
        const isCollapsed = this.sidebar.toggleCollapse();
        this.mainContent.announceContentChange(`Sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`);
      });
      console.log('[WCAGApp] Desktop sidebar collapse toggle configured');
    }
  }
  
  /**
   * Setup iframe auto-resize listener
   * Listens for resize messages from iframes and adjusts their height
   * @private
   */
  setupIframeResizeListener() {
    // Track heights reported per group so we can equalize once both iframes report in
    const groupHeights = {};

    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'resize-iframe') {
        const { id, groupId, height } = event.data;
        const iframe = document.getElementById(id);
        if (!iframe) return;

        if (groupId) {
          // Store this iframe's natural height in the group tracker
          if (!groupHeights[groupId]) groupHeights[groupId] = {};
          groupHeights[groupId][id] = height;

          // Once we have heights for all iframes in this group, equalize them
          const group = groupHeights[groupId];
          const ids = Object.keys(group);
          // Find all iframes belonging to this group via the parent grid element
          const grid = document.querySelector(`[data-iframe-group="${groupId}"]`);
          if (grid) {
            const groupIframes = grid.querySelectorAll('.wcag-visual-preview-iframe');
            if (ids.length >= groupIframes.length) {
              // All iframes reported — find the max height and apply to all
              const maxHeight = Math.max(...Object.values(group));
              groupIframes.forEach(el => {
                el.style.height = maxHeight + 'px';
              });
              console.log(`[WCAGApp] Equalized iframe group ${groupId} to ${maxHeight}px`);
            }
          }
        } else {
          // No group — just resize this iframe to its content height
          iframe.style.height = height + 'px';
          console.log(`[WCAGApp] Resized iframe ${id} to ${height}px`);
        }
      }
    });
    console.log('[WCAGApp] Iframe resize listener configured');
  }
  
  /**
   * Show loading state
   * @private
   */
  showLoading() {
    console.log('[WCAGApp] Showing loading state');
    
    // Create or get loading indicator element
    let loadingIndicator = document.getElementById('wcagLoadingIndicator');
    
    if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'wcagLoadingIndicator';
      loadingIndicator.className = 'wcag-loading-indicator';
      loadingIndicator.setAttribute('role', 'status');
      loadingIndicator.setAttribute('aria-live', 'polite');
      loadingIndicator.innerHTML = `
        <div class="loading-content">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading guidelines...</span>
          </div>
          <p class="loading-text">Loading WCAG guidelines...</p>
        </div>
      `;
      
      // Insert at the beginning of main content
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (mainContentElement) {
        mainContentElement.insertBefore(loadingIndicator, mainContentElement.firstChild);
      }
    }
    
    // Show the loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Hide landing page and detail view while loading
    if (this.mainContent) {
      if (this.mainContent.landingPage) {
        this.mainContent.landingPage.style.display = 'none';
      }
      if (this.mainContent.detailView) {
        this.mainContent.detailView.style.display = 'none';
      }
    }
  }
  
  /**
   * Hide loading state
   * @private
   */
  hideLoading() {
    console.log('[WCAGApp] Hiding loading state');
    
    const loadingIndicator = document.getElementById('wcagLoadingIndicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   * @private
   */
  showError(message) {
    console.error('[WCAGApp] Error:', message);
    
    // Hide loading indicator
    this.hideLoading();
    
    // Create or get error container
    let errorContainer = document.getElementById('wcagErrorContainer');
    
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'wcagErrorContainer';
      errorContainer.className = 'wcag-error-container';
      
      const mainContentElement = document.getElementById(this.config.mainContentElementId);
      if (mainContentElement) {
        mainContentElement.insertBefore(errorContainer, mainContentElement.firstChild);
      }
    }
    
    // Display error with retry functionality
    errorContainer.innerHTML = `
      <div class="error-state" role="alert">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="error-title">Error Loading Guidelines</h3>
        <p class="error-message">${this.escapeHtml(message)}</p>
        <div class="error-actions">
          <button class="btn btn-primary retry-button" id="wcagRetryButton">
            <i class="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
      </div>
    `;
    
    // Show error container
    errorContainer.style.display = 'block';
    
    // Hide landing page and detail view
    if (this.mainContent) {
      if (this.mainContent.landingPage) {
        this.mainContent.landingPage.style.display = 'none';
      }
      if (this.mainContent.detailView) {
        this.mainContent.detailView.style.display = 'none';
      }
    }
    
    // Attach retry button event listener
    const retryButton = document.getElementById('wcagRetryButton');
    if (retryButton) {
      retryButton.addEventListener('click', async () => {
        console.log('[WCAGApp] Retry button clicked');
        errorContainer.style.display = 'none';
        await this.loadData();
        
        // After successful retry, handle initial state
        if (!this.dataManager.error) {
          this.handleInitialState();
        }
      });
    }
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   * @private
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
