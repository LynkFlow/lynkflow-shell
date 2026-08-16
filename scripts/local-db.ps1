param(
    [ValidateSet("init", "start", "stop", "status", "migrate")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$workspaceRoot = Split-Path -Parent $projectRoot
$runtimeRoot = Join-Path $projectRoot ".local"
$dataDirectory = Join-Path $runtimeRoot "postgres-data"
$logPath = Join-Path $runtimeRoot "postgres.log"
$port = 5433
$databaseName = "lynkflow_auth"
$notificationsDatabaseName = "lynkflow_notifications"
$databaseUser = "lynkflow"

# Each entry points at a service's migrations/ folder (plain numbered .sql
# files, e.g. 001_create_auth_tables.sql) and the database those files
# should run against. Services live as siblings of lynkflow-shell, hence
# $workspaceRoot (one level above $projectRoot) rather than $projectRoot.
$services = @(
    @{ Name = "auth-svc";          MigrationsPath = Join-Path $workspaceRoot "auth-svc\migrations";          Database = $databaseName },
    @{ Name = "notifications-svc"; MigrationsPath = Join-Path $workspaceRoot "notifications-svc\migrations"; Database = $notificationsDatabaseName }
)

$postgresRoot = Get-ChildItem (Join-Path $env:ProgramFiles "PostgreSQL") -Directory -ErrorAction SilentlyContinue |
    Sort-Object { [int]$_.Name } -Descending |
    Select-Object -First 1

if (-not $postgresRoot) {
    throw "PostgreSQL is not installed under $env:ProgramFiles\PostgreSQL."
}

$postgresBin = Join-Path $postgresRoot.FullName "bin"
$initDb = Join-Path $postgresBin "initdb.exe"
$pgCtl = Join-Path $postgresBin "pg_ctl.exe"
$psql = Join-Path $postgresBin "psql.exe"
$createdb = Join-Path $postgresBin "createdb.exe"

function Initialize-LocalDatabase {
    if (Test-Path (Join-Path $dataDirectory "PG_VERSION")) {
        return
    }

    New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
    Write-Host "Initializing an isolated PostgreSQL cluster in $dataDirectory"
    & $initDb --pgdata=$dataDirectory --username=$databaseUser --auth=trust --encoding=UTF8
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL initialization failed."
    }
}

function Test-DatabaseRunning {
    & $pgCtl status --pgdata=$dataDirectory *> $null
    return $LASTEXITCODE -eq 0
}

function Invoke-Migrations {
    if (-not (Test-DatabaseRunning)) {
        throw "PostgreSQL is not running. Run with -Action start first."
    }

    foreach ($service in $services) {
        $migrationsPath = $service.MigrationsPath
        $database = $service.Database

        if (-not (Test-Path $migrationsPath)) {
            Write-Host "Skipping $($service.Name): no migrations folder at $migrationsPath"
            continue
        }

        $migrationFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" -File | Sort-Object Name

        if ($migrationFiles.Count -eq 0) {
            Write-Host "Skipping $($service.Name): no .sql files found in $migrationsPath"
            continue
        }

        # Tracking table so each migration file only ever runs once against
        # this database, even across repeated 'start' invocations.
        & $psql -h 127.0.0.1 -p $port -U $databaseUser -d $database -v "ON_ERROR_STOP=1" -c @"
CREATE TABLE IF NOT EXISTS schema_migrations (
    filename    text PRIMARY KEY,
    applied_at  timestamptz NOT NULL DEFAULT now()
);
"@
        if ($LASTEXITCODE -ne 0) {
            throw "Could not create schema_migrations tracking table for $($service.Name)."
        }

        $appliedRaw = & $psql -h 127.0.0.1 -p $port -U $databaseUser -d $database -tAc "SELECT filename FROM schema_migrations"
        $applied = @()
        if ($appliedRaw) {
            $applied = $appliedRaw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
        }

        $pending = $migrationFiles | Where-Object { $applied -notcontains $_.Name }

        if ($pending.Count -eq 0) {
            Write-Host "$($service.Name): up to date ($($migrationFiles.Count) migration(s) already applied)"
            continue
        }

        Write-Host "Running $($pending.Count) pending migration(s) for $($service.Name) against $database"
        foreach ($migrationFile in $pending) {
            Write-Host "  -> $($migrationFile.Name)"

            & $psql -h 127.0.0.1 -p $port -U $databaseUser -d $database -v "ON_ERROR_STOP=1" -f $migrationFile.FullName
            if ($LASTEXITCODE -ne 0) {
                throw "Migration failed: $($service.Name)/$($migrationFile.Name)"
            }

            $escapedName = $migrationFile.Name.Replace("'", "''")
            & $psql -h 127.0.0.1 -p $port -U $databaseUser -d $database -v "ON_ERROR_STOP=1" -c "INSERT INTO schema_migrations (filename) VALUES ('$escapedName')"
            if ($LASTEXITCODE -ne 0) {
                throw "Applied $($migrationFile.Name) but failed to record it in schema_migrations for $($service.Name)."
            }
        }
    }

    Write-Host "All migrations applied."
}

function Start-LocalDatabase {
    Initialize-LocalDatabase

    if (-not (Test-DatabaseRunning)) {
        Write-Host "Starting PostgreSQL on 127.0.0.1:$port"
        & $pgCtl start --pgdata=$dataDirectory --log=$logPath --options="-p $port -h 127.0.0.1" --wait
        if ($LASTEXITCODE -ne 0) {
            throw "PostgreSQL failed to start. See $logPath."
        }
    }

    $databaseExists = & $psql -h 127.0.0.1 -p $port -U $databaseUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$databaseName'"
    if ($databaseExists -ne "1") {
        Write-Host "Creating database $databaseName"
        & $createdb -h 127.0.0.1 -p $port -U $databaseUser $databaseName
        if ($LASTEXITCODE -ne 0) {
            throw "Could not create database $databaseName."
        }
    }

    $notificationsDatabaseExists = & $psql -h 127.0.0.1 -p $port -U $databaseUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$notificationsDatabaseName'"
    if ($notificationsDatabaseExists -ne "1") {
        Write-Host "Creating database $notificationsDatabaseName"
        & $createdb -h 127.0.0.1 -p $port -U $databaseUser $notificationsDatabaseName
        if ($LASTEXITCODE -ne 0) {
            throw "Could not create database $notificationsDatabaseName."
        }
    }

    Invoke-Migrations

    Write-Host "PostgreSQL is ready: postgresql://${databaseUser}@127.0.0.1:${port}/${databaseName} and ${notificationsDatabaseName}"
}

switch ($Action) {
    "init" {
        Initialize-LocalDatabase
    }
    "start" {
        Start-LocalDatabase
    }
    "stop" {
        if ((Test-Path (Join-Path $dataDirectory "PG_VERSION")) -and (Test-DatabaseRunning)) {
            & $pgCtl stop --pgdata=$dataDirectory --mode=fast --wait
            if ($LASTEXITCODE -ne 0) {
                throw "PostgreSQL failed to stop."
            }
        }
        Write-Host "Local PostgreSQL is stopped."
    }
    "status" {
        if ((Test-Path (Join-Path $dataDirectory "PG_VERSION")) -and (Test-DatabaseRunning)) {
            Write-Host "Local PostgreSQL is running on port $port."
        } else {
            Write-Host "Local PostgreSQL is stopped."
            exit 1
        }
    }
    "migrate" {
        Invoke-Migrations
    }
}