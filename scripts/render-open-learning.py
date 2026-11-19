#!/usr/bin/env python3
"""Render Open Learning working drafts from their Markdown source, using reader blocks.

Run this and regen-book-content.py after editing the drafts. No third-party packages.
This renderer supports these articles' Markdown subset; it is not a general parser.
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

PAGES = [
    {
        'source': ROOT / 'articles/blog/open-learning.md',
        'url': 'https://domij.info/articles/blog/open-learning.html',
        'md_url': '/articles/blog/open-learning.md',
        'prefix': 'ol',
        'date_created': '2026-11-17',
        'date_modified': '2026-11-17',
        'description': (
            'A working hypothesis for open learning: four human capabilities and three independent '
            'experience principles, connecting individual mastery with voluntary collective discovery.'
        ),
    },
    {
        'source': ROOT / 'articles/blog/learning-about-learning.md',
        'url': 'https://domij.info/articles/blog/learning-about-learning.html',
        'md_url': '/articles/blog/learning-about-learning.md',
        'prefix': 'lal',
        'date_created': '2023-03-10',
        'date_modified': '2026-11-18',
        'description': (
            'Native Mermaid diagrams and decoded notes from the 10 March 2023 Design for Learning '
            'XMind map, restoring all branches, boundary callouts, markers and 13 reference links.'
        ),
    },
]


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    return re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', text)


def render_list(block):
    out = ['<ul>']
    depth = 0
    li_open = [False]
    for line in block.splitlines():
        stripped = line.lstrip(' ')
        level = (len(line) - len(stripped)) // 2
        text = stripped[2:] if stripped.startswith('• ') else stripped
        while level > depth:
            out.append('<ul>')
            li_open.append(False)
            depth += 1
        while level < depth:
            if li_open[depth]:
                out.append('</li>')
                li_open[depth] = False
            out.append('</ul>')
            li_open.pop()
            depth -= 1
        if li_open[depth]:
            out.append('</li>')
        out.append('<li>' + inline(text))
        li_open[depth] = True
    while depth > 0:
        if li_open[depth]:
            out.append('</li>')
        out.append('</ul>')
        li_open.pop()
        depth -= 1
    if li_open[0]:
        out.append('</li>')
    out.append('</ul>')
    return ''.join(out)


def inline_figure_svgs(block, page_prefix, fig_counter):
    def repl(match):
        fig_counter[0] += 1
        svg_id = f'{page_prefix}-fig-{fig_counter[0]}'
        rel_path = match.group(1).lstrip('/')
        svg_path = ROOT / rel_path
        if not svg_path.exists():
            return match.group(0)
        svg = svg_path.read_text(encoding='utf-8')
        svg = re.sub(r'max-width:\s*[^;"]+;?\s*', '', svg, count=1)
        svg = svg.replace('my-svg', svg_id)
        return svg

    out = re.sub(r'<img\s+src="(/articles/diagrams/[^"]+\.svg)"[^>]*>', repl, block)
    out = out.replace('href="/articles/diagrams/', 'href="../diagrams/')
    return out


def render(block, page_prefix, fig_counter):
    if block.startswith(('<figure', '<details', '<pre')):
        return inline_figure_svgs(block, page_prefix, fig_counter)
    if block.startswith('### '):
        return '<h3>' + inline(block[4:]) + '</h3>'
    if block.startswith('## '):
        return '<h2>' + inline(block[3:]) + '</h2>'
    if block.startswith('> '):
        return '<blockquote><p>' + inline(block[2:]) + '</p></blockquote>'
    if block.lstrip(' ').startswith('• '):
        return render_list(block)
    if block.startswith('|'):
        rows = [line.strip().strip('|').split('|') for line in block.splitlines()]
        def row(cells, tag):
            scope = ' scope="col"' if tag == 'th' else ''
            return '<tr>' + ''.join(f'<{tag}{scope}>{inline(c.strip())}</{tag}>' for c in cells) + '</tr>'
        return '<div class="table-scroll"><table><thead>' + row(rows[0], 'th') + '</thead><tbody>' + ''.join(row(r, 'td') for r in rows[2:]) + '</tbody></table></div>'
    return '<p>' + inline(block) + '</p>'


def main():
    template_src = (ROOT / 'scripts/templates/working-draft.html').read_text()
    for page in PAGES:
        source_path = page['source']
        source = source_path.read_text()
        if '<!-- learning-' in source:
            raise ValueError(f'Unresolved draft placeholder in {source_path}')
        title, date, _, _ = reader.extract_meta(source, str(source_path))
        fig_counter = [0]
        body = '\n'.join(
            render(b, page['prefix'], fig_counter)
            for b in reader.split_blocks('\n'.join(source.splitlines()[4:]))
        )
        schema = json.dumps({
            '@context': 'https://schema.org', '@type': 'Article', 'headline': title,
            'description': page['description'], 'url': page['url'], 'inLanguage': 'en-GB',
            'creativeWorkStatus': 'Working draft', 'dateCreated': page['date_created'],
            'dateModified': page['date_modified'], 'author': {'@type': 'Person', 'name': 'Domi Jin'},
        }, ensure_ascii=False)
        template = template_src
        values = {
            'TITLE': html.escape(title),
            'DATE': date,
            'URL': page['url'],
            'MD_URL': page['md_url'],
            'DESCRIPTION': html.escape(page['description']),
            'SCHEMA': schema,
            'BODY': body,
        }
        for key, value in values.items():
            template = template.replace('{{' + key + '}}', value)
        source_path.with_suffix('.html').write_text(template)
        print('Rendered', source_path.with_suffix('.html').relative_to(ROOT))
    (ROOT / 'articles/open-learning.css').write_text((ROOT / 'green-app/src/app/open-learning.css').read_text())


if __name__ == '__main__':
    main()
