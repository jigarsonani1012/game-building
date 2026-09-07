with open('shikaku-puzzle.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'if(isBeaming&&' in l:
        lines[i] = ""
        break

with open('shikaku-puzzle.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("OBSOLETE ISBEAMING DELETED")
