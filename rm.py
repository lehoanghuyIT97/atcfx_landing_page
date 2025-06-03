import os
import re

def remove_li_with_es_pe(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Tìm tất cả các thẻ <li class="cpel-switcher__lang">...</li>
    li_pattern = r'(<li\s+class="cpel-switcher__lang">.*?</li>)'
    all_lis = re.findall(li_pattern, html, flags=re.DOTALL)

    removed = False
    for li in all_lis:
        # Nếu bên trong thẻ <li> có <a lang="pt-PT" hreflang="pt-PT">
        if re.search(r'<a\s+[^>]*lang="th"\s+hreflang="th"', li):
            html = html.replace(li, '')
            removed = True

    if removed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✅ Đã xoá tiếng th ở: {filepath}")

def scan_and_remove(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                remove_li_with_es_pe(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_remove(".")
