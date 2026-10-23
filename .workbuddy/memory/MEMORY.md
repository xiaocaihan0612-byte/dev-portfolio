# dev-portfolio-master 项目长期笔记

## 用户个人信息（用于作品集内容）
- 姓名：肖彩涵
- 学校/专业：北京体育大学，24 级智能体育工程专业
- 成绩：绩点全院前 10；参加过黑客松，计算机设计大赛全国二等奖
- 爱好：看音乐剧/舞台剧/话剧（北京剧场）、给偶像剪视频

## 用户联系方式（「找到我」区块）
- GitHub：https://github.com/xiaocaihan0612-byte
- 邮箱：xiaocaihan0612@gmail.com
- 电话：15006225666（tel:+8615006225666）
- 微信：xcq170525（点击复制微信号，无二维码图片）

## 项目约定
- 站点文案全部使用简体中文；技术专有名词（语言/框架/库名）保留英文。
- 站点内容由 public/profile/*.json 驱动，改文案优先改 JSON 而非组件。
- 日间模式使用「光与蝶」粉紫主题：底图 public/images/bg/butterfly-light.jpg，主色玫瑰粉 #c25e7a + 薰衣草紫 #9a7fc0；夜间模式为同款暗夜版（深梅紫黑雾层压暗）。
- npm 安装需用 --legacy-peer-deps（npm 10.9.7 arborist bug）。
- 个人照片：public/images/about/profile.jpg（用户提供）。
- 可视化编辑页：入口 http://localhost:3000/edit（隐藏、不进导航），默认密码 admin123（存 localStorage 可改）。内容保存到浏览器 localStorage（profile_override:* 前缀覆盖 public/profile JSON），组件统一走 src/utils/profileStore.js 的 loadProfile。
