@echo off
title sahilsapra-website
cd /d "%~dp0"
set "PATH=E:\devtools\node\versions\22.22.2-3;%PATH%"
echo ==================================================
echo  Starting sahilsapra-website (clean editorial layout) ...
echo  When ready, open in browser:  http://localhost:3026
echo  Edit content\profile.json for your info. AI needs OpenRouter key.
echo  Close this window to stop the server.
echo ==================================================
call npm run dev -- -p 3026
pause
