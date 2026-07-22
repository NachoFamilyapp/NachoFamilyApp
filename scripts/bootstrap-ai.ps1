# ============================================================
# NachoFamilyApp AI Bootstrap
# Creates the AI knowledge base for the project
# ============================================================

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " NachoFamilyApp AI Bootstrap"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

#------------------------------------------------------------
# Folders
#------------------------------------------------------------

$folders = @(
    ".ai",
    "docs",
    "scripts"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "[+] Created folder: $folder" -ForegroundColor Green
    }
    else {
        Write-Host "[=] Exists: $folder"
    }
}

#------------------------------------------------------------
# Root files
#------------------------------------------------------------

$rootFiles = @(
    "AGENTS.md",
    "README_AI.md",
    "CHANGELOG_AI.md"
)

foreach ($file in $rootFiles) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "[+] Created file: $file" -ForegroundColor Green
    }
    else {
        Write-Host "[=] Exists: $file"
    }
}

#------------------------------------------------------------
# AI Knowledge Files
#------------------------------------------------------------

$aiFiles = @(
    "architecture.md",
    "roadmap.md",
    "firebase.md",
    "gps.md",
    "rides.md",
    "statistics.md",
    "game-engine.md",
    "coding-standards.md",
    "ui.md",
    "testing.md",
    "bugs.md",
    "ideas.md",
    "deployment.md",
    "performance.md",
    "prompts.md",
    "scavenger-hunt.md"
)

foreach ($file in $aiFiles) {

    $path = Join-Path ".ai" $file

    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path | Out-Null
        Write-Host "[+] Created AI file: $file" -ForegroundColor Green
    }
    else {
        Write-Host "[=] Exists: $file"
    }

}

#------------------------------------------------------------
# Documentation
#------------------------------------------------------------

$docsFiles = @(
    "README.md",
    "FEATURES.md",
    "DATABASE.md",
    "API.md",
    "CHANGELOG.md"
)

foreach ($file in $docsFiles) {

    $path = Join-Path "docs" $file

    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path | Out-Null
        Write-Host "[+] Created docs file: $file" -ForegroundColor Green
    }
    else {
        Write-Host "[=] Exists: $file"
    }

}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " AI Workspace Created Successfully!"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Folders:"
Write-Host "  .ai/"
Write-Host "  docs/"
Write-Host "  scripts/"
Write-Host ""

Write-Host "Next step:"
Write-Host "Open Continue and start filling AGENTS.md"
Write-Host ""