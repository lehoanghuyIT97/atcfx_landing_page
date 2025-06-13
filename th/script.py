import os
import re

def remove_li_by_class(filepath, target_class):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    pattern = re.compile(
        r'<li\b[^>]*class=["\'][^"\']*\b' + re.escape(target_class) + r'\b[^"\']*["\'][^>]*>.*?</li>',
        re.DOTALL
    )

    html_new, count = pattern.subn('', html)

    if count > 0:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_new)
        print(f"✅ Đã xoá {count} thẻ li có class '{target_class}' trong: {filepath}")

def scan_and_remove(root_dir, target_class):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                remove_li_by_class(os.path.join(root, file), target_class)

if __name__ == "__main__":
    # Bước 1: xoá thẻ li con trước
    scan_and_remove(".", "menu-item-44262")
    scan_and_remove(".", "menu-item-47644")
    scan_and_remove(".", "menu-item-47645")
    # # Bước 2: xoá thẻ li cha sau
    scan_and_remove(".", "menu-item-44341")
