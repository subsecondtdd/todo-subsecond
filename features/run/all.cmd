@echo off
call features\run\memory
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\dom-memory
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\http-memory
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\dom-http-memory
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\database
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\webdriver-memory
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\webdriver-http-database
if %errorlevel% neq 0 exit /b %errorlevel%
call features\run\browserstack-memory
if %errorlevel% neq 0 exit /b %errorlevel%
