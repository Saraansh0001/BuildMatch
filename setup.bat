@echo off
REM Windows Quick Setup Guide for Investment Portfolio React App

echo.
echo ================================================
echo Investment Portfolio Management System Setup
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install it first from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo OK Node.js version: %NODE_VERSION%
echo OK npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo [*] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo X Failed to install dependencies
    exit /b 1
)

echo OK Dependencies installed successfully
echo.

echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Available commands:
echo.
echo   npm run dev        - Start development server
echo   npm run build      - Build for production
echo   npm run preview    - Preview production build
echo.
echo To start developing:
echo   npm run dev
echo.
echo App will open at: http://localhost:3000
echo.
pause
