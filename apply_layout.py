import sys
import os

with open('results.php', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change col-lg-8 to col-lg-12 for the table
content = content.replace('<!-- Left Column: Issues Table -->\n                <div class="col-lg-8">', '<!-- Full Width: Issues Table -->\n                <div class="col-lg-12">')
# Support if I missed replacing the comment earlier
content = content.replace('<div class="col-lg-8">', '<div class="col-lg-12">')

# 2. Add 'How to Fix' column to table header
old_th = '<th scope="col">Issue Description</th>\n                                                <th scope="col" style="width: 10%;"></th>'
new_th = '<th scope="col" style="width: 25%;">Issue Description</th>\n                                                <th scope="col" style="width: 25%;">How to Fix</th>\n                                                <th scope="col" style="width: 5%;"></th>'
content = content.replace(old_th, new_th)

# 3. Add 'How to Fix' column to table body
old_td = '''                                                    <strong><?php echo htmlspecialchars($issue['title']); ?></strong>
                                                    <div class="small text-muted mt-1"><?php echo htmlspecialchars($issue['description']); ?></div>
                                                </td>
                                                <td class="text-center">'''
new_td = '''                                                    <strong><?php echo htmlspecialchars($issue['title']); ?></strong>
                                                    <div class="small text-muted mt-1"><?php echo htmlspecialchars($issue['description']); ?></div>
                                                </td>
                                                <td>
                                                    <div class="small text-muted"><?php echo htmlspecialchars($issue['recommendation']); ?></div>
                                                </td>
                                                <td class="text-center">'''
content = content.replace(old_td, new_td)

# 4. Update colspan in details row
old_colspan = 'colspan="<?php echo $results[\'source_url\'] ? \'5\' : \'6\'; ?>"'
new_colspan = 'colspan="<?php echo $results[\'source_url\'] ? \'6\' : \'7\'; ?>"'
content = content.replace(old_colspan, new_colspan)

# 5. Remove 'How to Fix' from details row
how_to_fix_html = '''                                                            <div class="col-12">
                                                                <div class="detail-section">
                                                                    <div class="detail-section-title">
                                                                        <i class="bi bi-lightbulb"></i> HOW TO FIX
                                                                    </div>
                                                                    <div class="detail-section-content">
                                                                        <?php echo htmlspecialchars($issue['recommendation']); ?>
                                                                    </div>
                                                                </div>
                                                            </div>'''
content = content.replace(how_to_fix_html, '')

# 6. Extract widgets and move below table
widget_start_marker = '                <!-- Right Column: Dashboard Widgets -->\n                <div class="col-lg-4">\n\n                    <!-- Accessibility Insights Widget -->'

# We need to find the end of the widgets cleanly. The quick actions widget ends before the row div closes.
# It looks like this:
"""
                    <!-- Quick Actions Widget -->
                    <div class="dashboard-widget">
                        ...
                    </div>
                </div>
            </div>
        </div>
"""
quick_action_start = '                    <!-- Quick Actions Widget -->'
if quick_action_start in content and widget_start_marker in content:
    w_start = content.find(widget_start_marker)
    q_start = content.find(quick_action_start, w_start)
    w_end = content.find('                    </div>\n                </div>\n            </div>\n        </div>', q_start)
    if w_end != -1:
        # We also need to extract the closing tags of the left column (table) and row
        # The structure is:
        #         </div> <!-- end of dashboard-card -->
        #     </div> <!-- end of col-lg-12 -->
        #     <div class="col-lg-4"> ... widgets ... </div>
        # </div> <!-- end of row -->
        
        # We will extract everything from widget_start_marker up to the end of the col-lg-4
        end_of_col4 = w_end + len('                    </div>\n                </div>')
        widget_block = content[w_start:end_of_col4]
        
        # Remove it from content
        content = content[:w_start] + content[end_of_col4:]
        
        # Extract insight and quick actions specifically
        insight_start = widget_block.find('<!-- Accessibility Insights Widget -->')
        quick_start = widget_block.find('<!-- Quick Actions Widget -->')
        
        insight_block = widget_block[insight_start:quick_start].strip()
        quick_block = widget_block[quick_start:].replace('</div>\n                </div>', '</div>').strip()
        
        # Format the new bottom section
        new_bottom_section = f"""
        <!-- Bottom Dashboard Widgets: 2-Column Layout -->
        <div class="dashboard-content mt-4">
            <div class="row g-4">
                <div class="col-md-6">
                    {insight_block}
                </div>
                <div class="col-md-6">
                    {quick_block}
                </div>
            </div>
        </div>
"""
        # We will insert new_bottom_section right before the closing </main>
        content = content.replace('    </main>', new_bottom_section + '\n    </main>')
        
        print("Widgets moved successfully.")
    else:
        print("Could not find end of widgets")
else:
    print("Could not find widget markers.")

with open('results.php', 'w', encoding='utf-8') as f:
    f.write(content)
print("File updated.")
