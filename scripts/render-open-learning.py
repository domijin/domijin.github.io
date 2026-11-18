#!/usr/bin/env python3
"""Render the Open Learning draft from its Markdown source, using reader blocks.

Run this and regen-book-content.py after editing the draft. No third-party packages.
This renderer supports this article's Markdown subset; it is not a general parser.
"""
from pathlib import Path
import html
import importlib.util
import json
import re

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('reader', ROOT / 'scripts/regen-book-content.py')
reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reader)
SOURCE = ROOT / 'articles/blog/open-learning.md'
URL = 'https://domij.info/articles/blog/open-learning.html'
DESCRIPTION = ('A working hypothesis for open learning: four human capabilities and three independent '
               'experience principles, connecting individual mastery with voluntary collective discovery.')


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)


def render(block):
    if block.startswith(('<figure', '<details', '<pre')):
        return block
    if block.startswith('### '):
        return '<h3>' + inline(block[4:]) + '</h3>'
    if block.startswith('## '):
        return '<h2>' + inline(block[3:]) + '</h2>'
    if block.startswith('> '):
        return '<blockquote><p>' + inline(block[2:]) + '</p></blockquote>'
    if block.startswith('• '):
        return '<ul>' + ''.join('<li>' + inline(line[2:]) + '</li>' for line in block.splitlines()) + '</ul>'
    if block.startswith('|'):
        rows = [line.strip().strip('|').split('|') for line in block.splitlines()]
        def row(cells, tag):
            scope = ' scope="col"' if tag == 'th' else ''
            return '<tr>' + ''.join(f'<{tag}{scope}>{inline(c.strip())}</{tag}>' for c in cells) + '</tr>'
        return '<div class="table-scroll"><table><thead>' + row(rows[0], 'th') + '</thead><tbody>' + ''.join(row(r, 'td') for r in rows[2:]) + '</tbody></table></div>'
    return '<p>' + inline(block) + '</p>'


def main():
    source = SOURCE.read_text()
    if '<!-- learning-' in source:
        raise ValueError('Unresolved draft placeholder')
    title, date, _, _ = reader.extract_meta(source, str(SOURCE))
    body = '\n'.join(render(b) for b in reader.split_blocks('\n'.join(source.splitlines()[4:])))
    schema = json.dumps({
        '@context': 'https://schema.org', '@type': 'Article', 'headline': title,
        'description': DESCRIPTION, 'url': URL, 'inLanguage': 'en-GB',
        'creativeWorkStatus': 'Working draft', 'dateCreated': '2026-11-17',
        'dateModified': '2026-11-17', 'author': {'@type': 'Person', 'name': 'Domi Jin'},
    }, ensure_ascii=False)
    template = (ROOT / 'scripts/templates/working-draft.html').read_text()
    values = {'TITLE': html.escape(title), 'DATE': date, 'URL': URL,
              'DESCRIPTION': html.escape(DESCRIPTION), 'SCHEMA': schema, 'BODY': body}
    for key, value in values.items():
        template = template.replace('{{' + key + '}}', value)
    SOURCE.with_suffix('.html').write_text(template)
    (ROOT / 'articles/open-learning.css').write_text((ROOT / 'green-app/src/app/open-learning.css').read_text())
    print('Rendered', SOURCE.with_suffix('.html').relative_to(ROOT))


if __name__ == '__main__':
    main()
