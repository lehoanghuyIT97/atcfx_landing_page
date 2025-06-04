import os
from bs4 import BeautifulSoup
from bs4.element import Tag

def remove_li_by_class(filepath, target_class):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    print("🔍 Đang xử lý file:", filepath)

    soup = BeautifulSoup(html, "html.parser")
    removed = False

    for li_tag in soup.find_all("li"):
        # Bỏ qua nếu li_tag bị lỗi, None hoặc không có thuộc tính
        if li_tag is None or not isinstance(li_tag, Tag):
            continue
        if not hasattr(li_tag, "attrs") or li_tag.attrs is None:
            continue

        class_list = li_tag.attrs.get("class", [])
        if isinstance(class_list, list) and target_class in class_list:
            li_tag.decompose()
            removed = True

    if removed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(str(soup))
        print(f"✅ Đã xoá <li> có class '{target_class}' tại: {filepath}")

def scan_and_remove(root_dir, target_class):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                print("🔍 Đang xử lý file:", os.path.join(root, file))
                remove_li_by_class(os.path.join(root, file), target_class)

if __name__ == "__main__":
    target_class = "menu-item-25627"
    scan_and_remove(".", target_class)
