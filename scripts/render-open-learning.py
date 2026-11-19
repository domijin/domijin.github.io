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
        'zh_source': ROOT / 'scripts/data/learning-about-learning-zh.md',
        'url': 'https://domij.info/articles/blog/learning-about-learning.html',
        'md_url': '/articles/blog/learning-about-learning.md',
        'prefix': 'lal',
        'date_created': '2023-03-10',
        'date_modified': '2026-11-18',
        'description': (
            'Native Mermaid diagrams and decoded notes from the 10 March 2023 Design for Learning '
            'XMind map, with English and Chinese notes, diagrams and 13 original reference links.'
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


def build_lang_toggle(aria_label):
    return (
        f'<div class="lang-toggle" role="group" aria-label="{html.escape(aria_label)}" hidden>'
        '<button type="button" data-lang-btn="en" aria-pressed="true">EN</button>'
        '<button type="button" data-lang-btn="zh" aria-pressed="false">中文</button>'
        '</div>'
    )


def build_lang_script(title_en, title_zh):
    payload = json.dumps({'enTitle': title_en, 'zhTitle': title_zh}, ensure_ascii=False)
    return f"""<script>
(function () {{
  var meta = {payload};
  var h1 = document.querySelector('.essay-header h1');
  var panels = document.querySelectorAll('[data-lang-panel]');
  var spans = document.querySelectorAll('[data-lang-span]');
  var buttons = document.querySelectorAll('[data-lang-btn]');
  if (!h1 || !panels.length) return;
  document.querySelector('.lang-toggle').hidden = false;
  function setLang(lang, updateUrl) {{
    var isZh = lang === 'zh';
    document.documentElement.lang = isZh ? 'zh-CN' : 'en-GB';
    document.title = (isZh ? meta.zhTitle : meta.enTitle) + ' \u2014 Domi Jin';
    h1.textContent = isZh ? meta.zhTitle : meta.enTitle;
    panels.forEach(function (el) {{
      var match = el.getAttribute('data-lang-panel') === (isZh ? 'zh' : 'en');
      el.hidden = !match;
    }});
    spans.forEach(function (el) {{
      var match = el.getAttribute('data-lang-span') === (isZh ? 'zh' : 'en');
      el.hidden = !match;
    }});
    buttons.forEach(function (btn) {{
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-btn') === (isZh ? 'zh' : 'en') ? 'true' : 'false');
    }});
    if (updateUrl && window.history && typeof window.history.replaceState === 'function') {{
      try {{
        var url = new URL(window.location.href);
        if (isZh) {{
          url.searchParams.set('lang', 'zh');
        }} else {{
          url.searchParams.delete('lang');
          if (url.hash === '#zh' || url.hash === '#cn') url.hash = '';
        }}
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      }} catch (_) {{}}
    }}
  }}
  buttons.forEach(function (btn) {{
    btn.addEventListener('click', function () {{
      setLang(btn.getAttribute('data-lang-btn'), true);
    }});
  }});
  try {{
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('lang') || '').toLowerCase();
    var h = (window.location.hash || '').toLowerCase();
    setLang(['zh', 'cn', 'zh-cn'].includes(q) || h === '#zh' || h === '#cn' ? 'zh' : 'en', false);
  }} catch (_) {{}}
}})();
</script>"""


def main():
    template_src = (ROOT / 'scripts/templates/working-draft.html').read_text()
    for page in PAGES:
        source_path = page['source']
        source = source_path.read_text()
        if '<!-- learning-' in source:
            raise ValueError(f'Unresolved draft placeholder in {source_path}')
        title, date, _, _ = reader.extract_meta(source, str(source_path))
        fig_counter = [0]
        en_body = '\n'.join(
            render(b, page['prefix'], fig_counter)
            for b in reader.split_blocks('\n'.join(source.splitlines()[4:]))
        )

        zh_source_path = page.get('zh_source')
        if zh_source_path:
            zh_source = zh_source_path.read_text()
            zh_title = re.sub(r'^#\s+', '', zh_source.splitlines()[0]).strip()
            zh_fig_counter = [0]
            zh_body = '\n'.join(
                render(b, page['prefix'] + '-zh', zh_fig_counter)
                for b in reader.split_blocks('\n'.join(zh_source.splitlines()[4:]))
            )
            body = (
                f'<div class="lang-panel" data-lang-panel="en" lang="en-GB">\n{en_body}\n</div>\n'
                f'<div class="lang-panel" data-lang-panel="zh" lang="zh-CN" id="zh"><noscript><h2>{html.escape(zh_title)}</h2></noscript>\n{zh_body}\n</div>'
            )
            nav_home = '<span data-lang-span="en">← Domi Jin</span><span data-lang-span="zh" hidden>← Domi Jin 主页</span>'
            badge_text = '<span data-lang-span="en">Working draft</span><span data-lang-span="zh" hidden>工作草案 · 中/英双语</span>'
            nav_all = '<span data-lang-span="en">All Writing</span><span data-lang-span="zh" hidden>全部文章</span>'
            eyebrow_text = '<span data-lang-span="en">Working draft · Human agency</span><span data-lang-span="zh" hidden>工作草案 · 人的能动性</span>'
            byline_text = f'<span data-lang-span="en">{date} · Domi Jin</span><span data-lang-span="zh" hidden>2026 年 11 月 18 日 · Domi Jin</span>'
            topbar_toggle = build_lang_toggle('Language switch')
            header_lang_bar = (
                '<div class="bilingual-bar">'
                + '<noscript><a href="#zh" lang="zh-CN">阅读中文版</a></noscript>'
                + '<span data-lang-span="en">Bilingual view (EN / 中文) · <a href="/future-of-education/">中文教育简述</a></span>'
                + '<span data-lang-span="zh" hidden>支持中 / 英切换 · <a href="/future-of-education/">返回《我对未来教育的期待》</a></span>'
                + '</div>'
            )
            colophon_html = (
                f'<p data-lang-span="en">Working draft · {date}. <a href="{page["md_url"]}">Read the Markdown source</a>.</p>'
                f'<p data-lang-span="zh" hidden>工作草案 · 2026 年 11 月 18 日 · <a href="/future-of-education/">我对未来教育的期待</a> · <a href="{page["md_url"]}">查看英文 Markdown 源码</a>。</p>'
                '<p data-lang-span="en"><a href="/articles/">More writing</a> · <a href="mailto:contact@domij.info">Compare notes</a></p>'
                '<p data-lang-span="zh" hidden><a href="/articles/">更多文章与笔记</a> · <a href="mailto:contact@domij.info">交流想法</a></p>'
            )
            lang_script = build_lang_script(title, zh_title)
        else:
            body = en_body
            nav_home = '← Domi Jin'
            badge_text = 'Working draft'
            nav_all = 'All Writing'
            eyebrow_text = 'Working draft · Human agency'
            byline_text = f'{date} · Domi Jin'
            topbar_toggle = ''
            header_lang_bar = ''
            colophon_html = (
                f'<p>Working draft · {date}. <a href="{page["md_url"]}">Read the Markdown source</a>.</p>'
                '<p><a href="/articles/">More writing</a> · <a href="mailto:contact@domij.info">Compare notes</a></p>'
            )
            lang_script = ''

        schema = json.dumps({
            '@context': 'https://schema.org', '@type': 'Article', 'headline': title,
            'description': page['description'], 'url': page['url'], 'inLanguage': ['en-GB', 'zh-CN'] if zh_source_path else 'en-GB',
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
            'OG_ALTERNATE': '<meta property="og:locale:alternate" content="zh_CN" />' if zh_source_path else '',
            'BODY': body,
            'NAV_HOME_TEXT': nav_home,
            'BADGE_TEXT': badge_text,
            'TOPBAR_TOGGLE': topbar_toggle,
            'NAV_ALL_TEXT': nav_all,
            'EYEBROW_TEXT': eyebrow_text,
            'BYLINE_TEXT': byline_text,
            'HEADER_LANG_BAR': header_lang_bar,
            'COLOPHON_HTML': colophon_html,
            'LANG_SCRIPT': lang_script,
        }
        for key, value in values.items():
            template = template.replace('{{' + key + '}}', value)
        source_path.with_suffix('.html').write_text(template)
        print('Rendered', source_path.with_suffix('.html').relative_to(ROOT))
    (ROOT / 'articles/open-learning.css').write_text((ROOT / 'green-app/src/app/open-learning.css').read_text())


if __name__ == '__main__':
    main()
