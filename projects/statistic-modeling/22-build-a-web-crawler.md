---
tags:
  - scrape
  - crawler
  - web
  - data
  - skill
kind: concept
format: reference
project: "[[statistic-modeling]]"
source: "[ChatGPT's answer](https://chatgpt.com/g/g-p-69c9f8a889608191bd35785d17ace034/c/69ef54db-9ac8-83a0-8560-ff026a0d1e81)"
aliases:
  - Build A Web Crawler
  - web scrape skill
---

# Building a Web Crawler

## Purpose

This note documents a practical workflow for building a reliable web crawler for public policy text collection. The target use case is a statistical modeling project that needs structured policy documents, especially policy texts related to "Specialized, Refined, Distinctive, and Innovative" SMEs and "Little Giant" firms.

The main goal is not to write a universal crawler. The goal is to build a stable, compliant, reproducible data collection pipeline that can support downstream text classification, policy intensity measurement, and econometric analysis.

## Workflow

**Overview:**
```text
Define data requirements
  |
Design the output schema
  |
Map data sources
  |
Inspect website structure
  |
Choose a crawling strategy
  |
Write a small feasibility script
  |
Construct the URL queue
  |
Fetch detail pages and attachments
  |
Parse structured fields
  |
Clean policy text
  |
Deduplicate and run quality checks
  |
Store raw and structured data
  |
Use the corpus for text classification and statistical modeling
```

### Technology Stack

For a small-to-medium policy text crawler, the baseline stack should be simple:

```text
Python
httpx or requests
BeautifulSoup
pandas
lxml
pdfplumber / PyMuPDF
python-docx
SQLite / Parquet / CSV
```

If the project becomes larger or the websites are more complex, consider:

```text
Scrapy
Playwright
DuckDB
PostgreSQL
```

#### Tool Selection Matrix

| Situation | Recommended tool |
| --- | --- |
| Static HTML page | `requests` / `httpx` + BeautifulSoup |
| JSON API | `requests` / `httpx` |
| JavaScript-rendered page | Playwright |
| Large-scale distributed crawling | Scrapy |
| PDF text extraction | pdfplumber / PyMuPDF |
| Word document extraction | python-docx |
| Tabular output | pandas |
| Data storage | CSV / SQLite / Parquet |

### Output Schema Definition

Before writing crawler code, define exactly what the dataset should contain. A crawler is only useful when its output matches the modeling task.

Key questions:

> What is the target "content"? Does a policy record include only the metadata, or must it include the full policy body?
>
> What is the unit of observation?
>
> ```text
> One policy document
> One policy interpretation article
> One public notice
> One application guideline
> One attachment
> One policy clause
> ```
>
> What scope should the crawler cover?
>
> ```python
> for province in provinces:
>     for year in range(2020, 2026):
>         search keywords
>         collect policy pages
> ```

*For example:*

| Field | Meaning |
| --- | --- |
| province | Province-level jurisdiction |
| city | City, optional |
| title | Policy title |
| publish_date | Publication date |
| agency | Issuing agency |
| source_site | Source website |
| url | Original URL |
| text | Full body text |
| attachment_url | Attachment URL |
| attachment_text | Extracted PDF / Word attachment text |
| keyword_hit | Keyword that matched the record |
| crawl_time | Crawl timestamp |
| raw_html_path | Local path of archived raw HTML |
| parse_status | Whether parsing succeeded |

*The minimum requirement is:*

`province`, `year`, `policy_title`, `policy_body`, `policy_type`, `source_url`.

#### Data Model Design

`source_sites` records the available source websites:

| site_id | province | site_name | base_url | crawl_method |
| --- | --- | --- | --- | --- |
| gd_miit | 广东 | 广东省工信厅 | ... | static_html |
| zj_miit | 浙江 | 浙江省经信厅 | ... | api |
| miit_zjtx | 国家 | 工信部专精特新平台 | ... | unknown |

`policy_list` records items found on list pages or search result pages:

| policy_id | province | title | date | list_url | detail_url |
| --- | --- | --- | --- | --- | --- |

`policy_detail` records parsed fields from detail pages:

| policy_id | title | date | agency | text | attachment_url | status |
| --- | --- | --- | --- | --- | --- | --- |

### Source Mapping

Do not start by attacking a single website. First build a source map. For a policy text project, data sources usually fall into several categories:

| 数据源类型         | 例子             | 优点       | 缺点           |
| ------------- | -------------- | -------- | ------------ |
| 中央平台          | 工信部、中小企业服务平台   | 权威、结构较统一 | 不一定覆盖地方细则    |
| 省级政府官网        | 广东省工信厅、浙江省经信厅等 | 省级政策最完整  | 每个网站结构不同     |
| 政策搜索平台        | 政府信息公开搜索、政策文件库 | 搜索方便     | 正文格式混乱       |
| PDF / Word 附件 | 政策原文附件         | 内容权威     | 解析难度较高       |
| 第三方政策平台       | 北大法宝、政策通等      | 聚合好      | 可能有版权 / 访问限制 |

For this project, the intended sources include the SRDI SME platform and provincial government websites. The proposed "policy text crawler feasibility test" is also part of source mapping: manually inspect website structure, test `requests + BeautifulSoup`, check anti-crawling signals, and then test provincial websites.

### Website Reconnaissance

#### 1. Manual Site Inspection

**Checklist:**

- Is there a search box?
- Can the keywords "专精特新", "小巨人", and "中小企业" find relevant policy pages?
- Does the search result page have pagination?
- After opening a detail page, can you identify the title, date, body, and attachments?
- Is the body stored as HTML text, or only as a PDF / Word attachment?
- Does the URL follow a pattern that can be generated programmatically?

If you see a route such as:

```text
/#/policy?id=12345
```

or the page keeps loading before content appears, the site is probably using JavaScript rendering. In that case, inspect the Network panel before deciding whether Playwright is necessary.

#### 2. Static HTML Verification

If the target text appears directly in the HTML source, the crawler can usually use `requests` or `httpx` plus BeautifulSoup. This is the simplest and most stable case.

#### 3. API Discovery

> A public JSON API is often more stable than HTML parsing because it exposes structured records directly.

1. Open `F12 -> Network -> Fetch/XHR`.

Refresh the page and look for requests such as:

```text
/api/policy/list?page=1&keyword=专精特新
/api/policy/detail?id=12345
```

If such endpoints exist, prefer calling the API directly.

2. Check whether the response is JSON:

```json
{
  "records": [
    {
      "title": "关于支持专精特新中小企业发展的通知",
      "publishDate": "2024-03-15",
      "id": "12345"
    }
  ]
}
```

#### 4. Browser Automation Fallback (`Playwright / Selenium`)

Use Playwright only when the simpler methods fail. Common reasons include:

1. The content is absent from the page source.
2. The API requires complex tokens.
3. The page must execute JavaScript before rendering content.
4. The request requires cookies.
5. The request parameters are dynamically generated or encrypted.

```python
from playwright.sync_api import sync_playwright

url = "https://example.gov.cn/dynamic-policy-page"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url, wait_until="networkidle")

    title = page.locator("h1").inner_text()
    body = page.locator(".content").inner_text()

    print(title)
    print(body[:200])

    browser.close()
```

> [!caution]
> Playwright is slower, heavier, and more likely to cause environment problems.
>
> - If `requests` works, do not use Playwright.
> - If an API works, do not parse HTML.
> - If official data can be downloaded manually, do not force a crawler.

### Crawling Strategy Selection

Use this decision order:

```text
Where is the target data?
|
|-- 1. Is it present in the HTML source?
|      |-- Use requests + BeautifulSoup.
|          Check detail links, convert relative URLs to absolute URLs,
|          identify the body node, and prepare multiple selector rules.
|
|-- 2. Is there a JSON API in the Network panel?
|      |-- Request the API directly.
|
|-- 3. Is the body stored in PDF / Word attachments?
|      |-- Download attachments and parse documents.
|
|-- 4. Must JavaScript run before content appears?
|      |-- Use Playwright / Selenium.
|
|-- 5. Is there a search box but no obvious pagination?
|      |-- Inspect the search request parameters.
|
|-- 6. Are there anti-crawling barriers, captchas, or login requirements?
|      |-- Prefer an alternative official data source. Do not bypass access controls.
|
|-- 7. Is the website structure inconsistent?
       |-- Use semi-automated collection: manually curate URLs, then automate detail-page parsing.
```

For this policy text project, the recommended priority is:

`API > static HTML > attachment parsing > Playwright > manual completion`.

Do not start with a single "mega crawler". Government websites vary too much. A semi-automated pipeline with multiple site-specific parsers is usually more robust.

---

### Crawling Feasibility Test

**Checklist:**

1. Can the page be requested successfully?
2. Is the returned text correctly encoded?
3. Can the title be parsed?
4. Can the publication date be parsed?
5. Can the body text be parsed?
6. Can attachments be downloaded?
7. Are there duplicates?
8. Is the content actually a policy document rather than news or publicity material?
9. Is the crawl speed acceptable?
10. Are cookies, headers, or sessions required?

#### Anti-Crawling Signal Assessment

**Common signals:**

| Symptom | Likely cause |
| --- | --- |
| Browser opens the page, but Python returns 403 | Missing `User-Agent` or required headers |
| Requests fail after several attempts | Request frequency is too high |
| Response is a captcha page | Anti-crawling mechanism |
| Response is empty HTML | JavaScript-rendered content |
| Response text is garbled | Encoding issue |
| API returns a signature error | Encrypted or signed parameters |
| Login is required | Access restriction |
| IP is blocked | Too many or too frequent requests |

Basic remedies:

```text
Set a realistic User-Agent
Lower request frequency
Set timeouts
Use a session to keep cookies
Prefer public APIs
Prefer alternative official data sources
```

Avoid:

```text
Bypassing captchas
Cracking encrypted parameters
Sending high-concurrency requests to government websites
Bypassing login restrictions
Ignoring robots.txt or website terms
```

> [!warning]
> For an academic project, the priority is stability, compliance, and reproducibility. The question is not whether a page can be forced open technically, but whether the collection process is defensible.

### URL Queue Construction

Basic structure:

```text
Seed URLs
  |
List pages
  |
Detail pages
  |
Attachment files
```

For a policy website:

```text
Search page: keyword=专精特新&page=1
Search page: keyword=专精特新&page=2
Search page: keyword=小巨人&page=1
Search page: keyword=中小企业&page=1
```

Extract detail pages from search pages:

```text
/policy/123.html
/policy/foo.html
/policy/bar.html
```

Extract attachments from detail pages:

```text
/attachments/policy-original.pdf
/attachments/application-guide.docx
```

Think of this as graph traversal:

`Search Page -> Policy Detail -> Attachment`.

### Fetch Web Pages

> [!warning]
> Engineering tips for stable crawling.

#### User Agent

```python
headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
    )
}
```

#### Timeout

Never let a request freeze forever:

```python
requests.get(url, headers=headers, timeout=10)
```

#### Encoding Handling

Government websites may use different encodings:

```text
utf-8
gbk
gb2312
```

When the output is garbled, inspect `response.apparent_encoding`, page metadata, and actual byte content before parsing.

#### Rate Limiting

Do not send high-frequency requests to government websites:

```python
import time
import random

time.sleep(random.uniform(1, 3))
```

> [!attention]
> This is basic crawling etiquette and also reduces the probability of being blocked.

#### Archive Raw HTML

```text
data/raw_html/guangdong_2024_<policy>.html
data/processed/policies.parquet
```

> [!important]
> Store raw HTML because:
>
> 1. Failed parsing rules can be rerun later.
> 2. The research process remains traceable.
> 3. The website does not need to be requested repeatedly.
> 4. Manual inspection becomes easier.

### Parsing Strategy

#### List Page Parser

Target fields:

```text
title
date
detail_url
...
```

In a real project, do not blindly scan every `a` tag. Write selectors for each specific website and keep a fallback rule only for manual review.

#### Detail Page Parser

Target fields:

```text
title
publish_date
agency
body
attachment_urls
```

The parser should return a normalized dictionary even if some fields are missing. Use a `parse_status` field to distinguish successful, partial, and failed parses.

### Attachment Text Extraction

#### PDF Extraction

Use `PyMuPDF` or `pdfplumber`.

`pdfplumber` is often easier for text-heavy PDFs. `PyMuPDF` is usually faster and more flexible. Scanned PDFs require OCR and should be marked separately because OCR quality affects downstream analysis.

#### Word Document Extraction

`.docx`:

```python
from docx import Document

def extract_docx_text(path):
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
```

`.doc`:

1. Batch convert to `.docx` with LibreOffice.
2. Manually process a small number of files.
3. Use a system tool such as `antiword` when available.

### Text Cleaning

Common noise:

```text
责任编辑:
打印本页
关闭窗口
上一篇:
下一篇:
分享到:
来源:
字号: 大 中 小
```

More advanced cleaning may include:

```text
Normalize full-width and half-width characters
Normalize date formats
Remove excessive whitespace
Remove navigation text
Remove copyright blocks
Remove repeated paragraphs
```

Cleaning should be conservative. Keep the original raw text and write cleaned text to a separate field or dataset.

### Deduplication Strategy

Policy text is highly prone to duplication.

Common duplicate sources:

1. Central websites repost local policies.
2. Provincial government websites and provincial industry departments publish the same document.
3. Searches for "专精特新" and "小巨人" hit the same page.
4. An HTML page and a PDF attachment contain the same policy title.
5. Policy interpretations and original policy documents have similar titles.

Common deduplication methods:

#### URL Deduplication

```python
seen_urls = set()
```

#### Title and Date Deduplication

```text
title + publish_date
```

#### Text Hash Deduplication

```python
import hashlib

def text_hash(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()
```

#### Similarity-Based Deduplication

For records with slightly different titles but highly similar bodies, use:

```text
TF-IDF cosine similarity
SimHash
MinHash
```

### Data Quality Assurance

Always run QA after crawling. Otherwise, downstream text classification, policy intensity measurement, and DID analysis may be contaminated by bad data.

| Check item | Method |
| --- | --- |
| Empty body text | `text_length == 0` |
| Body text too short | `text_length < 200` |
| Missing publication date | `publish_date is null` |
| Year outside 2020-2025 | filter |
| Missing policy keywords | keyword check |
| Duplicate records | duplicate check |
| Incorrect province identification | province check |
| Attachment download failure | status code / file exists |
| PDF parsing failure | text length |

Create a quality report:

```text
Total crawled records: 1200
Successfully parsed records: 1050
Records with empty body: 80
Failed attachment parses: 40
Duplicates: 30
Final valid records: 900
```

### Data Storage Layout

Store three types of data.

#### Raw Data

```text
data/raw/html/
data/raw/pdf/
data/raw/docx/
```

#### Interim Data

```text
data/interim/policy_list.csv
data/interim/policy_detail_raw.parquet
```

#### Final Data

```text
data/processed/policy_texts_clean.parquet
data/processed/province_year_policy_strength.parquet
```

> [!note]
> Parquet is a good default for analytical workflows because it is compact, typed, and fast to read.

---

### Crawler Architecture

A stable crawler should be divided into five layers:

```text
Fetcher      Requests web pages and downloads files
Parser       Extracts structured fields
Cleaner      Cleans and normalizes text
Storage      Saves raw, interim, and processed data
Validator    Runs quality checks
```

Do not put all logic into one script.

> [!note]
> This layered design has several advantages:
>
> 1. If a website structure changes, only the parser needs to change.
> 2. If requests fail, only the fetcher needs tuning.
> 3. Cleaning rules can be updated without recrawling pages.
> 4. Each layer can be tested independently.

### Compliance and Ethics

This project targets government websites. Public policy documents are usually appropriate for academic collection, but the implementation should remain conservative.

1. Respect `robots.txt`.
2. Do not send high-frequency requests.
3. Do not collect personal private information.
4. Do not bypass login, captchas, or paywalls.
5. Do not attack or overload servers.
6. Preserve source URLs.
7. Report data sources and collection dates in the paper.
8. Minimize pressure on source websites.

The project collects public policy text, so the direction is generally reasonable. The engineering implementation still needs to prioritize compliance and traceability.

---

### Project-Specific Collection Strategy

For the "specialized SME policy text" project, use the following route.

#### Phase 1: Seed Table Construction

Do not start by fully automating searches across 31 provinces.

Start with an Excel / CSV seed table:

| province | site_name | search_url | keyword | note |
| --- | --- | --- | --- | --- |
| Beijing | Beijing Municipal Bureau of Economy and Information Technology | ... | 专精特新 | |
| Shanghai | Shanghai Municipal Commission of Economy and Informatization | ... | 专精特新 | |
| Guangdong | Guangdong Department of Industry and Information Technology | ... | 专精特新 | |
| Zhejiang | Zhejiang Department of Economy and Information Technology | ... | 专精特新 | |
| Jiangsu | Jiangsu Department of Industry and Information Technology | ... | 专精特新 | |

Your current priority order is reasonable: first cover Beijing, Shanghai, Guangdong, Zhejiang, and Jiangsu; then add Hebei, Shandong, Henan, Hubei, and Sichuan.

---

#### Phase 2: Sample-Based Website Assessment

Record:

```text
Is it static HTML?
Is there an API?
Which selector contains the body text?
Which selector contains the date?
What attachment formats appear?
What is the pagination rule?
Is Playwright required?
```

Build a technical assessment table:

| province | method | list_rule | detail_selector | date_selector | attachment |
| --- | --- | --- | --- | --- | --- |
| Guangdong | static_html | page parameter | `.TRS_Editor` | metadata row | PDF |
| Zhejiang | api | JSON | `content` field | JSON field | DOCX |
| Hebei | static_html | `list_n.html` | `.article` | `.date` | none |

---

#### Phase 3: Site-Specific Parser Implementation

Do not force one universal parser.

A better structure is:

```text
BaseParser
  |-- MIITParser
  |-- GuangdongParser
  |-- ZhejiangParser
  |-- JiangsuParser
  |-- HebeiParser
```

Government websites differ substantially. A universal parser tends to become fragile and hard to debug.

---

#### Phase 4: Output Schema Normalization

No matter how each website is crawled, the final output should have the same schema:

```python
{
    "province": "Guangdong",
    "title": "...",
    "publish_date": "2024-03-15",
    "agency": "...",
    "url": "...",
    "text": "...",
    "attachment_urls": [...],
    "source_site": "...",
}
```

This unified interface is what makes later data engineering and statistical modeling manageable.

---

#### Phase 5: Final Corpus Construction Before Text Classification

The final output should be:

```text
policy_texts_clean.parquet
```

Suggested fields:

```text
policy_id
province
year
title
text
source_url
policy_type_label_manual
policy_type_pred
```

Only after this step should the project move to:

```text
TF-IDF
RoBERTa classification
Policy intensity index
Province-year panel
DID heterogeneity analysis
```

This connects directly with the research design. Policy text collection is not an isolated task; it provides the corpus for policy intensity measurement and downstream DID analysis.

---

### Minimal Viable Crawler Implementation

The following example is still site-agnostic, but it is closer to a real project structure. It adds sessions, retry logic, raw HTML archiving, polite delays, parse status, and failure records.

```python
import hashlib
import logging
import random
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests
import pandas as pd
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
    )
}

KEYWORDS = ["专精特新", "小巨人", "中小企业"]
RAW_HTML_DIR = Path("data/raw/html")


def polite_sleep() -> None:
    time.sleep(random.uniform(1, 3))


def make_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(HEADERS)
    return session


def html_archive_path(url: str) -> Path:
    url_hash = hashlib.md5(url.encode("utf-8")).hexdigest()
    return RAW_HTML_DIR / f"{url_hash}.html"


def archive_html(url: str, html: str) -> Path:
    RAW_HTML_DIR.mkdir(parents=True, exist_ok=True)
    path = html_archive_path(url)
    path.write_text(html, encoding="utf-8")
    return path


def fetch_html(session: requests.Session, url: str, max_retries: int = 3) -> str:
    last_error = None

    for attempt in range(1, max_retries + 1):
        try:
            resp = session.get(url, timeout=10)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding
            polite_sleep()
            return resp.text
        except requests.RequestException as exc:
            last_error = exc
            logging.warning("Fetch failed: %s attempt=%s error=%s", url, attempt, exc)
            time.sleep(2 * attempt)

    raise RuntimeError(f"Failed to fetch {url}") from last_error


def contains_keyword(text: str) -> bool:
    return any(k in text for k in KEYWORDS)


def parse_list_page(html: str, base_url: str):
    soup = BeautifulSoup(html, "html.parser")
    records = []

    for a in soup.select("a"):
        title = a.get_text(strip=True)
        href = a.get("href")

        if not title or not href:
            continue

        if contains_keyword(title):
            records.append({
                "title": title,
                "detail_url": urljoin(base_url, href),
            })

    return records


def parse_detail_page(html: str, url: str):
    soup = BeautifulSoup(html, "html.parser")

    title_node = soup.select_one("h1")
    title = title_node.get_text(strip=True) if title_node else None

    content_node = (
        soup.select_one(".TRS_Editor")
        or soup.select_one(".article")
        or soup.select_one(".content")
        or soup.select_one(".article-content")
    )

    text = content_node.get_text("\n", strip=True) if content_node else ""

    attachments = []
    for a in soup.select("a"):
        href = a.get("href") or ""
        if href.lower().endswith((".pdf", ".doc", ".docx", ".xls", ".xlsx")):
            attachments.append(urljoin(url, href))

    parse_status = "success" if title and text else "partial"

    return {
        "title": title,
        "url": url,
        "text": text,
        "text_length": len(text),
        "attachments": attachments,
        "parse_status": parse_status,
        "text_hash": hashlib.md5(text.encode("utf-8")).hexdigest() if text else None,
        "crawl_time": datetime.now(timezone.utc).isoformat(),
    }


def main():
    session = make_session()
    list_urls = [
        "https://example.gov.cn/policy/page1.html",
        "https://example.gov.cn/policy/page2.html",
    ]

    all_details = []

    for list_url in list_urls:
        try:
            html = fetch_html(session, list_url)
            archive_html(list_url, html)
            items = parse_list_page(html, list_url)
        except Exception as exc:
            logging.exception("List page failed: %s", list_url)
            all_details.append({
                "url": list_url,
                "parse_status": "list_failed",
                "error": str(exc),
                "crawl_time": datetime.now(timezone.utc).isoformat(),
            })
            continue

        for item in items:
            detail_url = item["detail_url"]
            try:
                detail_html = fetch_html(session, detail_url)
                raw_html_path = archive_html(detail_url, detail_html)
                detail = parse_detail_page(detail_html, detail_url)
                detail["raw_html_path"] = str(raw_html_path)
                all_details.append(detail)
            except Exception as exc:
                logging.exception("Detail page failed: %s", detail_url)
                all_details.append({
                    "title": item.get("title"),
                    "url": detail_url,
                    "parse_status": "detail_failed",
                    "error": str(exc),
                    "crawl_time": datetime.now(timezone.utc).isoformat(),
                })

    df = pd.DataFrame(all_details)
    df.to_parquet("policy_texts_raw.parquet", index=False)


if __name__ == "__main__":
    main()
```

This example is still not production-grade. A real project also needs:

```text
Attachment download
PDF / Word parsing
Site-specific parsers
Configuration files for source websites
Resume support based on URL status
Quality checks
```

---

### Crawling Design Checklist

For each website, answer these ten questions:

1. What fields do I need?
2. Are these fields on the list page or the detail page?
3. Are these fields present in the page source?
4. Is there a JSON API in the Network panel?
5. Is there a URL or pagination pattern?
6. Is the body text in HTML or in an attachment?
7. Are login, cookies, or captchas required?
8. Are there anti-crawling restrictions?
9. Can the data be collected legally, slowly, and stably?
10. How will completeness be verified after crawling?

Once these questions are answered, the crawler design is usually clear.

---

### Recommended Implementation Roadmap

Given the current project goal and skill level, use this route:

```text
Step 1: Manually collect 5-10 policies for each of 10 provinces.
Step 2: Record each website's structure and field locations.
Step 3: Use requests + BeautifulSoup for static pages.
Step 4: Write a separate API parser when an API is available.
Step 5: Add PDF / Word attachment parsing when needed.
Step 6: Normalize all outputs to policy_texts_clean.parquet.
Step 7: Manually inspect a sample of 50 records.
Step 8: Expand to all 31 provinces only after the pilot is stable.
```

Do not try to fully automate the entire Chinese government website system at the beginning.

A more engineering-oriented and stable approach is:

> First build a high-quality semi-automated sample, then gradually automate the repetitive parts.

This approach fits the statistical modeling project better than blindly building an oversized crawler.

## Related
- [[statistic-modeling]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
