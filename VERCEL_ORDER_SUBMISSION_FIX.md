# iShine Massage — Order Submission Fix (2026-07-27)

## 问题
用户在前端提交预约时出现 "Submission failed"。

## 根因（真正的两层）
1. **主因：Vercel 函数目录只读（EROFS）。** 原 `server/routes/orders.js` 的 `saveOrders()` 往 `server/data/orders.json` 写文件，Vercel serverless 代码目录只读，抛 `EROFS` → 500 → 前端 catch 到 → "Submission failed"。
2. **调试中的干扰（非真实根因）：**
   - PowerShell 在 `curl -d $body` 里把 JSON 双引号吃掉了，发出的是非法 JSON，导致本地测试一度出现 400（误以为是 body 解析问题）。
   - 我在调试时给 orders.js POST handler 留了个 `return;"` 笔误，造成模块语法错误 → `require` 失败 → 所有路由 500（FUNCTION_INVOCATION_FAILED）—— 这是调试期间的假象，不是 Vercel 流读取问题。

## 验证结论
- `express.json()` 对**合法** JSON 工作正常（之前 `{}` 能解析到 500，说明解析 OK）。
- Vercel 的 `req` 流在手动 `req.on('data')` 方式下不可靠（FUNCTION_INVOCATION_FAILED），所以恢复用 `express.json()`，不要自己读流。
- 直接 `app.post` 与 `router.post` 都能正常收到 body（两者 500 是因为模块语法错误连带 api/index.js 加载失败，非路由差异）。

## 修复
`server/routes/orders.js`：
- 新增 `isVercel` 判断（`process.env.VERCEL` / `AWS_LAMBDA_FUNCTION_NAME`）。
- `readOrders()` / `saveOrders()` 在 Vercel 下优先读写 `/tmp/orders.json`，再回退代码目录；全部失败也不抛错（仅 `console.warn`），保证请求返回 201。
- 恢复 `express.json()`（api/index.js），POST handler 直接用 `req.body`。

## 测试结果（线上）
- `POST /api/orders` 合法 JSON → **201**，字段全部正确写入（storeId/customerName/phone/date/time/note 都有）。
- `GET /api/orders` → 200（Vercel 上为 `[]`，见下方 caveat）。

## ⚠️ 重要限制（仍需处理）
Vercel serverless 的 `/tmp` 是**临时/按实例**的：冷启动或重新部署后会清空，且不同实例不共享。所以：
- 预约"提交成功"已没问题，但**预约数据不会可靠留存**，商家也收不到。
- 若要做成真正可用的预约系统，需把预约送达商家，可选方案：
  1. **邮件通知**（需 SMTP 凭据，如腾讯企业邮 / SendGrid / Resend）。
  2. **Google Sheets**（用户部署一个 Apps Script Web App，我们 POST 过去，免费、无需我方密钥，推荐）。
  3. **真数据库**（Supabase / Vercel Postgres，需配置）。

## 下次要做（待用户确认）
与用户确认用哪种方式持久化/通知预约，并实现。当前提交成功的修复已经上线（commit 3dad2d0）。

## 备注
- 工作区残留未跟踪文件 `body_test.json`（提交测试用），未被提交，可删除。
- PowerShell 发 JSON 给 curl 务必用文件：`curl -d "@file.json"`，避免引号被吞。
