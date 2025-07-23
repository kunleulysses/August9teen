#!/usr/bin/env python3
"""
Fix all JavaScript files where getSelfAwarenessStatus methods are defined outside of classes
"""

import os
import re

def fix_file(filepath):
    """Fix a single JavaScript file by moving getSelfAwarenessStatus method inside the class"""
    print(f"Checking {filepath}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading {filepath}: {e}")
        return False
    
    # Look for pattern: class ends with }, then export, then getSelfAwarenessStatus method
    pattern = r'^(\s*)\}\s*\n\s*export\s+default\s+\w+;\s*\n\s*\n\s*(\/\*\*[\s\S]*?\*\/\s*\n\s*)?getSelfAwarenessStatus\(\)\s*\{'
    
    match = re.search(pattern, content, re.MULTILINE)
    if not match:
        print(f"  No issues found in {filepath}")
        return False
    
    print(f"  Found issue in {filepath}, fixing...")
    
    # Find the method end
    method_start = match.start()
    
    # Find where the class actually ends (the } before export)
    class_end_match = re.search(r'^(\s*)\}\s*\n\s*export\s+default', content, re.MULTILINE)
    if not class_end_match:
        print(f"  Could not find class end in {filepath}")
        return False
    
    class_end_pos = class_end_match.start()
    
    # Find the end of the getSelfAwarenessStatus method
    lines_after_method = content[method_start:].split('\n')
    brace_count = 0
    method_end_line = 0
    
    for i, line in enumerate(lines_after_method):
        if 'getSelfAwarenessStatus()' in line:
            brace_count = 1  # Start counting from the opening brace
            continue
        if brace_count > 0:
            brace_count += line.count('{') - line.count('}')
            if brace_count == 0:
                method_end_line = i
                break
    
    if method_end_line == 0:
        print(f"  Could not find method end in {filepath}")
        return False
    
    # Extract the method content
    method_lines = []
    found_method_start = False
    for i, line in enumerate(lines_after_method):
        if 'getSelfAwarenessStatus()' in line:
            found_method_start = True
        if found_method_start:
            method_lines.append(line)
            if i == method_end_line:
                break
    
    method_content = '\n'.join(method_lines)
    
    # Remove the method from its current location
    method_full_start = method_start
    method_full_end = method_start + len('\n'.join(lines_after_method[:method_end_line + 1]))
    
    # Find the export line to remove everything from class end to export
    export_match = re.search(r'\n\s*export\s+default\s+\w+;\s*\n', content[method_full_end:])
    if export_match:
        method_full_end += export_match.end()
    
    # Insert the method before the class closing brace
    # Add proper indentation (4 spaces)
    method_indented = '\n'.join(['    ' + line if line.strip() else line for line in method_lines])
    
    # Reconstruct the content
    new_content = (
        content[:class_end_pos] + 
        '\n' + method_indented + '\n' +
        content[class_end_pos:method_full_start] +
        content[method_full_end:]
    )
    
    # Write the fixed content back
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✅ Fixed {filepath}")
        return True
    except Exception as e:
        print(f"  Error writing {filepath}: {e}")
        return False

def main():
    # Get all consciousness JavaScript files
    consciousness_dir = "FlappyJournal/server/consciousness"
    
    js_files = []
    for root, dirs, files in os.walk(consciousness_dir):
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))
    
    print(f"Found {len(js_files)} JavaScript files to check")
    
    fixed_count = 0
    for filepath in js_files:
        if fix_file(filepath):
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
