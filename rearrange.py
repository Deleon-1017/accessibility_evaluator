import sys

with open('results.php', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<!-- Left: Website Info -->\n                <div class="col-lg-8">', '<!-- Left: Website Info -->\n                <div class="col-lg-4">')
content = content.replace('<!-- Right: Accessibility Score Circle -->', '<!-- Middle: Accessibility Score Circle -->')

start_str = '                    <!-- Scan Summary Widget -->\n                    <div class="dashboard-widget mb-4">\n'
end_str = '                    </div>\n\n                    <!-- Accessibility Insights Widget -->'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    widget_content = content[start_idx:end_idx]
    content = content[:start_idx] + content[end_idx:]
    widget_content = widget_content.replace('<div class="dashboard-widget mb-4">', '<div class="dashboard-widget h-100">')
    lines = widget_content.split('\n')
    lines = [line[4:] if line.startswith('    ') else line for line in lines]
    widget_content = '\n'.join(lines)
    
    insert_target = '                    </section>\n                </div>\n            </div>\n        </div>'
    replacement = '                    </section>\n                </div>\n\n' + widget_content + '                </div>\n            </div>\n        </div>'
    content = content.replace(insert_target, replacement)
    
    with open('results.php', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Success')
else:
    print('Could not find widget markers.')
    print('Start found:', start_idx != -1)
    print('End found:', end_idx != -1)
