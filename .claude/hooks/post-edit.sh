#!/usr/bin/env bash
# Non-blocking Claude Code post-edit hints for generated files.

INPUT="$(cat)"

FILE=$(printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log((JSON.parse(s).tool_input?.file_path||"").replace(/\\/g,"/"))}catch{console.log("")}})' 2>/dev/null)

if [[ "$FILE" == *"/src/routes/"* ]] && [[ "$FILE" != *"route-tree.gen"* ]]; then
  echo "[hook] Route file modified: $(basename "$FILE") -> run: pnpm router:generate"
fi

if [[ "$FILE" == *"/locales/"* ]] && [[ "$FILE" == *".json" ]]; then
  echo "[hook] Locale file modified: $(basename "$FILE") -> run: pnpm i18n:resources"
fi

exit 0
