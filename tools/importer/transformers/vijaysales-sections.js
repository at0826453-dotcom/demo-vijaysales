/* eslint-disable */
/* global WebImporter */

/**
 * Vijay Sales sections transformer.
 *
 * beforeTransform: inserts <hr> section breaks (while the parser target
 * elements still exist) before every non-first section from
 * payload.template.sections. Every inserted <hr> is tagged with a temporary
 * data-excat-section-id. A styled first section gets a temporary marked <hr>
 * as well. For styled sections, an end marker is placed directly after the
 * section element so Section Metadata lands at the end of the section even
 * when a parser later replaces that element.
 *
 * afterTransform: walks sections in reverse, replaces each end marker with a
 * Section Metadata block, removes the marker attributes, and drops the first
 * section's temporary <hr>.
 */

const MARKER = 'data-excat-section-id';
const END_MARKER = 'data-excat-section-end';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector in this DOM implementation; try the next one
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && template.sections) || [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el || !el.parentNode) continue;

      if (section.style) {
        const end = doc.createElement('div');
        end.setAttribute(END_MARKER, section.id);
        el.after(end);
      }

      if (i > 0 || section.style) {
        const hr = doc.createElement('hr');
        hr.setAttribute(MARKER, section.id);
        el.before(hr);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const hr = element.querySelector(`hr[${MARKER}="${section.id}"]`);

      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        const end = element.querySelector(`[${END_MARKER}="${section.id}"]`);
        if (end) {
          end.replaceWith(metadata);
        } else {
          const el = findSectionElement(element, section);
          if (el) {
            el.after(metadata);
          } else {
            // Fall back to the start of the next section, or the end of the content.
            let next = null;
            for (let j = i + 1; j < sections.length && !next; j += 1) {
              next = element.querySelector(`hr[${MARKER}="${sections[j].id}"]`);
            }
            if (next) next.before(metadata);
            else if (hr) element.append(metadata);
          }
        }
      }

      if (hr) {
        if (i === 0) hr.remove();
        else hr.removeAttribute(MARKER);
      }
    }

    // Safety: drop any stray markers.
    element.querySelectorAll(`[${END_MARKER}]`).forEach((m) => m.remove());
    element.querySelectorAll(`[${MARKER}]`).forEach((m) => m.removeAttribute(MARKER));
  }
}
