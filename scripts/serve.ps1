# Zero-dependency static server for the exported site (no Node.js needed).
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/serve.ps1 [-Port 4321] [-Dir out]
param([int]$Port = 4321, [string]$Dir = 'out')

$ErrorActionPreference = 'Stop'
$full = (Resolve-Path (Join-Path $PSScriptRoot "..\$Dir")).Path.TrimEnd('\')
# The \\?\ prefix lifts Windows' 260-character path limit for deep files.
$root = if ($full.StartsWith('\\')) { $full } else { '\\?\' + $full }

$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.avif' = 'image/avif'; '.ico' = 'image/x-icon'; '.woff2' = 'font/woff2'
  '.txt' = 'text/plain; charset=utf-8'; '.xml' = 'application/xml'; '.webmanifest' = 'application/manifest+json'
}

function Resolve-File([string]$urlPath) {
  $rel = [Uri]::UnescapeDataString($urlPath).TrimStart('/').Replace('/', '\')
  if ($rel -match '(^|\\)\.\.(\\|$)' -or $rel -match ':') { return $null }  # no path traversal
  $p = ($root + '\' + $rel).TrimEnd('\')
  foreach ($c in @($p, "$p\index.html", "$p.html")) {
    if ([IO.File]::Exists($c)) { return $c }
  }
  return $null
}

$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $full at http://localhost:$Port"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    try {
      $path = $req.Url.AbsolutePath
      $file = Resolve-File $path
      $status = 200
      if (-not $file) {
        # /shop -> /shop/ (trailing-slash export)
        if (-not $path.EndsWith('/') -and -not [IO.Path]::HasExtension($path) -and (Resolve-File "$path/")) {
          $res.StatusCode = 308
          $res.RedirectLocation = "$path/$($req.Url.Query)"
          $res.Close(); continue
        }
        $file = "$root\404.html"; $status = 404
      }
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $bytes = [IO.File]::ReadAllBytes($file)
      $res.StatusCode = $status
      $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $res.Headers['Cache-Control'] = if ($ext -eq '.html') { 'no-cache' } else { 'public, max-age=3600' }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
      try { $res.StatusCode = 500 } catch {}
    } finally {
      try { $res.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
