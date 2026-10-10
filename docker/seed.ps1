[CmdletBinding()]
param(
    [ValidateSet('mysql57', 'mysql80', 'pgsql', 'sqlite')]
    [string] $Env,
    [switch] $Clean
)

$ErrorActionPreference = 'Stop'

$containers = @{
    mysql57 = 'typecho-mysql57'
    mysql80 = 'typecho-mysql80'
    pgsql   = 'typecho-pgsql'
    sqlite  = 'typecho-sqlite'
}

if ($Env) {
    $container = $containers[$Env]
}
else {
    $runningNames = @(& docker ps --format '{{.Names}}')
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not list Docker containers. Make sure Docker is running.'
    }

    $matches = @($runningNames | Where-Object { $containers.ContainsValue($_) })
    if ($matches.Count -eq 0) {
        throw 'No running Typecho container was found. Start an environment or pass -Env.'
    }
    if ($matches.Count -gt 1) {
        throw "Multiple Typecho environments are running ($($matches -join ', ')); pass -Env to select one."
    }
    $container = $matches[0]
}

$isRunning = & docker inspect --format '{{.State.Running}}' $container 2>$null
if ($LASTEXITCODE -ne 0 -or $isRunning -ne 'true') {
    throw "Target container '$container' is not running."
}

$seedScript = Join-Path $PSScriptRoot 'seed.php'
& docker cp $seedScript "$($container):/tmp/seed.php"
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$phpArguments = @($container, 'php', '/tmp/seed.php')
if ($Clean) {
    $phpArguments += '--clean'
}

& docker exec @phpArguments
exit $LASTEXITCODE
