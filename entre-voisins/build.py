import pathlib, sys
src = pathlib.Path(__file__).parent / 'src'
order = ['gfx', 'data', 'core', 'onb', 'home', 'help', 'social', 'me', 'boot']
js = '\n'.join((src / f'{n}.js').read_text(encoding='utf-8') for n in order)
assert '</script' not in js.lower()
css = (src / 'styles.css').read_text(encoding='utf-8')
html = (src / 'shell.html').read_text(encoding='utf-8').replace('/*CSS*/', css).replace('/*JS*/', '"use strict";\n' + js)
out = pathlib.Path(__file__).parent / 'index.html'
out.write_text(html, encoding='utf-8')
print(out, len(html.encode('utf-8')), 'octets')
