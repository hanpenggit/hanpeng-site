@echo off
title hanpeng-site
cd /d "%~dp0"
set "PATH=E:\devtools\node\versions\22.22.2-3;%PATH%"
echo ==================================================
echo  Starting hanpeng-site (personal portfolio) ...
echo  本机访问:       http://localhost:3026
echo  局域网访问:     http://192.168.3.59:3026   （IP 变了就改这里和 next.config.ts 的 allowedDevOrigins）
echo  Edit content\profile.json for your info. AI needs OpenRouter key.
echo  Close this window to stop the server.
echo ==================================================
call npm run dev -- -p 3026 -H 0.0.0.0
pause
