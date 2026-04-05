Add-Type -AssemblyName System.Runtime.WindowsRuntime
$tts = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$streamTask = [System.WindowsRuntimeSystemExtensions]::AsTask($tts.SynthesizeTextToStreamAsync("Hello from transcript sample"))
$streamTask.Wait()
$stream = $streamTask.Result
$reader = New-Object Windows.Storage.Streams.DataReader($stream)
$loadTask = [System.WindowsRuntimeSystemExtensions]::AsTask($reader.LoadAsync([uint32]$stream.Size))
$loadTask.Wait()
$bytes = New-Object byte[] ([int]$stream.Size)
$reader.ReadBytes($bytes)
[System.IO.File]::WriteAllBytes("js-variables-lesson.wav", $bytes)
Get-Item "js-variables-lesson.wav" | Select-Object Name, Length, LastWriteTime
