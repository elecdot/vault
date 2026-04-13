---
tags:
  - web
  - data
kind: resource
format: note
project: "[[statistic-modeling]]"
source: "[工信部中小企业局专精特新平台](https://zjtx.miit.gov.cn/zxqySy/main#)"
aliases:
  - 工信部中小企业局专精特新平台
---

# 工信部中小企业局专精特新平台

## Focus
A analysis of scrape policies on [工信部中小企业局专精特新平台](https://zjtx.miit.gov.cn/zxqySy/main#).

>[!tldr] 本报告以数据科学家/计算机与爬虫工程视角，对“优质中小企业梯度培育平台”（常被企业与地方通知称为“专精特新申报平台”）的公开侧页面、可直接访问的数据接口、登录与验证码等防自动化机制进行证据驱动的结构化分析：
>- 平台采用统一身份认证（含短信验证码与“电子营业执照”扫码），首页与部分栏目通过 AJAX/接口返回 JSON（出现统一的 `zrarData/json/statusCode` 包装），部分列表页在无 JS 渲染时仅出现“骨架/空内容”，表明需抓包识别后台接口；
>- 至少存在两个无需登录即可返回结构化数据的接口（公告流与需求库列表），其中“需求库/对接类数据”响应中包含联系人与电话等个人信息字段，带来较高的合规与伦理风险，爬虫应以“最小化采集、合规授权、低频限速、可审计与可回溯”为首要设计原则。

## Notes

Look [[20a-zjtx-miit-gov-cn]] because I totally no idea about it:

Paste the web structure here so you can take ref:


页面URL（相对路径/域名+路径）   | 功能                                                     | 是否动态加载（证据型判断）                                                      | 可见数据字段示例（节选）                                                                                          |
------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
`/zxqySy/main`                  | 门户首页；聚合公告、模块入口、申报期状态、咨询与举报渠道 | **混合**：既有静态文本，也有轮播/列表等动态区域；页面内出现登录组件与多入口导航 | 公告标题/日期、模块名称（创新型/专精特新/小巨人等）、咨询电话、举报邮箱、企业信息使用说明文本等citeturn31view0 |
`/zxqy/`                        | 登录欢迎页（平台侧入口）                                 | 可能静态（欢迎语）                                                              | “欢迎登录系统”等citeturn13search1                                                                              |
`/qyxx/gotosy`                  | 跳转至统一身份认证（SSO/跳转中间页）                     | **重定向**（服务器侧）                                                          | 跳转参数 `toUrl` 指回主站citeturn5view0                                                                        |
`ucenter.miit.gov.cn/login.jsp` | 统一身份认证登录页（账号体系）                           | **动态/强交互**：包含扫码登录、短信验证码等                                     | 电子营业执照扫码登录提示、登录按钮、手机相关功能入口等citeturn6view0                                           |
`/zxqySy/tzggMore`              | “公告/通知”更多列表（部级/省级等Tab）                    | **是（强）**：无 JS 时只看到Tab与搜索骨架，列表内容不呈现，推断列表依赖 AJAX    | Tab（重要通知/地方发布等）、搜索框、分页组件痕迹等citeturn6view1                                               |
`/zxqySy/tzggView?id=…`         | 公告详情页                                               | **否/弱**：详情内容可直接呈现（HTML）                                           | 标题、发布时间、正文内容等citeturn13search3turn13search6                                                      |
`/zxqySy/syTzgg`                | 首页公告流数据（JSON）                                   | **是（接口直出）**：直接返回 JSON 包装数据                                      | `tzggList[].id/title/fbsj/nr` 等citeturn10view1                                                                |
`/zxqySy/xdtMain`               | 数字化转型相关“典型案例/方案”列表+筛选                   | **混合**：页面可见筛选项与部分内容，但筛选联动高度疑似 AJAX                     | 行业筛选、场景筛选、结果列表摘要、查看详情等citeturn25view0                                                    |
`/zxqySy/xdtView?id=…`          | 数字化方案/案例详情                                      | **否/弱**：详情内容可直接呈现（HTML）                                           | 所属数字化平台、适用行业/场景、部署价格、案例文本等citeturn25view2                                             |
`/zxqySy/hyzx`                  | “细分行业转型实践样本”行业集合页                         | **否/弱**：行业列表直出                                                         | 行业名称列表（如半导体、轨交装备、生物医药等）citeturn32view1                                                  |
`/szhzx/`                       | 全国中小企业数字化转型服务平台（子站）                   | **未能直接访问**：抓取视图为空（多为重 JS/或需特定加载）                        | 未获页面可见字段（需浏览器渲染/抓包确认）citeturn32view0                                                       |
`/xqdj`                         | “校企对接/供需对接”聚合页                                | **混合**：可见模块卡片与“查看更多”，但对接库入口多为跳转/交互                   | 活动信息、需求库/成果库模块、公告摘要等citeturn32view3                                                         |
`/zxqySy/demandListMore`        | 对接库列表页之一（页面标题仍为校企对接）                 | **是（疑似）**：列表项可见但“查看详情”不可直接解析为链接（疑似 JS 事件）        | 列表序号、成果库名称、权属人、意向价格等citeturn33view0turn24view0                                            |
`/zxqySy/resultReleaseMore`     | 成果库/结果发布列表页（可见“共167条”）                   | **混合**：至少可见总数与列表摘要；详情仍可能需 JS                               | “搜索共167条”、权属人、意向价格等citeturn33view1                                                               |
`/zxqySy/getXqkList`            | 需求库列表数据（JSON，包含联系人/电话等）                | **是（接口直出）**：直接返回 JSON                                               | `xqkList[].qymc/lxr/lxfs/xqmc/xqms/szsfmc/szsmc/tyshxydm` 等citeturn12view1                                    |
`/zxqySy/standardRequirement`   | “专精特新中小企业标准化需求调查问卷”页面                 | **是（交互）**：出现“验证码”与提交流程                                          | 企业名称、统一社会信用代码、联系人、联系方式、问卷选项、验证码图片等citeturn14view1                            |
`/zxqySy/schoolEnterpriseMore`  | 校企对接活动信息更多页                                   | **是（疑似）**：当前仅骨架+搜索                                                 | 活动信息tab、搜索框等citeturn33view2                                                                           |
`/ptczsc.pdf`                   | 平台操作手册（多通知引用）                               | **未能直接访问**：工具打开报错（Internal Error），需本地复现                    | 未获取PDF内容；但被用户手册引用为操作指南地址citeturn27view0turn8view0                                        |
`/rzcjdxal.pdf`                 | （疑似）人才/案例类 PDF                                  | **未能直接访问**：请求返回异常（400 OK）                                        | 未获取PDF内容citeturn32view2                                                                                   |

## Related
- [[statistic-modeling]]
- [[statistic-modeling/00-roadmap]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
