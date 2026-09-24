[CmdletBinding()]
param(
    [ValidatePattern('^\d+\.\d+\.\d+([-.][0-9A-Za-z.-]+)?$')]
    [string]$Version = '1.0.0',

    [switch]$SkipTests,
    [switch]$KeepExisting
)

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$solutionPath = Join-Path $projectRoot 'Dazi.WorldClock.sln'
$coreProject = Join-Path $projectRoot 'src\Dazi.WorldClock.Core\Dazi.WorldClock.Core.csproj'
$applicationProject = Join-Path $projectRoot 'src\Dazi.WorldClock\Dazi.WorldClock.csproj'
$testProject = Join-Path $projectRoot 'tests\Dazi.WorldClock.Tests\Dazi.WorldClock.Tests.csproj'
$distRoot = Join-Path $projectRoot 'dist'
$versionRoot = Join-Path $distRoot $Version

function Invoke-DotNet {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

    & dotnet @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "dotnet $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    throw '.NET SDK was not found. Install the .NET 8 SDK and try again.'
}

if ((Test-Path -LiteralPath $versionRoot) -and -not $KeepExisting) {
    $resolvedDistRoot = [System.IO.Path]::GetFullPath($distRoot)
    $resolvedVersionRoot = [System.IO.Path]::GetFullPath($versionRoot)
    if (-not $resolvedVersionRoot.StartsWith($resolvedDistRoot + [System.IO.Path]::DirectorySeparatorChar)) {
        throw "Refusing to clean an output directory outside $resolvedDistRoot."
    }
    Remove-Item -LiteralPath $resolvedVersionRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $versionRoot | Out-Null

Write-Host '[1/6] Restoring world-clock...' -ForegroundColor Cyan
# Restore projects sequentially to avoid temporary-file contention on the shared Core project.
Invoke-DotNet restore $coreProject
Invoke-DotNet restore $applicationProject '-r' 'win-x64'
Invoke-DotNet restore $testProject

Write-Host '[2/6] Building Release solution...' -ForegroundColor Cyan
Invoke-DotNet build $solutionPath '-c' 'Release' '--no-restore' '--maxcpucount:1' "-p:Version=$Version"

if ($SkipTests) {
    Write-Host '[3/6] Tests skipped by request.' -ForegroundColor Yellow
}
else {
    Write-Host '[3/6] Running core tests...' -ForegroundColor Cyan
    Invoke-DotNet run '--project' $testProject '-c' 'Release' '--no-build'
}

$singleFileDirectory = Join-Path $versionRoot 'portable-single-file'
$portableDirectory = Join-Path $versionRoot 'portable-folder'
$frameworkDirectory = Join-Path $versionRoot 'framework-dependent'

Write-Host '[4/6] Publishing self-contained single-file EXE...' -ForegroundColor Cyan
Invoke-DotNet publish $applicationProject '-c' 'Release' '-r' 'win-x64' '--self-contained' 'true' '--no-restore' `
    '-p:PublishSingleFile=true' '-p:IncludeNativeLibrariesForSelfExtract=true' "-p:Version=$Version" '-o' $singleFileDirectory

Write-Host '[5/6] Publishing portable and framework-dependent folders...' -ForegroundColor Cyan
Invoke-DotNet publish $applicationProject '-c' 'Release' '-r' 'win-x64' '--self-contained' 'true' '--no-restore' `
    '-p:PublishSingleFile=false' "-p:Version=$Version" '-o' $portableDirectory
Invoke-DotNet publish $applicationProject '-c' 'Release' '-r' 'win-x64' '--self-contained' 'false' '--no-restore' `
    '-p:PublishSingleFile=false' "-p:Version=$Version" '-o' $frameworkDirectory

Write-Host '[6/6] Creating ZIP files and checksums...' -ForegroundColor Cyan
$singleExe = Join-Path $singleFileDirectory 'Dazi.WorldClock.exe'
$singleZip = Join-Path $versionRoot "Dazi.WorldClock-$Version-win-x64-single-file.zip"
$portableZip = Join-Path $versionRoot "Dazi.WorldClock-$Version-win-x64-portable.zip"
$frameworkZip = Join-Path $versionRoot "Dazi.WorldClock-$Version-win-x64-framework-dependent.zip"

Compress-Archive -LiteralPath $singleExe -DestinationPath $singleZip -Force
Compress-Archive -Path (Join-Path $portableDirectory '*') -DestinationPath $portableZip -Force
Compress-Archive -Path (Join-Path $frameworkDirectory '*') -DestinationPath $frameworkZip -Force

$checksumTargets = @($singleExe, $singleZip, $portableZip, $frameworkZip)
$checksumLines = foreach ($target in $checksumTargets) {
    $hash = Get-FileHash -LiteralPath $target -Algorithm SHA256
    "$($hash.Hash.ToLowerInvariant())  $([System.IO.Path]::GetFileName($target))"
}
$checksumPath = Join-Path $versionRoot 'SHA256SUMS.txt'
$checksumLines | Set-Content -LiteralPath $checksumPath -Encoding ascii

Write-Host ''
Write-Host 'Build completed successfully.' -ForegroundColor Green
Write-Host "Output: $versionRoot"
Get-ChildItem -LiteralPath $versionRoot | Select-Object Name, Length, LastWriteTime
