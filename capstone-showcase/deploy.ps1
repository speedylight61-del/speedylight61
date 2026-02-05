$SERVER_IP = "72.167.148.35"
$USERNAME = "root"
$PASSWORD = "dtT9M17pH`$Wx"
$FRONTEND_DIR = "/home/asucapstone/public_html/showcase.asucapstone.com"
$BACKEND_DIR = "/home/asucapstone/public_html/showcase-backend"

$zipFile = Get-ChildItem -Path "." -Filter "dist-*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $zipFile) {
    Write-Host "Error: No dist-*.zip file found. Please run the build script first." -ForegroundColor Red
    exit 1
}

Write-Host "Found zip file: $($zipFile.Name)" -ForegroundColor Green

Write-Host "Connecting to server $SERVER_IP..." -ForegroundColor Yellow
$session = New-SSHSession -ComputerName $SERVER_IP -Username $USERNAME -Password $PASSWORD



Write-Host "Creating backup of existing frontend files on server..." -ForegroundColor Yellow
