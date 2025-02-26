@echo off
echo Stopping the server...
docker ps -q --filter "ancestor=my-node-app" | for /f "delims=" %%i in ('findstr /r /c:".*"') do docker stop %%i
pause