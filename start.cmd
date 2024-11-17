@echo off

rem Start npm
start "" npm start

rem Wait for 5 seconds
timeout /t 5 /nobreak >nul

rem Infinite loop for SSH tunneling
:loop
ssh -R 80:localhost:3000 serveo.net -o ServerAliveInterval=60
timeout /t 2 /nobreak >nul
goto loop
