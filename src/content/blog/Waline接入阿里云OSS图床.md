---
title: Waline 接入阿里云 OSS 图床
description: 在 Astro 与 Netlify 项目中为 Waline 配置阿里云 OSS 图片上传，并处理匿名上传、密钥保护、同源代理、本地调试与费用排查。
date: 2026-08-29
tags: [Waline, Astro, OSS, Netlify]
sticky: 0
draft: false
toc: true
mathjax: false
mermaid: false
donate: true
comment: true
---

# Waline 接入阿里云 OSS 图床

Waline 默认会把评论图片转成 Base64 放进评论内容。少量使用没有问题，但图片会让评论正文和数据库迅速膨胀，也不利于缓存和独立管理。更合适的做法是把原图上传到对象存储，只让 Waline 保存图片 URL。

本文记录 Terminal 4 的完整方案：Astro 页面使用 Waline，Netlify Function 生成一分钟有效的阿里云 OSS 上传凭证，浏览器拿到凭证后直传 OSS。匿名访客可以上传图片，但永远接触不到 RAM 用户的 AccessKey Secret。

## 1. 为什么没有继续使用兰空图床

Waline 的 `imageUploader` 可以连接任意图床，兰空图床也是官方示例之一。但兰空图床本身是一个需要长期运行的 PHP 应用，还需要数据库、可写磁盘和固定服务端。

Netlify 更适合托管静态站点和短时运行的 Function，没有虚拟主机时，为一项评论图片功能单独维护兰空图床并不划算。阿里云 OSS 本身就是持久化对象存储，更适合当前架构。

这不是说兰空图床不好，而是部署条件不同：

| 方案 | 适合场景 |
| --- | --- |
| 兰空图床 | 已有服务器、PHP、数据库，希望获得完整图床后台 |
| 阿里云 OSS | 静态站点、Serverless、只需要稳定保存和分发文件 |

## 2. 最终架构

整个上传过程如下：

```text
访客选择图片
    ↓
Waline imageUploader
    ↓ 请求短期上传凭证
Netlify Function
    ↓ 使用仅存在服务端的 RAM AccessKey 计算 V4 签名
浏览器获得一分钟有效、仅允许一个文件的 Policy
    ↓ 直接上传，不经过 Netlify 中转图片数据
阿里云 OSS
    ↓ 返回公开图片 URL
Waline 把 Markdown 图片链接写入评论
```

这里有两个关键点：

1. 图片本体从浏览器直接进入 OSS，不占用 Netlify Function 的传输和运行资源。
2. AccessKey Secret 只用于服务端签名，不会出现在浏览器、GitHub 仓库或评论内容中。

Waline 的 `imageUploader` 接收一个 `File`，最后返回 `Promise<string>`，这个字符串就是写入评论的图片地址。

## 3. 创建 OSS Bucket

本项目使用的示例配置是：

```text
Bucket：terminal-astro
地域：华东 2（上海）
Region ID：cn-shanghai
外网 Endpoint：oss-cn-shanghai.aliyuncs.com
存储类型：标准存储
存储冗余：本地冗余
```

个人博客图床直接选择“标准存储 + 本地冗余”即可。同城冗余会跨可用区保存，可靠性更高、价格也更高，评论图片一般没有必要使用。

本地冗余中的“本地”是指数据在同一地域可用区内保存，不是只能从本机访问。部署到 Netlify 后，任何能访问图片 URL 的浏览器都可以加载文件。

### 3.1 读写权限

不要把 Bucket 设置为公共读写。否则任何人都能绕过网站直接向 Bucket 写入文件。

推荐配置：

- 写入：保持私有，只允许专用 RAM 用户执行 `oss:PutObject`。
- 读取：允许匿名读取 `waline/*` 前缀下的图片，或者给这些 Object 设置公共读权限。
- 上传入口：只接受 Netlify Function 签发的短期 Policy。

如果上传成功但图片地址返回 403，通常不是签名失败，而是文件仍然不可公开读取。此时检查 Bucket Policy、Object ACL 和“阻止公共访问”设置。

### 3.2 CORS

浏览器是从博客域名跨域 POST 到 OSS，因此需要在 Bucket 的“数据安全 → 跨域设置”中添加规则。

建议值：

| 配置 | 值 |
| --- | --- |
| 来源 | `https://t3rminal4.netlify.app` |
| 本地来源 | `http://localhost:4321`、`http://127.0.0.1:4321` |
| 允许方法 | `POST`、`GET`、`HEAD` |
| 允许 Headers | `*` |
| 暴露 Headers | `ETag` |

生产环境最好填写准确域名，不要长期使用 `*` 作为允许来源。

## 4. 创建专用 RAM 用户

路径通常是：

```text
阿里云控制台
→ 访问控制 RAM
→ 身份管理
→ 用户
→ 创建用户
```

为它创建 AccessKey，但不要授予管理员权限，也不要直接使用主账号 AccessKey。

最小权限只需允许向指定目录上传：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["oss:PutObject"],
      "Resource": ["acs:oss:*:*:terminal-astro/waline/*"]
    }
  ]
}
```

这意味着即使凭证意外泄漏，权限范围也只覆盖 `terminal-astro/waline/`，不能管理其他 Bucket，也不能删除整个存储空间。

AccessKey Secret 通常只展示一次。保存后不要截图、不要写进文章、不要提交到 Git。

## 5. 环境变量

本地开发在项目根目录创建 `.env`：

```dotenv
OSS_ACCESS_KEY_ID=请填写RAM用户的AccessKeyID
OSS_ACCESS_KEY_SECRET=请填写RAM用户的AccessKeySecret

OSS_BUCKET=terminal-astro
OSS_REGION=cn-shanghai
OSS_ENDPOINT=oss-cn-shanghai.aliyuncs.com
OSS_PUBLIC_BASE_URL=https://terminal-astro.oss-cn-shanghai.aliyuncs.com
OSS_ALLOWED_ORIGINS=http://localhost:4321,http://127.0.0.1:4321,https://t3rminal4.netlify.app
OSS_MAX_FILE_SIZE_MB=5

PUBLIC_OSS_UPLOAD_ENABLED=true
PUBLIC_OSS_MAX_FILE_SIZE_MB=5
```

项目的 `.gitignore` 已忽略 `.env` 和 `.env.*`，只保留可以公开的 `.env.example`。提交前仍然要运行：

```bash
git status --short
```

确认没有把 `.env` 或任何 AccessKey 带入提交。

### 5.1 哪些变量可以公开

只有两个 `PUBLIC_` 变量会进入浏览器构建结果：

```text
PUBLIC_OSS_UPLOAD_ENABLED
PUBLIC_OSS_MAX_FILE_SIZE_MB
```

它们只是功能开关和大小限制，不是秘密。

以下变量绝对不能加 `PUBLIC_` 前缀：

```text
OSS_ACCESS_KEY_ID
OSS_ACCESS_KEY_SECRET
```

Astro 只允许客户端代码读取 `PUBLIC_` 前缀变量，这也解释了为什么“明明在 Netlify 填了配置，图片按钮却没有出现”：如果缺少 `PUBLIC_OSS_UPLOAD_ENABLED=true`，构建出来的客户端会主动关闭 `imageUploader`。

## 6. Netlify 环境变量

在 Netlify 站点中进入：

```text
Site configuration
→ Environment variables
```

把上一节的变量逐项添加。AccessKey 两项至少要包含 Functions 运行时作用域；`PUBLIC_OSS_UPLOAD_ENABLED` 必须能在 Build 阶段读取。

环境变量修改后必须创建一次新部署。已经完成的旧部署不会自动获得新变量，前端的 `PUBLIC_` 变量更是在构建时就已经写入静态资源。

为了节省构建额度，可以把相关代码和环境变量一次配置完整后再统一部署，而不是每改一个值就 push 一次。

## 7. Netlify Function 生成上传 Policy

签名函数位于：

```text
netlify/functions/oss-upload-policy.mjs
```

它没有接收完整图片，只接收 MIME 类型和文件大小，然后执行以下操作：

- 只允许 JPEG、PNG、WebP 和 GIF。
- 默认限制在 5 MB 内。
- Object Key 使用 `waline/YYYYMMDD/UUID.ext`，避免重名覆盖。
- Policy 只存活 60 秒。
- Policy 绑定 Bucket、Object Key、类型和大小。
- 使用 OSS V4 HMAC-SHA256 签名。
- 按 IP 限制为每分钟最多请求 10 次 Policy。
- 只接受允许来源发出的请求。

Function 路由是：

```text
/.netlify/functions/oss-upload-policy
```

核心结构如下：

```js
export default async function handler(request) {
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;

  // 校验来源、文件类型与文件大小
  // 生成一分钟有效的 Policy
  // 使用 RAM AccessKey 在服务端计算 V4 签名

  return Response.json({
    host,
    publicUrl: `${publicBaseUrl}/${key}`,
    fields: signedFields,
  });
}

export const config = {
  path: '/.netlify/functions/oss-upload-policy',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['ip'],
    windowLimit: 10,
    windowSize: 60,
  },
};
```

匿名访客拿到的不是永久 AccessKey，而是一张很快过期、只能上传指定文件的临时“票”。这就是允许匿名上传同时保护账号密钥的关键。

## 8. 在 Waline 中接入 imageUploader

评论组件位于：

```text
src/components/WalineComment.astro
```

上传流程先向 Netlify 请求 Policy，再把表单直传 OSS：

```ts
async function uploadToOss(file: File): Promise<string> {
  const policyResponse = await fetch('/.netlify/functions/oss-upload-policy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });

  const policy = await policyResponse.json();
  if (!policyResponse.ok) throw new Error(policy.message);

  const formData = new FormData();
  Object.entries(policy.fields).forEach(([name, value]) => {
    formData.append(name, value as string);
  });

  // OSS 要求 file 是 multipart 表单中的最后一个字段。
  formData.append('file', file);

  const response = await fetch(policy.host, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error(`Image upload failed (${response.status}).`);
  return policy.publicUrl;
}
```

然后传入 Waline：

```ts
init({
  el: root,
  serverURL: walineServerUrl,
  imageUploader: ossUploadEnabled ? uploadToOss : false,
});
```

当 `imageUploader` 是函数时，Waline 会显示上传图片入口；当它是 `false` 时，入口会被禁用。

## 9. 为什么还要代理 Waline Server

OSS 解决的是图片存储，Waline Server 仍然负责评论数据库、登录、审核和评论 API。

原来的 Waline 部署在：

```text
https://waline-blog-tau-three.vercel.app
```

部分公司网络会直接拦截 `*.vercel.app`。即使博客和 OSS 都能打开，浏览器请求 Waline API 时仍然会超时。解决方法是在 Netlify 上提供同源入口：

```text
浏览器请求 https://t3rminal4.netlify.app/waline-api/*
    ↓
Netlify Function 转发
    ↓
https://waline-blog-tau-three.vercel.app/*
```

客户端始终使用：

```ts
const walineServerUrl = new URL('/waline-api/', window.location.origin).href;
```

代理函数位于：

```text
netlify/functions/waline-proxy.mjs
```

它转发请求方法、查询参数和正文，同时删除 `host`、`x-forwarded-host`、`content-length` 等不应该原样带给 Vercel 的头。

不要把“图片上传签名函数”和“Waline API 代理”混为一谈：

| Function | 作用 |
| --- | --- |
| `oss-upload-policy` | 给浏览器签发 OSS 临时上传 Policy |
| `waline-proxy` | 转发评论读取、发布、登录等 Waline API |

## 10. 本地开发

项目通过 `scripts/local-oss-policy-vite.mjs` 在 Astro 开发服务器中挂载同一个签名函数，因此不安装 Netlify CLI 也能验证 OSS 上传。

启动前确认 `.env` 已填写，然后运行：

```bash
pnpm astro dev --background
pnpm astro dev status
```

打开：

```text
http://localhost:4321/memos
```

本地访问 `/.netlify/functions/oss-upload-policy` 时，Vite 插件会调用和线上相同的函数代码。

当前项目还把本地 `/waline-api/*` 转发到已部署的 Netlify 站点。原因是公司网络不仅可能拦截浏览器访问 Vercel，还可能阻断本机 Node.js 到 Vercel 的连接。于是本地预览的评论链路是：

```text
localhost → t3rminal4.netlify.app/waline-api → Vercel Waline
```

这也意味着第一次使用前，必须先把线上 `waline-proxy` 部署成功。

## 11. 部署与验证顺序

建议按下面顺序验证，不要一次面对所有变量。

### 11.1 确认 Waline 上游正常

先直接访问 Waline Server 的评论接口。如果返回 JSON，说明 Waline 部署和数据库正常；如果返回：

```text
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
```

问题在 Vercel 部署本身，需要在 Vercel 的 Deployments 中重新部署或 Promote to Production。此时修改 OSS、RAM 或 Netlify 环境变量都没有用。

### 11.2 确认 Netlify 识别两个 Function

部署详情中应该能看到：

```text
oss-upload-policy
waline-proxy
```

### 11.3 确认同源评论接口

访问：

```text
https://t3rminal4.netlify.app/waline-api/api/comment?path=%2Fmemos-feed%2F&pageSize=20&page=1&lang=en&sortBy=insertedAt_desc
```

正确结果是 JSON，而不是站点 404、Vercel `DEPLOYMENT_NOT_FOUND` 或长时间超时。

### 11.4 确认图片按钮和上传

最后进入 Memos/Junk：

1. 确认图片上传按钮出现。
2. 选择小于 5 MB 的 JPEG、PNG、WebP 或 GIF。
3. Network 中先出现 Policy 请求，再出现向 OSS 的 POST。
4. 评论框得到 Markdown 图片链接。
5. 发布后在其他浏览器中也能加载图片。

## 12. 常见错误

| 现象 | 原因 | 排查方式 |
| --- | --- | --- |
| 没有图片上传按钮 | 构建时没有 `PUBLIC_OSS_UPLOAD_ENABLED=true` | 修改 Netlify 变量并重新部署 |
| Policy 返回 403 | 当前 Origin 不在允许列表 | 检查 `OSS_ALLOWED_ORIGINS`，不要带多余路径 |
| Policy 返回 503 | Function 读不到 RAM 凭证 | 检查变量名称和 Functions 作用域 |
| OSS 返回 `SignatureDoesNotMatch` | Region、Endpoint、Policy 字段或系统时间错误 | 上海应使用 `cn-shanghai` 与对应 Endpoint |
| OSS 上传请求格式错误 | `file` 不是最后一个表单字段 | 最后再执行 `formData.append('file', file)` |
| 上传成功但图片 403 | Object 不允许匿名读取 | 检查 `waline/*` 的读取策略和公共访问设置 |
| 本地上传可用、线上没有按钮 | 本地 `.env` 有开关，Netlify Build 没有 | 在 Netlify 添加 PUBLIC 变量并重新部署 |
| 评论接口超时 | 网络拦截 Vercel | 使用 `/waline-api/` 同源代理 |
| 同源接口返回 `DEPLOYMENT_NOT_FOUND` | Vercel Waline 生产部署失效 | 在 Vercel 重新部署并绑定 Production |
| Bucket 显示“数据准备中” | Bucket 刚创建，服务未完全就绪 | 等待准备完成后再判断凭证是否有误 |

## 13. 为什么评论不能直接嵌入 iframe

下面这种网易云播放器可以放在仓库中的 Review 或文章 Markdown 里：

```html
<iframe src="//music.163.com/outchain/player?..." title="网易云音乐播放器"></iframe>
```

但把同样内容提交到 Waline 后，后台只会剩下普通文字。这不是 Markdown 配置错误，而是 Waline 服务端使用 DOMPurify 清洗评论，明确禁止 `<iframe>`、脚本、表单等可能造成 XSS 的 HTML。

两类内容的信任边界不同：

- 仓库 Markdown 由站长维护，可以视为可信内容。
- Waline 评论允许匿名提交，必须当作不可信输入。

不要为了播放器关闭评论安全过滤。更安全的做法是让评论者发送普通歌曲链接，或者设计 `[music:2671017885]` 这样的纯文本语法，再由本站只针对数字 ID 生成固定的网易云 iframe。

## 14. OSS 费用怎么看

选择本地冗余只决定存储副本方式，不会免除流量和请求费用。一次评论图片访问可能同时产生：

```text
保存图片 → 标准存储（本地冗余）容量
上传图片 → PUT 请求
查看图片 → GET 请求
图片传到访客浏览器 → 外网流出流量
```

上传到 OSS 的外网流入流量免费；从 OSS 加载到访客浏览器的外网流出流量收费。

这次小规模实测约有 2.47 MB 文件、24.77 MB 月外网流量和数百次请求，月内累计应付约 0.012 元。真正占主要比例的是外网流出流量，PUT/GET 请求在当前阶梯内为 0 元。

因此个人博客初期不需要看到一个计费项就买一个资源包。OSS 默认按量付费，资源包只是针对稳定、大量用量的预付抵扣工具：

- 本地冗余存储包只抵扣本地冗余存储。
- 同城冗余存储包只抵扣同城冗余存储。
- 下行流量包只抵扣外网流出流量。
- 请求包只抵扣对应 PUT/GET 请求。

如果账单同时出现本地冗余和同城冗余，而当前 Bucket 明确是本地冗余，应导出“分账明细”，通过“分拆项 ID / 分拆项名称”定位具体 Bucket。普通“计费项账期汇总”只聚合到地域和存储类型，不能判断费用属于哪个 Bucket；OSS 的 Bucket 级分账还可能延迟约 72 小时。

## 15. 安全检查清单

上线前再检查一次：

- [ ] 没有使用阿里云主账号 AccessKey。
- [ ] RAM 用户只拥有 `terminal-astro/waline/*` 的 `oss:PutObject`。
- [ ] Bucket 不是公共读写。
- [ ] AccessKey Secret 没有 `PUBLIC_` 前缀。
- [ ] `.env` 已被 `.gitignore` 忽略。
- [ ] Netlify Function 只允许指定 Origin。
- [ ] Policy 有短过期时间、文件类型和文件大小限制。
- [ ] 上传 Policy 接口有频率限制。
- [ ] 公共读取只覆盖需要展示的图片前缀。
- [ ] Waline Server 和 OSS 使用两个独立的故障排查入口。

## 16. 参考资料

- [Waline：自定义图片上传](https://waline.js.org/cookbook/customize/upload-image.html)
- [Waline：客户端 imageUploader 属性](https://waline.js.org/reference/client/props.html)
- [Waline：评论安全与 iframe 限制](https://waline.js.org/guide/features/safety.html)
- [阿里云 OSS：PostObject](https://help.aliyun.com/zh/oss/developer-reference/postobject)
- [阿里云 OSS：POST V4 签名](https://help.aliyun.com/zh/oss/developer-reference/signature-version-4-recommend)
- [阿里云 OSS：权限与访问控制](https://help.aliyun.com/zh/oss/user-guide/permissions-and-access-control-overview)
- [阿里云 OSS：计费概述](https://help.aliyun.com/zh/oss/billing-overview)
- [Netlify：Function 环境变量](https://docs.netlify.com/build/functions/environment-variables/)
- [Netlify：Functions API](https://docs.netlify.com/build/functions/api/)
- [Astro：环境变量](https://docs.astro.build/zh-cn/guides/environment-variables/)

