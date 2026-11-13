# WP07-FINAL Diff Review — WP07-FINAL-001-A

**Base tip before FINAL edit:** `bc78782c20477c4e12b0cb8835cf52fc0c2bbdc3`  
**Change scope:** Minimal ZH disclaimer wording only (+ docs packet). EN disclaimer **not** changed.

## App code Diff (complete)

```diff
diff --git a/apps/web/app/osa-smart-ring-technology/page.tsx b/apps/web/app/osa-smart-ring-technology/page.tsx
@@ -97,7 +97,7 @@
           「医疗向 / medical-oriented」描述的是 LONGVON 在智能戒指项目上的工程与质量取向，
           <strong>不</strong>表示 Ring1C 或本页所述任何产品已获医疗器械批准，也不表示 LONGVON
-          已持有未经证书入库证明的 FDA、CE Medical Device、NMPA 等产品认证。
+          已取得 FDA、CE 医疗器械或 NMPA 等相关产品批准或认证。具体产品的监管状态应以适用市场的正式监管文件为准。
```

## EN/ZH meaning check
| Point | EN (unchanged) | ZH (updated) | Aligned? |
|---|---|---|---|
| medical-oriented ≠ device approval | Yes | Yes | Yes |
| No FDA/CE/NMPA product claim without formal evidence | “unless certificates are separately on file” | “应以适用市场的正式监管文件为准” | Yes |
| Ring1C not medical device | Yes | Yes | Yes |
| AHI/ODI/screening ≠ diagnosis / ≠ PSG | Yes | Yes | Yes |

## Files modified in FINAL commit
- `apps/web/app/osa-smart-ring-technology/page.tsx` (code)
- WP07 FINAL docs under `docs/geo/phase-4.2/wp07-osa/`
- `OSA-MEDICAL-CLAIMS-FINAL-REVIEW.md` ZH text sync
- `evidence/ssr-smoke-wp07-final-001.txt`
