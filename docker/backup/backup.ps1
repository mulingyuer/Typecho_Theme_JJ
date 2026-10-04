# 备份本地 MySQL 数据库到 backup/ 目录
# 用法：在 docker 目录下执行
#   ./backup/backup.ps1
# 生成的文件：backup/typecho-yyyyMMdd-HHmmss.sql
# 说明：使用 mysqldump 的 --result-file 直接写文件，避免 PowerShell 管道转写引入 UTF-8 BOM

$ErrorActionPreference = 'Stop'

$DevEnvDir = Split-Path -Parent $PSScriptRoot
$BackupDir = $PSScriptRoot
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$OutFile = Join-Path $BackupDir "typecho-$Timestamp.sql"

Push-Location $DevEnvDir
try {
    Write-Host "正在备份数据库到 $OutFile ..."
    $ContainerOutFile = "/tmp/typecho-$Timestamp.sql"
    docker compose exec -T mysql mysqldump -uroot -proot --result-file=$ContainerOutFile typecho
    docker compose cp "mysql:$ContainerOutFile" $OutFile
    docker compose exec -T mysql rm -f $ContainerOutFile
    Write-Host "备份完成：$OutFile"
}
finally {
    Pop-Location
}
