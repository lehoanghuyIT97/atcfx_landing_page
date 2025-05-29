import os
import re

def remove_ar_li(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Regex để tìm <li> chứa link lang="ar"
    pattern = r'<li class="cpel-switcher__lang">\s*<a\s+lang="ar-JO"\s+hreflang="ar-JO"\s+href="[^"]*">\s*<span class="cpel-switcher__name">[^<]*</span>\s*</a>\s*</li>'
    html_new = re.sub(pattern, '', html, flags=re.DOTALL | re.MULTILINE)

    if html != html_new:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_new)
        print(f"✅ Đã xoá tiếng Ả Rập ở: {filepath}")

def scan_and_remove(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                remove_ar_li(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_remove(".")
