# Waline 接入阿里云 OSS

评论图片由浏览器直传 OSS。Netlify Function 只生成 60 秒有效、绑定单个随机对象名的 V4 表单签名，AccessKey 不会进入浏览器资源。

## OSS

- Bucket：`terminal-astro`
- Region ID：`cn-shanghai`
- Endpoint：`oss-cn-shanghai.aliyuncs.com`
- 上传前缀：`waline/`
- 支持格式：JPEG、PNG、WebP、GIF
- 默认大小限制：5 MB

在 Bucket 的“数据安全 → 跨域设置”中添加：

- 来源：`http://localhost:*`、`http://127.0.0.1:*`、正式站点来源
- Methods：`GET`、`POST`
- Allowed Headers：`*`
- Expose Headers：`ETag`、`x-oss-request-id`
- Max Age：`600`
- 开启 `Vary: Origin`

Bucket 不得设为公共读写。若图片需要匿名展示，可以仅允许读取 `waline/*`，上传始终由 RAM 签名控制。

## RAM 最小权限

给专用 RAM 用户绑定自定义策略，并把 `terminal-astro` 替换为实际 Bucket 名称（当前项目已经填写）：

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

不要授予 `AliyunOSSFullAccess`，也不要创建主账号 AccessKey。

## 环境变量

参考根目录 `.env.example`。`OSS_ACCESS_KEY_ID` 和 `OSS_ACCESS_KEY_SECRET` 只添加到 Netlify 的环境变量控制台；不要添加 `PUBLIC_` 前缀，也不要提交真实值。

## 完全本地测试

项目包含仅在 Vite 开发服务器生效的 OSS 签名中间件。因此本地只需正常启动 Astro：

```powershell
pnpm astro dev --background
```

页面仍请求 `/.netlify/functions/oss-upload-policy`，本地由 Astro 开发中间件处理，部署后则由同路径的 Netlify Function 处理。本地测试不要求 Netlify CLI、账号、站点连接或部署，也不会消耗 Netlify credits。
