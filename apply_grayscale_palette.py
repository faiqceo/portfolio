from pathlib import Path

replacements = {
    # Root palette
    "--bg:       #002147;": "--bg:       #000000;",
    "--bg2:      #072b4d;": "--bg2:      #0A0A0A;",
    "--surface:  #0b335c;": "--surface:  #171717;",
    "--border:   rgba(210,180,140,0.18);": "--border:   rgba(171,171,171,0.18);",
    "--orange:   #d2b48c;": "--accent:   #ABABAB;",
    "--orange-dim: rgba(210,180,140,0.14);": "--accent-dim: rgba(171,171,171,0.14);",
    "--white:    #f7f3ea;": "--white:    #FAFAFA;",
    "--muted:    rgba(247,243,234,0.72);": "--muted:    rgba(171,171,171,0.72);",
    "--muted2:   rgba(247,243,234,0.46);": "--muted2:   rgba(171,171,171,0.46);",
}

style_path = Path('style.css')
text = style_path.read_text(encoding='utf-8')
for old, new in replacements.items():
    text = text.replace(old, new)

# add surface-alt variable if not already present
if '--surface-alt:' not in text:
    text = text.replace('--surface:  #171717;', '--surface:  #171717;\n  --surface-alt:#262626;')

# palette-specific legacy replacements
legacy = {
    '#002147': '#000000',
    '#072b4d': '#0A0A0A',
    '#0b335c': '#171717',
    '#020712': '#0A0A0A',
    '#080808': '#000000',
    '#0c0c0c': '#171717',
    '#131313': '#171717',
    '#374151': '#262626',
    '#22c55e': '#171717',
    '#f8f2e7': '#0A0A0A',
    '#efe2c8': '#262626',
    '#8a5d1d': 'var(--accent)',
    '#d2b48c': 'var(--accent)',
    '#a7f3d0': 'var(--accent)',
    '#8ef1c2': '#A3A3A3',
    '#f8e08a': 'var(--accent)',
    '#f8f8f8': 'var(--white)',
    '#f3ffee': 'var(--white)',
    '#b69d74': 'var(--muted)',
    '#5b4b2f': 'var(--muted)',
    '#3d2b10': 'var(--muted)',
    '#9ca3af': 'var(--muted)',
    '#fff': 'var(--white)',
    'var(--orange)': 'var(--accent)',
    'var(--orange-dim)': 'var(--accent-dim)',
}
for old, new in legacy.items():
    text = text.replace(old, new)

# rgba replacements to keep grayscale theming
rgba_map = {
    'rgba(255,255,255,0.1)': 'rgba(250,250,250,0.1)',
    'rgba(255,255,255,0.12)': 'rgba(250,250,250,0.12)',
    'rgba(255,255,255,0.14)': 'rgba(250,250,250,0.14)',
    'rgba(255,255,255,0.16)': 'rgba(250,250,250,0.16)',
    'rgba(255,255,255,0.2)': 'rgba(250,250,250,0.18)',
    'rgba(255,255,255,0.22)': 'rgba(250,250,250,0.22)',
    'rgba(255,255,255,0.25)': 'rgba(250,250,250,0.25)',
    'rgba(255, 215, 0, 0.25)': 'rgba(171,171,171,0.25)',
    'rgba(255, 215, 0, 0.2)': 'rgba(171,171,171,0.2)',
    'rgba(255, 215, 0, 0.45)': 'rgba(171,171,171,0.45)',
    'rgba(255, 215, 0, 0.6)': 'rgba(171,171,171,0.6)',
    'rgba(255, 215, 0, 0.9)': 'rgba(171,171,171,0.9)',
    'rgba(255, 215, 0, 1)': 'rgba(171,171,171,1)',
    'rgba(0, 33, 71, 0.08)': 'rgba(0, 0, 0, 0.18)',
    'rgba(0, 33, 71, 0.28)': 'rgba(0, 0, 0, 0.28)',
    'rgba(0, 0, 0, 0.35)': 'rgba(0, 0, 0, 0.32)',
    'rgba(34, 197, 94, 0.22)': 'rgba(171,171,171,0.22)',
    'rgba(34, 197, 94, 0.3)': 'rgba(171,171,171,0.3)',
    'rgba(34, 197, 94, 0.55)': 'rgba(171,171,171,0.35)',
    'rgba(255, 215, 0, 0.16)': 'rgba(171,171,171,0.16)',
    'rgba(255, 215, 0, 0.08)': 'rgba(171,171,171,0.08)',
    'rgba(255, 215, 0, 0.06)': 'rgba(171,171,171,0.06)',
    'rgba(255, 215, 0, 0.12)': 'rgba(171,171,171,0.12)',
    'rgba(255, 215, 0, 0.02)': 'rgba(171,171,171,0.02)',
    'rgba(255, 255, 255, 0.1)': 'rgba(250,250,250,0.1)',
    'rgba(255, 255, 255, 0.12)': 'rgba(250,250,250,0.12)',
    'rgba(255, 255, 255, 0.14)': 'rgba(250,250,250,0.14)',
    'rgba(255, 255, 255, 0.16)': 'rgba(250,250,250,0.16)',
    'rgba(255, 255, 255, 0.2)': 'rgba(250,250,250,0.18)',
    'rgba(255, 255, 255, 0.22)': 'rgba(250,250,250,0.22)',
    'rgba(255, 255, 255, 0.25)': 'rgba(250,250,250,0.25)',
}
for old, new in rgba_map.items():
    text = text.replace(old, new)

# update gradient usage
text = text.replace('linear-gradient(180deg, #f8f2e7 0%, #efe2c8 100%)', 'linear-gradient(180deg, #0A0A0A 0%, #262626 100%)')
text = text.replace('linear-gradient(180deg, transparent 0%, #d2b48c 50%, transparent 100%)', 'linear-gradient(180deg, transparent 0%, var(--accent) 50%, transparent 100%)')
text = text.replace('linear-gradient(90deg, rgba(250, 248, 252, 1) 0%, rgba(250, 248, 252, 0) 100%)', 'linear-gradient(90deg, rgba(250,250,250,1) 0%, rgba(250,250,250,0) 100%)')
text = text.replace('linear-gradient(270deg, rgba(250, 248, 252, 1) 0%, rgba(250, 248, 252, 0) 100%)', 'linear-gradient(270deg, rgba(250,250,250,1) 0%, rgba(250,250,250,0) 100%)')

style_path.write_text(text, encoding='utf-8')

# Update index.css
index_path = Path('index.css')
index_text = index_path.read_text(encoding='utf-8')
index_text = index_text.replace('#050505', '#000000').replace('#fff', 'var(--white)')
index_path.write_text(index_text, encoding='utf-8')

# Update App.jsx
app_path = Path('src/App.jsx')
app_text = app_path.read_text(encoding='utf-8')
app_replacements = {
    'bg-[#050505]': 'bg-[#000000]',
    'text-[#bdbdbd]': 'text-[#A3A3A3]',
    'from-[#d2b48c]': 'from-[#ABABAB]',
    'to-[#f4e4c1]': 'to-[#D4D4D4]',
    'from-[#002147]': 'from-[#000000]',
    'via-[#0b335c]': 'via-[#171717]',
    'to-[#d2b48c]': 'to-[#ABABAB]',
    'hover:text-[#002147]': 'hover:text-[#000000]',
}
for old, new in app_replacements.items():
    app_text = app_text.replace(old, new)
app_path.write_text(app_text, encoding='utf-8')

print('palette update complete')
