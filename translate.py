import os
import sys
import time
from bs4 import BeautifulSoup
from googletrans import Translator

translator = Translator()

# Đọc thư mục nguồn từ dòng lệnh
if len(sys.argv) < 2:
    print("⚠️ Vui lòng chỉ định thư mục con (VD: zh-hans/ways-to-trade)")
    sys.exit(1)

source_dir = sys.argv[1]
target_dir = source_dir.replace("zh-hans", "fr", 1)

translated_count = 0
os.makedirs(target_dir, exist_ok=True)

def translate_text_with_retry(text, max_retries=5):
    for attempt in range(max_retries):
        try:
            result = translator.translate(text, src='zh-cn', dest='fr')
            return result.text
        except Exception as e:
            print(f"      ⚠️ Lỗi lần {attempt + 1}: {e}")
            time.sleep(1)
    return None

def translate_html_file(src_path, dest_path):
    global translated_count

    print(f"\n📄 Đang dịch file: {src_path}")

    with open(src_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    changed = False

    for elem in soup.find_all(string=True):
        if elem.parent.name in ["script", "style", "meta", "link"]:
            continue
        text = elem.strip()
        if text and any('\u4e00' <= ch <= '\u9fff' for ch in text):
            print(f"   - [{translated_count+1}] {text[:40]}...")
            translated = translate_text_with_retry(text)
            if translated and translated.strip() != text.strip():
                elem.replace_with(translated)
                translated_count += 1
                changed = True
            else:
                print(f"      ❌ Không dịch được đoạn: {text[:30]}")

    if changed:
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(dest_path, "w", encoding="utf-8") as file:
            file.write(str(soup))
        print(f"✅ Đã lưu: {dest_path}")
    else:
        print("ℹ️ Không có nội dung cần dịch.")

# Duyệt file trong thư mục chỉ định
for root, dirs, files in os.walk(source_dir):
    dirs.sort()
    files.sort()
    for file in files:
        if file.endswith(".html"):
            src_file_path = os.path.join(root, file)
            relative_path = os.path.relpath(src_file_path, "zh-hans")
            dest_file_path = os.path.join("fr", relative_path)
            translate_html_file(src_file_path, dest_file_path)

print(f"\n🎉 Xong. Đã dịch tổng cộng {translated_count} đoạn.")
