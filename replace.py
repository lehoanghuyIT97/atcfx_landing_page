import os
import re

def replace_href_in_a_tags_only(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Pattern: tìm toàn bộ thẻ <a ...>...</a>
    a_tag_pattern = re.compile(r'<a\b[^>]*?>.*?</a>', re.DOTALL | re.IGNORECASE)

    def replace_href(match):
        a_tag = match.group(0)
        # Chỉ thay thế nếu href bắt đầu bằng https://www.atfx.com/
        updated_tag = re.sub(
            r'(href=["\'])https://www\.atfx\.com/',
            r'\1https://www.atfx.com.bz/',
            a_tag,
            flags=re.IGNORECASE
        )
        return updated_tag

    # Áp dụng thay thế trong từng thẻ <a>
    html_new, count = a_tag_pattern.subn(replace_href, html)

    if count > 0 and html_new != html:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_new)
        print(f"✅ Đã sửa {count} thẻ <a> trong: {filepath}")

def scan_and_replace(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                replace_href_in_a_tags_only(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_replace(".")
