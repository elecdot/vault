---
tags:
  - inspiration
  - chatgpt
  - scrape
  - data
kind: resource
format: capture
status: fleeting
source: ChatGPT
aliases:
  - zjtx-miit-gov-cn
---

# zjtx-miit-gov-cn

## Why
A analysis of scrape policies on [工信部中小企业局专精特新平台](https://zjtx.miit.gov.cn/zxqySy/main#).

## Excerpt
> [!quote] ChatGPT reply
> # 工信部中小企业局专精特新平台技术与数据抓取分析报告
>
> 本报告以数据科学家/计算机与爬虫工程视角，对“优质中小企业梯度培育平台”（常被企业与地方通知称为“专精特新申报平台”）的公开侧页面、可直接访问的数据接口、登录与验证码等防自动化机制进行证据驱动的结构化分析：平台采用统一身份认证（含短信验证码与“电子营业执照”扫码），首页与部分栏目通过 AJAX/接口返回 JSON（出现统一的 `zrarData/json/statusCode` 包装），部分列表页在无 JS 渲染时仅出现“骨架/空内容”，表明需抓包识别后台接口；至少存在两个无需登录即可返回结构化数据的接口（公告流与需求库列表），其中“需求库/对接类数据”响应中包含联系人与电话等个人信息字段，带来较高的合规与伦理风险，爬虫应以“最小化采集、合规授权、低频限速、可审计与可回溯”为首要设计原则。citeturn31view0turn10view1turn12view1turn14view1
>
> ## 平台定位与可验证事实边界
>
> 平台对外展示为“工业和信息化部政务服务平台”下的“优质中小企业梯度培育平台”，首页聚合“创新型中小企业、专精特新中小企业、专精特新‘小巨人’企业、年度信息更新”等入口，并提示申报期状态及咨询电话。citeturn31view0
>
> 首页还出现两类与数据使用直接相关的“事实证据”：
>
> - “企业信息使用说明”明确：企业在平台填报信息除用于认定/复核申请外，拟按“最小化原则”提供给金融、知识产权等相关部门用于后续精准施策，并强调“不对社会公开，仅相关部门使用”。这意味着即使某些接口可匿名访问，也不等同于“可任意批量采集/再分发”。citeturn31view0
> - 与时间相关的运营提示：页面提示“4月10日起进入‘企业信息更新’模块更新企业信息”，并提示第八批“小巨人”申请/复核开放时间为“4月25日”。以本报告日期（2026-04-10）计，这类提示属于当日/近期运行策略的一部分，爬虫若做增量更新应考虑“申报期切换导致数据结构/接口变化”的风险窗口。citeturn31view0
>
> 认证能力方面，点击登录会进入统一认证体系页面（`login.jsp`），可见“电子营业执照”扫码登录与账号/手机相关功能入口，属于典型的强身份绑定场景（且通常伴随风控策略）。citeturn6view0
>
> ## 网站总体架构与关键页面数据入口清单
>
> 为避免在正文中直接铺设大量全量 URL，本节统一采用“相对路径/域名+路径”的方式列举；所有路径默认基于主站域名（见后续示例请求中的完整 URL）。
>
> image_group{"layout":"carousel","aspect_ratio":"16:9","query":["优质中小企业梯度培育平台 首页 截图","zjtx.miit.gov.cn 专精特新 平台 登录 页面","优质中小企业梯度培育平台 企业信息使用说明 弹窗"],"num_per_query":1}
>
> 下表给出“关键页面/数据入口”清单（包含功能、是否动态加载的判断、可见字段示例）。动态加载判断主要依据：页面在无 JS 渲染/抓包情况下是否能直接呈现列表内容、以及是否存在明确的 JSON 数据接口。citeturn31view0turn6view1turn10view1turn14view1
>
> | 页面URL（相对路径/域名+路径） | 功能 | 是否动态加载（证据型判断） | 可见数据字段示例（节选） |
> |---|---|---|---|
> | `/zxqySy/main` | 门户首页；聚合公告、模块入口、申报期状态、咨询与举报渠道 | **混合**：既有静态文本，也有轮播/列表等动态区域；页面内出现登录组件与多入口导航 | 公告标题/日期、模块名称（创新型/专精特新/小巨人等）、咨询电话、举报邮箱、企业信息使用说明文本等citeturn31view0 |
> | `/zxqy/` | 登录欢迎页（平台侧入口） | 可能静态（欢迎语） | “欢迎登录系统”等citeturn13search1 |
> | `/qyxx/gotosy` | 跳转至统一身份认证（SSO/跳转中间页） | **重定向**（服务器侧） | 跳转参数 `toUrl` 指回主站citeturn5view0 |
> | `ucenter.miit.gov.cn/login.jsp` | 统一身份认证登录页（账号体系） | **动态/强交互**：包含扫码登录、短信验证码等 | 电子营业执照扫码登录提示、登录按钮、手机相关功能入口等citeturn6view0 |
> | `/zxqySy/tzggMore` | “公告/通知”更多列表（部级/省级等Tab） | **是（强）**：无 JS 时只看到Tab与搜索骨架，列表内容不呈现，推断列表依赖 AJAX | Tab（重要通知/地方发布等）、搜索框、分页组件痕迹等citeturn6view1 |
> | `/zxqySy/tzggView?id=…` | 公告详情页 | **否/弱**：详情内容可直接呈现（HTML） | 标题、发布时间、正文内容等citeturn13search3turn13search6 |
> | `/zxqySy/syTzgg` | 首页公告流数据（JSON） | **是（接口直出）**：直接返回 JSON 包装数据 | `tzggList[].id/title/fbsj/nr` 等citeturn10view1 |
> | `/zxqySy/xdtMain` | 数字化转型相关“典型案例/方案”列表+筛选 | **混合**：页面可见筛选项与部分内容，但筛选联动高度疑似 AJAX | 行业筛选、场景筛选、结果列表摘要、查看详情等citeturn25view0 |
> | `/zxqySy/xdtView?id=…` | 数字化方案/案例详情 | **否/弱**：详情内容可直接呈现（HTML） | 所属数字化平台、适用行业/场景、部署价格、案例文本等citeturn25view2 |
> | `/zxqySy/hyzx` | “细分行业转型实践样本”行业集合页 | **否/弱**：行业列表直出 | 行业名称列表（如半导体、轨交装备、生物医药等）citeturn32view1 |
> | `/szhzx/` | 全国中小企业数字化转型服务平台（子站） | **未能直接访问**：抓取视图为空（多为重 JS/或需特定加载） | 未获页面可见字段（需浏览器渲染/抓包确认）citeturn32view0 |
> | `/xqdj` | “校企对接/供需对接”聚合页 | **混合**：可见模块卡片与“查看更多”，但对接库入口多为跳转/交互 | 活动信息、需求库/成果库模块、公告摘要等citeturn32view3 |
> | `/zxqySy/demandListMore` | 对接库列表页之一（页面标题仍为校企对接） | **是（疑似）**：列表项可见但“查看详情”不可直接解析为链接（疑似 JS 事件） | 列表序号、成果库名称、权属人、意向价格等citeturn33view0turn24view0 |
> | `/zxqySy/resultReleaseMore` | 成果库/结果发布列表页（可见“共167条”） | **混合**：至少可见总数与列表摘要；详情仍可能需 JS | “搜索共167条”、权属人、意向价格等citeturn33view1 |
> | `/zxqySy/getXqkList` | 需求库列表数据（JSON，包含联系人/电话等） | **是（接口直出）**：直接返回 JSON | `xqkList[].qymc/lxr/lxfs/xqmc/xqms/szsfmc/szsmc/tyshxydm` 等citeturn12view1 |
> | `/zxqySy/standardRequirement` | “专精特新中小企业标准化需求调查问卷”页面 | **是（交互）**：出现“验证码”与提交流程 | 企业名称、统一社会信用代码、联系人、联系方式、问卷选项、验证码图片等citeturn14view1 |
> | `/zxqySy/schoolEnterpriseMore` | 校企对接活动信息更多页 | **是（疑似）**：当前仅骨架+搜索 | 活动信息tab、搜索框等citeturn33view2 |
> | `/ptczsc.pdf` | 平台操作手册（多通知引用） | **未能直接访问**：工具打开报错（Internal Error），需本地复现 | 未获取PDF内容；但被用户手册引用为操作指南地址citeturn27view0turn8view0 |
> | `/rzcjdxal.pdf` |（疑似）人才/案例类 PDF | **未能直接访问**：请求返回异常（400 OK） | 未获取PDF内容citeturn32view2 |
>
> ## 前端与后端技术栈推断与抓包证据链
>
> ### 后端接口风格与响应封装特征
>
> 在未登录、无任何额外凭证前提下，至少可观察到两类“后端输出形态”：
>
> 1) **HTML详情页直出**：如 `tzggView`、`xdtView` 等，页面可直接呈现标题、正文、字段块。citeturn13search3turn25view2
> 2) **JSON 直出接口**：如 `syTzgg`、`getXqkList`，直接返回 JSON，且格式高度一致：顶层包含 `zrarData`（包含 select/form/grid/tree 等结构位）、`json`（业务数据容器）、`statusCode/message` 等字段。citeturn10view1turn12view1
>
> 这种“`zrarData` + `json`”的包装方式更像**面向前端渲染器/低代码表单引擎**输出的统一协议：`zrarData` 可能对齐前端组件（表单/表格/树）渲染所需元数据，而 `json` 提供实际列表/详情数据。该推断直接来自响应内容本身，而非主观猜测。citeturn10view1turn12view1
>
> 此外，这些 JSON 接口在抓取视图中被标注为 `Content type: text/html`（而非 `application/json`），属于“内容是 JSON、Content-Type 偏传统/未严格配置”的现象，在一些较老的 Java Web 或网关转发配置中并不少见；但**要确认具体服务端框架（Spring MVC/Struts 等）仍需抓包看响应头与服务端标识**。citeturn10view1turn12view1
>
> ### 身份认证与统一账号体系的技术信号
>
> 统一登录页面 URL 以 `login.jsp` 结尾，强烈指向 **Java/JSP** 技术路线（至少在认证中心侧）。同时登录页提供“电子营业执照”扫码与短信验证码等能力，意味着后端存在与第三方身份/证照体系的对接以及风控逻辑。citeturn6view0turn5view0
>
> 结合首页提示“绑定手机/忘记密码/账号找回/手机号修改”，可推断认证中心需要**Cookie + 会话**或**Token**维持登录态（但在“未提供凭证/不授权登录”的假设下，本报告不对登录后接口作任何越权推断）。citeturn31view0turn6view0
>
> ### 前端框架推断的“谨慎结论”
>
> 由于本环境无法像真实浏览器 DevTools 那样直接查看页面加载的 JS bundle 列表、框架指纹（Vue/React/Angular）与运行时对象，本报告对“具体前端框架”不做武断判定。唯一可以证据化的结论是：
>
> - 存在“列表页骨架 + 需 AJAX 拉取列表数据”的页面形态（如 `tzggMore`）。citeturn6view1
> - 存在“对接库列表中的‘查看详情’不可解析为普通 `<a>` 链接”的交互迹象，提示前端可能通过 JS 事件/路由控制详情打开。citeturn33view0turn24view0
>
> **建议的抓包取证方法（优先级：高，耗时：1–3小时）**
> 在本地浏览器执行以下步骤，即可把“推断”升级为“证据”：
>
> 1. 打开页面（如公告更多页、需求库/成果库列表页）。
> 2. DevTools → Network：勾选 *Preserve log* 与 *Disable cache*；过滤 *Fetch/XHR*。
> 3. 执行一次“切换 Tab / 搜索 / 翻页 / 切换省份”，观察新增请求。
> 4. 对关键请求右键 *Copy as cURL*；或导出 HAR（用于可复现归档）。
> 5. 重点记录：Request URL、Method、Query/Form 参数、Request Headers（尤其是 Cookie、Referer、Origin、X-Requested-With、Authorization）、Response JSON 结构、Pagination 字段。
>
> ## 数据接口与AJAX请求识别
>
> ### 已确认可匿名访问的接口与请求/响应示例
>
> 以下表格列出“本报告可直接验证”的接口（含参数与鉴权需求判断）。其中“是否需 Token/Referer/Cookie”仅依据“直接访问是否成功”与页面证据进行初步判定；更严格结论仍需本地抓包对照（见上一节方法）。citeturn10view1turn12view1turn6view0turn14view1
>
> | 接口URL（相对路径） | 请求方法 | 关键参数（已观测/推断） | 返回示例（关键片段，已脱敏/截断） | 分页/筛选机制 | 是否需Token/Referer/Cookie |
> |---|---|---|---|---|---|
> | `/zxqySy/syTzgg` | GET | 未观测到显式参数 | 返回包含 `tzggList`，字段含 `id/title/fbsj/nr/sffb` 等；`nr` 为 HTML 片段字符串 | 未观测；可能“固定取前N条” | **未观测需要**（匿名直访可得数据）citeturn10view1 |
> | `/zxqySy/getXqkList` | GET | 未观测到显式参数（很可能支持地区/行业筛选；需抓包确认） | 返回包含 `xqkList`，字段含企业名、需求描述、地区代码、联系人/电话等个人信息字段 | 未观测；可能支持分页（需抓包/参数试探） | **未观测需要**（匿名直访可得数据）citeturn12view1 |
> | `/zxqySy/tzggView` | GET | `id=...`（必填） | HTML详情页：标题、发布时间、正文 | 由列表端提供 id | 不适用（HTML页）citeturn13search3 |
> | `/zxqySy/xdtView` | GET | `id=...`（必填） | HTML详情页：所属平台、适用行业/场景、价格区间、长文本 | 由列表端提供 id | 不适用（HTML页）citeturn25view2 |
>
> #### 示例请求（cURL）
>
> > 说明：以下命令仅演示“对公开接口的低频访问”；请勿用于高并发扫库或绕过风控。
>
> ```bash
> # 1) 首页公告流（JSON）
> curl -s 'https://zjtx.miit.gov.cn/zxqySy/syTzgg' \
>   -H 'User-Agent: Mozilla/5.0' | head -c 600
>
> # 2) 需求库列表（JSON，响应含联系人/电话 等个人信息字段，务必合规处理）
> curl -s 'https://zjtx.miit.gov.cn/zxqySy/getXqkList' \
>   -H 'User-Agent: Mozilla/5.0' | head -c 600
> ```
>
> #### 示例响应片段（结构示意，字段已去标识/脱敏）
>
> ```json
> {
>   "zrarData": {"select":{}, "form":{}, "grid":{}, "tree":{}},
>   "warn": "",
>   "json": {
>     "tzggList": [
>       {"id":"...","title":"...","fbsj":"2026-03-24 ...","nr":"<p>...</p>", "sffb":"1"}
>     ]
>   },
>   "message":"",
>   "statusCode":"200"
> }
> ```
>
> ```json
> {
>   "zrarData": {"select":{}, "form":{}, "grid":{}, "tree":{}},
>   "warn":"",
>   "json":{
>     "xqkList":[
>       {
>         "id":"...",
>         "qymc":"某某有限公司",
>         "tyshxydm":"91**************",
>         "lxr":"某某",
>         "lxfs":"13*********",
>         "szsfmc":"某省",
>         "szsmc":"某市",
>         "xqmc":"需求标题...",
>         "xqms":"需求描述..."
>       }
>     ]
>   },
>   "message":"",
>   "statusCode":"200"
> }
> ```
>
> ### Python `requests` 取数样例（含最小化存储建议）
>
> ```python
> import json
> import time
> import requests
>
> BASE = "https://zjtx.miit.gov.cn"
>
> session = requests.Session()
> session.headers.update({
>     "User-Agent": "Mozilla/5.0 (compatible; research-bot/0.1; +https://example.com/bot)"
> })
>
> def fetch_json(path: str, timeout=15) -> dict:
>     url = BASE + path
>     r = session.get(url, timeout=timeout)
>     r.raise_for_status()
>     # 有些接口 Content-Type 可能不是 application/json，但内容仍是 JSON
>     return r.json()
>
> # 低频抓取示例（避免高并发）
> tzgg = fetch_json("/zxqySy/syTzgg")
> time.sleep(1.0)
> xqk = fetch_json("/zxqySy/getXqkList")
>
> # 最小化落库：建议同时保存“原始JSON（审计/可追溯）”与“抽取后的结构化字段”
> with open("tzgg_raw.json", "w", encoding="utf-8") as f:
>     json.dump(tzgg, f, ensure_ascii=False)
>
> with open("xqk_raw.json", "w", encoding="utf-8") as f:
>     json.dump(xqk, f, ensure_ascii=False)
> ```
>
> ## 反爬与安全机制评估与检测方法
>
> ### 已观测到的机制（证据）
>
> - **统一身份认证 + 风控要素**：登录页提供“电子营业执照”扫码登录与账号/手机相关功能入口；首页登录组件提示“获取验证码”（短信验证码语义明显）。这类体系通常对自动化登录、批量请求敏感。citeturn6view0turn31view0
> - **验证码（CAPTCHA）**：问卷页面出现“验证码”字段与验证码图片占位，并提供“提交”交互，属于典型的“阻断自动提交/批量灌数据”的 anti-bot 点。citeturn14view1
> - **部分资源访问异常（疑似需要特定Header/Referer或防盗链/网关策略）**：例如某些 PDF 资源在本环境抓取时报 `(400) OK` 或 Internal Error，提示可能存在访问策略、网关校验或工具兼容问题；需本地用浏览器/命令行复现确认。citeturn32view2turn8view0
>
> ### 尚未证实但需要重点排查的机制（给出检测方法）
>
> 以下属于常见 Web 安全/反爬配置项，本报告无法从当前抓取视图直接读取响应头与运行时脚本，因此以“检测清单”形式给出（优先级：中，耗时：半天–1天）：
>
> 1) **频率限制 / IP 限制**
>    - 检测：对同一接口做“逐步升压”的阶梯压测（例如 1 rps → 2 rps → 5 rps），观察是否出现 429/403、响应时间陡增、返回空列表或 `statusCode` 改变。
>    - 证据记录：保存每个阶段的响应码分布、RT、失败样本与时间窗。
>
> 2) **WAF/网关挑战（如 JS Challenge、特定 cookie 校验）**
>    - 检测：用 `curl -I` 对关键路径取响应头，关注 `Set-Cookie` 是否出现挑战 cookie、`Server`/`Via`/自定义头；或用无头浏览器观察是否出现“请稍后/验证中”。
>    - 注意：观察即可，不建议尝试绕过挑战（涉及规避安全控制的风险与合规问题）。
>
> 3) **CSP / CORS 与严格 Referer 校验**
>    - 检测：检查响应头 `Content-Security-Policy`、`Access-Control-Allow-Origin`。若接口仅允许同源访问，浏览器侧跨域调用会失败，但服务器端抓取（requests）仍可能可行。
>    - 证据记录：保留响应头与失败截图/HAR。
>
> 4) **动态签名/参数加密**（常见于移动端/敏感接口）
>    - 检测：抓包对比同一路径多次请求参数是否包含时间戳/nonce/hash；尝试复放请求是否可重放。
>    - 合规建议：若发现签名属于访问控制的一部分，应该走申请授权/官方接口，而非逆向破解。
>
> ## 合法合规与伦理风险提示
>
> ### robots.txt 与“可爬”边界
>
> 按《Robots Exclusion Protocol》标准，站点可以通过 `/robots.txt` 描述对爬虫的访问偏好与路径约束。该协议并非强制授权机制，但属于行业惯例，建议爬虫遵守并做缓存。citeturn17search0
>
> - **未能直接访问**：由于当前环境的 URL 打开限制与搜索不可达，本报告未能直接拉取该站点 robots.txt 内容，因此无法给出“允许/禁止路径”结论。
> - 建议你在本地执行（优先级：高，耗时：0.2小时）：
>
> ```bash
> curl -s 'https://zjtx.miit.gov.cn/robots.txt' | sed -n '1,120p'
> ```
>
> ### 个人信息/企业敏感数据的合规风险
>
> 本平台的“企业信息使用说明”明确提到企业填报信息用于部门间数据赋能且“不对社会公开”。这在政策语义上提示：平台对数据的预期使用场景是“政务服务/认定复核/精准施策”，而非公开数据集。citeturn31view0
>
> 更关键的是，`getXqkList` 响应字段中出现联系人与联系方式（电话）等信息，这些属于《中华人民共和国个人信息保护法》意义上的个人信息范畴；批量抓取、存储、再加工与对外提供会显著放大合规风险（合法性基础、告知同意、目的限定、最小化、保存期限、安全措施、审计等要求都可能触发）。citeturn12view1turn18search6
>
> 同时，《中华人民共和国数据安全法》对数据处理活动提出总体义务与分类分级、风险监测等框架要求；对“重要数据/政务数据”还可能存在更严格的地方性目录与要求。citeturn19search0
> 《中华人民共和国网络安全法》（含 2025 年修正相关决定）也提供网络数据与个人信息保护、等级保护等合规背景。citeturn20search1turn20search5
>
> **落地建议（优先级：高，耗时：0.5–2天，取决于组织流程）**
> 在任何“规模化采集”前，至少完成：
>
> - 明确合法性基础与用途边界：仅做内部研究/服务交付？是否涉及对外提供？
> - 明确数据分类：把“联系人/电话”等字段标注为 PII，默认不采集或不可逆脱敏后才进入分析/交付链路。
> - 建立可审计机制：记录采集时间、来源路径、字段白名单、访问频率、删除策略。
> - 若确需登录后数据或更深层模块：走**业务授权/接口申请**，并把“未提供认证凭证”作为当前限制条件写入需求说明（本报告已按该假设执行）。
>
> ## 爬虫设计、抽取清洗、存储交付、测试与运维建议
>
> ### 总体策略与范围分层
>
> 在“未授权登录、无内部 API 权限”的前提下，建议把采集目标分成三层（优先级建议）：
>
> - **P0（高）公开公告/政策类内容**：如公告列表接口 `syTzgg` + 详情页 `tzggView`。风险低、价值高、结构稳定。citeturn10view1turn13search3
> - **P1（中）公开展示的案例/方案类内容**：如 `xdtView` 等详情页；适合做知识库/检索与主题建模，但注意版权与再分发。citeturn25view2
> - **P2（谨慎）对接/需求库类数据**：如 `getXqkList`，因含联系人/电话等个人信息字段，除非有明确授权与最小化方案，否则不建议做“全量抓取+长期存储”。citeturn12view1turn18search6
>
> ### 爬虫架构建议（含断点续爬、限速、可审计）
>
> ```mermaid
> flowchart TB
>   subgraph Scheduler[调度层]
>     CRON[定时任务/手动触发]
>     PLAN[采集计划: 路径白名单+频率]
>   end
>
>   subgraph Fetch[采集层]
>     Q[URL队列/去重Bloom]
>     RL[限速器: RPS+并发+抖动]
>     RETRY[重试器: 指数退避+熔断]
>     HTTP[HTTP客户端: requests/aiohttp]
>   end
>
>   subgraph Parse[解析层]
>     HT[HTML解析: select/regex]
>     JS[JSON解析: schema校验]
>     NORM[标准化: 时间/地区/编码]
>   end
>
>   subgraph Store[存储层]
>     RAW[原始响应归档: JSON/HTML]
>     DB[(结构化库: Postgres)]
>     OBJ[(对象存储: 附件/PDF)]
>   end
>
>   subgraph QA[质量与合规模块]
>     PII[PII扫描/字段白名单]
>     METRIC[完整性/重复率/漂移监控]
>     AUDIT[审计日志: who-when-what]
>   end
>
>   CRON --> PLAN --> Q --> RL --> HTTP -->|HTML| HT --> NORM
>   HTTP -->|JSON| JS --> NORM
>   NORM --> RAW --> DB
>   NORM --> PII --> DB
>   DB --> METRIC --> AUDIT
> ```
>
> 关键工程点（尽量“可复用的工程模式”）：
>
> - **并发/限速策略（优先级：高）**：默认 1–2 并发、每域名 0.2–1 rps，加入随机抖动；把“申报期切换/工作日白天”视为风险时段，适度降低频率。
> - **重试与断点续爬（优先级：高）**：对网络错误/5xx 做指数退避；对 403/429 触发熔断；断点信息（最后成功的公告发布时间/ID、已抓取哈希）写入状态表。
> - **头部与 Cookie 管理（优先级：中）**：对公开接口尽量无 Cookie；若站点下发 cookie，用会话隔离并定期轮换；不要伪造登录态。
> - **JS 渲染处理方案（优先级：中）**：对“列表骨架页”（如 `tzggMore`）优先用 DevTools 抓包找到 XHR 接口，然后转为直连接口；只有在“无接口、必须渲染 DOM 才能拿到数据”时才用 Playwright/Selenium。citeturn6view1
> - **代理池（优先级：低/谨慎）**：仅用于可靠性（如出口不稳定）而非规避限制；一旦发现站点有明确频率限制或访问控制，应降低采集规模或走授权流程（避免“绕过”风险）。
>
> ### 字段抽取与清洗方案（以两类数据为例）
>
> **公告流（`syTzgg` + `tzggView`）**
>
> - 字段映射（建议最小集）：
>   - `notice_id`（`tzggList[].id`）
>   - `title`（`tzggList[].title`）
>   - `published_at`（`tzggList[].fbsj`，解析为 UTC+8 的时间戳）
>   - `content_html`（`tzggList[].nr` 或详情页正文）
>   - `source_path`（固定为 `/zxqySy/syTzgg` 或详情页路径）
> - 去重：以 `notice_id` 为主键；若无 id（某些列表页），以 `title + published_at` 的稳定哈希做辅助键。citeturn10view1turn13search3
>
> **需求库（`getXqkList`）——建议“字段白名单 + PII 默认不落库”**
>
> - 结构字段：行业（`sshy`）、产业链路径（`xxcy`）、地区（`szsfmc/szsmc/szqmc`）、需求标题/描述（`xqmc/xqms`）、提交/通过时间（`sqsj/tgsj`）。citeturn12view1
> - 时间标准化：`sqsj` 是对象结构（含 `time` 毫秒与 `timezoneOffset`），优先使用 `time` 转换为 ISO8601；`tgsj` 是字符串时间。citeturn12view1
> - 地理标准化：保留 `szsf/szs/szq` 行政区划代码与中文名（`szsfmc/szsmc/szqmc`），便于 join 外部行政区划表（但外部表也要注意许可）。citeturn12view1
> - PII 处理：`lxr/lxfs`（联系人/电话）默认不采集；如业务必须，建议做不可逆脱敏（例如电话仅保留号段与后四位，且不对外输出），并建立访问审批与到期删除机制。citeturn12view1turn18search6
>
> ### 存储与交付建议（含数据库模式示例与版本控制）
>
> 建议采用“双层存储”：
>
> 1) **原始层（Raw）**：按日期分区存储抓取到的原始 JSON/HTML（用于审计、可重跑、纠错）。
> 2) **结构化层（Curated）**：抽取后的表结构，用于分析/检索/报表。
>
> PostgreSQL 示例（公告）：
>
> ```sql
> CREATE TABLE notices (
>   notice_id        text PRIMARY KEY,
>   title            text NOT NULL,
>   published_at     timestamptz,
>   content_html     text,
>   source_path      text NOT NULL,
>   fetched_at       timestamptz NOT NULL DEFAULT now(),
>   content_hash     text
> );
>
> CREATE INDEX idx_notices_published_at ON notices(published_at);
> ```
>
> 版本控制建议（优先级：中，耗时：0.5–1天）：
>
> - 每次采集任务生成 `run_id`（时间戳+git commit），写入元数据表；
> - 交付数据推荐 Parquet（分析友好）+ CSV（业务兼容）双格式；
> - 重要字段变更（schema drift）触发版本号升级并通知下游。
>
> ### 测试计划与验证指标
>
> 建议把测试拆为“接口可用性”“数据质量”“性能基线”三类（优先级：高，耗时：1–2天）：
>
> - 覆盖率（Coverage）：
>   - 公告：`syTzgg` 返回条数与首页可见公告条数是否一致；抽样比对 `tzggView` 详情页可达率。citeturn10view1turn31view0
> - 完整性（Completeness）：
>   - `notice_id` 非空率、`title` 非空率、`published_at` 可解析率。
> - 准确性（Accuracy）：
>   - 抽样 50 条公告：标题/时间与详情页一致性；正文是否被截断。citeturn13search3
> - 性能基线（Performance）：
>   - 单条抓取平均耗时、失败率、重试次数分布；设置 SLO（如 99% 请求 < 2s）。
> - 合规指标：
>   - PII 字段落库率（目标为 0 或经批准的极小值）；脱敏覆盖率。citeturn18search6
>
> ### 风险缓解与运维建议（监控、告警、法律流程）
>
> - 监控与告警（优先级：高）：
>   - 指标：HTTP 状态码分布、429/403 占比、响应时间、解析失败率、schema drift（新增/缺失字段）。
> - IP/账号轮换（优先级：低/谨慎）：
>   - 若仅抓公开数据，优先单出口+限速；不要用轮换来规避限制。
> - 法律合规流程（优先级：高）：
>   - 在需求评审阶段就把“是否涉及联系人/电话等个人信息字段”作为红线审查项；引用平台“企业信息使用说明”作为用途边界证据，形成内部合规备忘。citeturn31view0turn18search6turn19search0
>
> ### 建议的实施优先级与时间估算
>
> | 工作包 | 目标 | 优先级 | 估时 |
> |---|---|---|---|
> | 公开公告采集（`syTzgg` + `tzggView`） | 构建可持续增量公告库 | 高 | 4–8 小时 |
> | DevTools 抓包固化接口清单（尤其 `tzggMore` 等列表页） | 把“推断”变“证据”，完善接口表 | 高 | 1 天 |
> | 数据质量与合规模块（PII 白名单、审计日志） | 可审计、可删、可证明合规 | 高 | 1–2 天 |
> | 数字化案例/方案详情采集（`xdtView` 等） | 建知识库/检索语料 | 中 | 1–2 天 |
> | 需求库类数据（`getXqkList`）的最小化策略与授权确认 | 明确是否采、采哪些字段、怎么脱敏 | 中（强合规依赖） | 1–3 天（含流程） |
> | JS 渲染兜底（Playwright） | 仅用于确无接口的页面 | 低 | 1–2 天 |
>
> （注：所有涉及登录后的申报/复核数据采集均属于“未提供认证凭证/未授权登录”的范围外工作，应先走授权与合规评审，再评估技术可行性。）citeturn6view0turn31view0

^7a558e

## Context
- Date captured: 2026-04-10 18:21
- Prompt: [工信部中小企业局专精特新平台](https://zjtx.miit.gov.cn/zxqySy/main#). 这是本项目（注：Statistic Modeling）政策爬取目标网站，请你以数据科学家/计算机专家/网络爬虫专家对其进行分析。(*Deep research*)
- Conversation link: https://chatgpt.com/g/g-p-69c9f8a889608191bd35785d17ace034/c/69d8c9a0-7624-83e8-9310-5da71f57a0b5

## Related
- [[statistic-modeling/20-zjtx-miit-gov-cn]]

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
