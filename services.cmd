@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
title Requiem Medical Center - Local Stack

rem ============================================================
rem  REQUIEM MEDICAL CENTER - one-file stack controller
rem  MySQL 8 (Docker) : localhost:3307  -  DB requiem_hospital
rem  Express API       : localhost:3002
rem  Vite site         : localhost:5180
rem ============================================================

set "ROOT=%~dp0"
set "CONTAINER=requiem-mysql"
set "DB_NAME=requiem_hospital"
set "DB_USER=root"
set "DB_PASS=requiem_root_2025"
set "API_PORT=3002"
set "SITE_PORT=5180"

rem ---- allow direct commands: services.cmd start|stop|status|db ----
if /i "%~1"=="start"  goto START_ALL
if /i "%~1"=="stop"   goto STOP_ALL
if /i "%~1"=="status" goto SHOW_STATUS_ONLY
if /i "%~1"=="db"     goto DB_DATA

:MENU
cls
echo.
echo   ================================================================
echo      REQUIEM MEDICAL CENTER  -  LOCAL STACK CONTROL
echo   ================================================================
call :PRINT_STATUS
echo.
echo      [1] Start all services
echo      [2] Stop all services
echo      [3] Refresh status
echo      [4] View database data
echo      [5] Open site in browser
echo      [6] Open MySQL console (type SQL by hand)
echo      [0] Exit
echo.
set "CHOICE="
set /p "CHOICE=     Select: "
if "%CHOICE%"=="1" goto START_ALL
if "%CHOICE%"=="2" goto STOP_ALL
if "%CHOICE%"=="3" goto MENU
if "%CHOICE%"=="4" goto DB_DATA
if "%CHOICE%"=="5" (
    start "" "http://localhost:%SITE_PORT%"
    goto MENU
)
if "%CHOICE%"=="6" goto DB_CONSOLE
if "%CHOICE%"=="0" exit /b 0
goto MENU

rem ============================================================
rem  STATUS
rem ============================================================
:PRINT_STATUS
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$dot=[char]0x25CF; function Show($ok){ if($ok){ Write-Host '  ' -NoNewline; Write-Host $dot -NoNewline -ForegroundColor Green; Write-Host '  RUNNING' -ForegroundColor Green } else { Write-Host '  ' -NoNewline; Write-Host $dot -NoNewline -ForegroundColor Red; Write-Host '  STOPPED' -ForegroundColor Red } }; $db=''; $db = docker ps --filter 'name=requiem-mysql' --filter 'status=running' --format '{{.Names}}' 2>$null; $dbOk = ($db -eq 'requiem-mysql'); $apiOk = [bool](Get-NetTCPConnection -LocalPort 3002 -State Listen -ErrorAction SilentlyContinue); $webOk = [bool](Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue); Write-Host ''; Write-Host '     MySQL 8 (Docker, requiem-mysql)  localhost:3307  DB requiem_hospital' -NoNewline; Show $dbOk; Write-Host '     Express API                      localhost:3002' -NoNewline; Show $apiOk; Write-Host '     Site (Vite)                      localhost:5180' -NoNewline; Show $webOk; Write-Host ''"
exit /b 0

:SHOW_STATUS_ONLY
cls
echo.
echo   ---- STATUS ----
call :PRINT_STATUS
echo.
exit /b 0

rem ============================================================
rem  START
rem ============================================================
:START_ALL
cls
echo.
echo   Starting MySQL container...
docker start %CONTAINER% >nul 2>&1
if errorlevel 1 (
    echo   Container missing - creating from docker-compose.yml...
    pushd "%ROOT%"
    docker compose up -d
    popd
)

echo   Waiting for MySQL to accept connections...
set /a TRIES=0
:WAIT_DB
set /a TRIES+=1
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysqladmin ping -u%DB_USER% --silent >nul 2>&1
if not errorlevel 1 goto DB_READY
if %TRIES% GEQ 30 goto DB_TIMEOUT
ping -n 3 127.0.0.1 >nul
goto WAIT_DB

:DB_TIMEOUT
echo   [!] MySQL did not answer in time - check: docker logs %CONTAINER%
goto START_API

:DB_READY
echo   MySQL is up on localhost:3307

:START_API
netstat -ano | findstr /R /C:":%API_PORT% .*LISTENING" >nul
if errorlevel 1 (
    echo   Starting Express API on %API_PORT%...
    start "Requiem API" cmd /k "cd /d "%ROOT%backend" && node server.js"
) else (
    echo   API already listening on %API_PORT%
)

netstat -ano | findstr /R /C:":%SITE_PORT% .*LISTENING" >nul
if errorlevel 1 (
    echo   Starting Vite site on %SITE_PORT%...
    start "Requiem Site" cmd /k "cd /d "%ROOT%" && npx vite --port %SITE_PORT% --strictPort"
) else (
    echo   Site already listening on %SITE_PORT%
)

echo.
echo   Waiting for the API to answer...
set /a TRIES=0
:WAIT_API
set /a TRIES+=1
powershell -NoProfile -Command "try{ $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:%API_PORT%/api/health' -TimeoutSec 2; exit 0 }catch{ exit 1 }" >nul 2>&1
if not errorlevel 1 goto API_READY
if %TRIES% GEQ 15 goto API_SLOW
ping -n 2 127.0.0.1 >nul
goto WAIT_API

:API_SLOW
echo   [!] API not responding yet - give it a few seconds, then press [3].
goto START_DONE

:API_READY
echo   API healthy - database connected.

:START_DONE
echo.
call :PRINT_STATUS
echo.
echo   Site: http://localhost:%SITE_PORT%
ping -n 3 127.0.0.1 >nul
goto MENU

rem ============================================================
rem  STOP
rem ============================================================
:STOP_ALL
cls
echo.
echo   Stopping site and API windows...
taskkill /FI "WINDOWTITLE eq Requiem Site*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Requiem API*" /T /F >nul 2>&1

echo   Releasing ports %SITE_PORT% and %API_PORT%...
call :KILL_PORT %SITE_PORT%
call :KILL_PORT %API_PORT%

echo   Stopping MySQL container...
docker stop %CONTAINER% >nul 2>&1

echo.
echo   All services stopped.
echo.
call :PRINT_STATUS
echo.
ping -n 3 127.0.0.1 >nul
goto MENU

:KILL_PORT
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%~1 .*LISTENING"') do (
    taskkill /F /PID %%P >nul 2>&1
)
exit /b 0

rem ============================================================
rem  DATABASE DATA
rem ============================================================
:DB_DATA
cls
echo.
echo   ================================================================
echo     DATABASE: %DB_NAME%   (container %CONTAINER%, port 3307)
echo   ================================================================
docker ps --filter "name=%CONTAINER%" --filter "status=running" --format "{{.Names}}" | findstr /C:"%CONTAINER%" >nul
if errorlevel 1 (
    echo.
    echo   [!] MySQL is not running. Pick [1] Start all first.
    echo.
    pause
    goto MENU
)

echo.
echo   --- TABLES AND ROW COUNTS ---
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME% -e "SELECT table_name AS 'table', table_rows AS approx_rows FROM information_schema.tables WHERE table_schema='%DB_NAME%' AND table_type='BASE TABLE' ORDER BY table_name;"

echo   --- LATEST APPOINTMENTS ---
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME% -e "SELECT appointment_number, full_name, doctor_id, preferred_date, preferred_time, status, confirmation_code FROM appointments ORDER BY id DESC LIMIT 10;"

echo   --- DOCTORS ---
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME% -e "SELECT id, name, specialty, status, availability_note FROM doctors ORDER BY name;"

echo   --- APPOINTMENT TYPES ---
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME% -e "SELECT code, name, duration_minutes FROM appointment_types ORDER BY code;"

echo   --- NEWSLETTER SUBSCRIBERS ---
docker exec -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME% -e "SELECT COUNT(*) AS subscribers FROM newsletter_subscribers;"
echo.
pause
goto MENU

rem ============================================================
rem  MYSQL CONSOLE
rem ============================================================
:DB_CONSOLE
cls
echo.
echo   Opening MySQL console for database '%DB_NAME%'.
echo   Type SQL, end statements with ;   Type  exit  to leave.
echo.
docker exec -it -e MYSQL_PWD=%DB_PASS% %CONTAINER% mysql -u%DB_USER% %DB_NAME%
goto MENU
