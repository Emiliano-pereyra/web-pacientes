$d = $PSScriptRoot
$out = "$d\Manual de usuario - Pacientes.pdf"
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-pdf-header-footer --user-data-dir="$d\edge-perfil" --print-to-pdf="$out" "file:///$($d -replace '\\','/')/manual.html" 2>$null
Start-Sleep -Seconds 3

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$metodos = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 }
$asOp = $metodos | Where-Object { $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$asAccion = $metodos | Where-Object { $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' } | Select-Object -First 1
function Esperar($op, [Type]$t) { $task = $asOp.MakeGenericMethod($t).Invoke($null, @($op)); $task.Wait(); $task.Result }
[void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
[void][Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$file = Esperar ([Windows.Storage.StorageFile]::GetFileFromPathAsync($out)) ([Windows.Storage.StorageFile])
$pdf = Esperar ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
Remove-Item "$d\vista" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force "$d\vista" | Out-Null
$folder = Esperar ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync("$d\vista")) ([Windows.Storage.StorageFolder])
for ($i = 0; $i -lt $pdf.PageCount; $i++) {
  $page = $pdf.GetPage($i)
  $png = Esperar ($folder.CreateFileAsync("p$($i+1).png", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
  $stream = Esperar ($png.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)) ([Windows.Storage.Streams.IRandomAccessStream])
  $t = $asAccion.Invoke($null, @($page.RenderToStreamAsync($stream))); $t.Wait()
  $stream.Dispose(); $page.Dispose()
}
"Paginas: $($pdf.PageCount)"
