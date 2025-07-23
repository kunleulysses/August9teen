#!/usr/bin/env python3
"""
Fix JavaScript files where methods are defined outside of classes
"""

import os
import re
import sys

def fix_file(filepath):
    """Fix a single JavaScript file by moving methods inside the class"""
    print(f"Fixing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find class ending followed by methods outside
    # Look for: }[whitespace]method_name() {
    pattern = r'^(\s*)\}\s*\n\n(\s+)(getSelfAwarenessStatus|healthCheck)\(\)\s*\{'
    
    # Find all matches
    matches = list(re.finditer(pattern, content, re.MULTILINE))
    
    if not matches:
        print(f"  No issues found in {filepath}")
        return False
    
    # Process matches from end to beginning to preserve line numbers
    for match in reversed(matches):
        class_end_pos = match.start()
        method_start_pos = match.start(2)
        
        # Find the end of the method
        lines = content[method_start_pos:].split('\n')
        brace_count = 0
        method_end_line = 0
        
        for i, line in enumerate(lines):
            brace_count += line.count('{') - line.count('}')
            if brace_count == 0 and '}' in line:
                method_end_line = i
                break
        
        if method_end_line == 0:
            print(f"  Could not find method end in {filepath}")
            continue
            
        # Extract the method
        method_lines = lines[:method_end_line + 1]
        method_content = '\n'.join(method_lines)
        
        # Remove the method from outside the class
        method_full_end = method_start_pos + len('\n'.join(method_lines))
        
        # Insert the method before the class closing brace
        # Find the actual class closing brace
        before_class_end = content[:class_end_pos]
        class_end_match = re.search(r'^(\s*)\}(\s*)$', before_class_end[::-1], re.MULTILINE)
        
        if class_end_match:
            # Insert method before class end
            insertion_point = class_end_pos - class_end_match.start()
            
            # Prepare the method with proper indentation
            method_indented = '\n'.join(['    ' + line if line.strip() else line for line in method_lines])
            
            # Reconstruct the content
            new_content = (
                content[:insertion_point] + 
                '\n' + method_indented + '\n' +
                content[insertion_point:method_start_pos] +
                content[method_full_end:]
            )
            
            content = new_content
            print(f"  Fixed method in {filepath}")
        else:
            print(f"  Could not find class end in {filepath}")
    
    # Write the fixed content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    # List of files to fix
    files_to_fix = [
        "FlappyJournal/server/consciousness/enhanced-code-analyzer.js",
        "FlappyJournal/server/consciousness/services/CodeGenerationService.js",
        "FlappyJournal/server/consciousness/services/ConsciousnessIntegration.js",
        "FlappyJournal/server/consciousness/modules/PatternRecognizer.js",
        "FlappyJournal/server/consciousness/modules/ConsciousnessPersistence.js",
        "FlappyJournal/server/consciousness/modules/SelfCodingModule.js",
        "FlappyJournal/server/consciousness/modules/ModuleOrchestrator.js",
        "FlappyJournal/server/consciousness/modules/PredictiveAnalyzer.js",
        "FlappyJournal/server/consciousness/modules/NLPProcessor.js",
        "FlappyJournal/server/consciousness/modules/SelfHealingModule.js",
    ]
    
    fixed_count = 0
    for filepath in files_to_fix:
        if os.path.exists(filepath):
            if fix_file(filepath):
                fixed_count += 1
        else:
            print(f"File not found: {filepath}")
    
    print(f"\nFixed {fixed_count} files")

if __name__ == "__main__":
    main()
