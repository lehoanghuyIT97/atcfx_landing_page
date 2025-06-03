import os
import re

def remove_target_li(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Regex khớp chính xác class cần xoá
    pattern = r'<li\s+[^>]*class=["\']menu-item menu-item-type-post_type menu-item-object-page menu-item-20283["\'][^>]*>.*?</li>'

    html_new = re.sub(pattern, '', html, flags=re.DOTALL)

    if html != html_new:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_new)
        print(f"✅ Đã xoá li có class chính xác ở: {filepath}")

def scan_and_remove(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                remove_target_li(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_remove(".")
