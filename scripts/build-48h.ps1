[CmdletBinding()]
param(
  [string]$Source = 'slides/眩晕瘫坐？一句话生成_3A_游戏_哪些是真的哪些是假的.pptx',
  [string]$Output = 'slides/48h-3a-game-replication.pptx',
  [string]$ImageDirectory = 'packages/2026-10-23-unreal-fest-one-prompt-3a-games/public/48h-slides',
  [string]$TempDirectory = '.tmp/48h-png'
)

$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
function Full-Path([string]$Path) {
  if ([IO.Path]::IsPathRooted($Path)) { return $Path }
  return Join-Path $root $Path
}
function Rgb([int]$R, [int]$G, [int]$B) { return $R + 256 * $G + 65536 * $B }

$sourcePath = Full-Path $Source
$outputPath = Full-Path $Output
$imagePath = Full-Path $ImageDirectory
$tempPath = Full-Path $TempDirectory
if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Source not found: $sourcePath" }
New-Item -ItemType Directory -Force -Path $imagePath, $tempPath | Out-Null
if (Test-Path -LiteralPath $outputPath) { Remove-Item -LiteralPath $outputPath -Force }
Get-ChildItem -LiteralPath $tempPath -Filter 'slide-*.png' | Remove-Item -Force

$background = Rgb 8 13 24
$panel = Rgb 17 27 43
$line = Rgb 43 61 82
$white = Rgb 237 243 252
$muted = Rgb 151 165 188
$accent = Rgb 85 224 190
$accentAlt = Rgb 165 180 252
$title = '48h 制作 3A，哪些部分是真的？热门案例复刻经验分享'
$layoutScale = 0.75

function Add-Text($Slide, [string]$Text, [double]$X, [double]$Y, [double]$Width, [double]$Height, [double]$Size, [int]$Color, [bool]$Bold = $false, [int]$Align = 1, [double]$Transparency = 0) {
  $X *= $layoutScale
  $Y *= $layoutScale
  $Width *= $layoutScale
  $Height *= $layoutScale
  $Size *= $layoutScale
  $shape = $Slide.Shapes.AddTextbox(1, $X, $Y, $Width, $Height)
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  $shape.TextFrame.WordWrap = -1
  $shape.TextFrame.AutoSize = 0
  $range = $shape.TextFrame.TextRange
  $range.Text = $Text
  $range.Font.Name = 'Segoe UI'
  $range.Font.NameFarEast = 'Microsoft YaHei'
  $range.Font.Size = $Size
  $range.Font.Color.RGB = $Color
  $range.ParagraphFormat.Alignment = $Align
  if ($Bold) { $range.Font.Bold = -1 } else { $range.Font.Bold = 0 }
  if ($Transparency -gt 0) { $shape.TextFrame2.TextRange.Font.Fill.Transparency = $Transparency }
  return $shape
}
function Add-Rectangle($Slide, [double]$X, [double]$Y, [double]$Width, [double]$Height, [int]$Fill, [int]$Border, [bool]$ShowBorder = $false) {
  $X *= $layoutScale
  $Y *= $layoutScale
  $Width *= $layoutScale
  $Height *= $layoutScale
  $shape = $Slide.Shapes.AddShape(1, $X, $Y, $Width, $Height)
  $shape.Fill.Solid()
  $shape.Fill.ForeColor.RGB = $Fill
  $shape.Line.ForeColor.RGB = $Border
  $shape.Line.Weight = 1
  if ($ShowBorder) { $shape.Line.Visible = -1 } else { $shape.Line.Visible = 0 }
  return $shape
}
function Add-Footer($Slide, [int]$Number) {
  Add-Text $Slide '48H / CASE STUDY' 48 522 250 12 9 $accent | Out-Null
  Add-Text $Slide ('{0:D2} / 77' -f $Number) 830 522 82 12 9 $muted $false 3 | Out-Null
}
function Remove-BrandText($Shapes) {
  for ($index = $Shapes.Count; $index -ge 1; $index--) {
    $shape = $Shapes.Item($index)
    if ($shape.Type -eq 6) {
      Remove-BrandText $shape.GroupItems
      continue
    }
    if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
      if ($shape.TextFrame.TextRange.Text -match '(?i)unreal\s+fest') { $shape.Delete() }
    }
  }
}
function Remove-Pictures($Shapes) {
  for ($index = $Shapes.Count; $index -ge 1; $index--) {
    $shape = $Shapes.Item($index)
    if ($shape.Type -eq 6) { Remove-Pictures $shape.GroupItems }
    elseif ($shape.Type -eq 11 -or $shape.Type -eq 13) { $shape.Delete() }
  }
}
function Clear-Slide($Slide) {
  for ($index = $Slide.Shapes.Count; $index -ge 1; $index--) { $Slide.Shapes.Item($index).Delete() }
}
function Set-AccentText($Shapes) {
  for ($index = 1; $index -le $Shapes.Count; $index++) {
    $shape = $Shapes.Item($index)
    if ($shape.Type -eq 6) {
      Set-AccentText $shape.GroupItems
      continue
    }
    if (-not ($shape.HasTextFrame -and $shape.TextFrame.HasText)) { continue }
    $range = $shape.TextFrame.TextRange
    $color = $range.Font.Color.RGB
    if ($color -lt 0) { continue }
    $red = $color -band 255
    $green = ($color -shr 8) -band 255
    $blue = ($color -shr 16) -band 255
    if ($red -gt 180 -and $green -gt 70 -and $green -lt 200 -and $blue -lt 100) {
      $range.Font.Color.RGB = $accent
    }
  }
}
function Add-Cover($Slide) {
  Add-Rectangle $Slide 64 47 48 3 $accent $accent | Out-Null
  Add-Text $Slide '48H / GAME JAM' 128 37 350 28 16 $accentAlt $true | Out-Null
  Add-Text $Slide 'AI × GAME DEVELOPMENT' 630 44 266 18 10 $muted $false 3 | Out-Null
  Add-Text $Slide '48h 制作 3A，哪些部分是真的？' 64 146 850 96 36 $white $true | Out-Null
  Add-Text $Slide '热门案例复刻经验分享' 68 268 590 46 25 $accent | Out-Null
  Add-Text $Slide '从热门案例拆解可复用的制作路径' 68 332 540 28 15 $muted | Out-Null
  Add-Text $Slide '48h' 638 315 270 150 126 $accent $true 1 0.58 | Out-Null
  Add-Rectangle $Slide 64 455 832 1 $line $line | Out-Null
  Add-Text $Slide 'Feihu Tang' 64 477 280 26 15 $white | Out-Null
  Add-Text $Slide 'Dev Rel · Research Engineer · Moonshot AI' 400 480 496 22 12 $muted $false 3 | Out-Null
}
function Add-Agenda($Slide) {
  Add-Text $Slide '48H / ROADMAP' 64 46 400 26 13 $accentAlt $true | Out-Null
  Add-Text $Slide '复刻路线' 64 86 480 62 38 $white $true | Out-Null
  Add-Text $Slide '从案例到方法，再回到 48h' 64 148 660 28 16 $muted | Out-Null
  $items = @('待审查的例子', '模型演化趋势', '开发范式变化', '揭晓答案')
  for ($index = 0; $index -lt $items.Count; $index++) {
    $x = 64 + ($index % 2) * 432
    $y = 196 + [Math]::Floor($index / 2) * 138
    Add-Rectangle $Slide $x $y 400 112 $panel $line $true | Out-Null
    Add-Text $Slide ('{0:D2}' -f ($index + 1)) ($x + 24) ($y + 23) 52 42 20 $accentAlt $true | Out-Null
    Add-Text $Slide $items[$index] ($x + 84) ($y + 25) 288 62 20 $white $true | Out-Null
  }
}
function Add-Section($Slide) {
  Add-Text $Slide '01 / CASE STUDY' 64 48 400 26 13 $accentAlt $true | Out-Null
  Add-Text $Slide '热门案例' 64 176 600 90 50 $white $true | Out-Null
  Add-Text $Slide '哪些部分能在 48h 里真正落地？' 68 282 720 46 23 $accent | Out-Null
  Add-Text $Slide '01' 704 162 192 210 158 $accentAlt $true 1 0.62 | Out-Null
  Add-Rectangle $Slide 68 368 140 4 $accent $accent | Out-Null
  Add-Text $Slide '从热门案例中拆解可复用的制作经验' 68 400 650 32 16 $muted | Out-Null
}
function Add-Closing($Slide) {
  Add-Text $Slide '48H / KEEP BUILDING' 64 52 440 28 14 $accentAlt $true | Out-Null
  Add-Text $Slide '把想法做出来。' 64 184 760 92 48 $white $true | Out-Null
  Add-Text $Slide '热门案例复刻经验分享' 68 294 540 42 22 $accent | Out-Null
  Add-Text $Slide '48h' 650 318 246 140 108 $accentAlt $true 1 0.62 | Out-Null
  Add-Rectangle $Slide 64 430 832 1 $line $line | Out-Null
  Add-Text $Slide 'Feihu Tang' 64 465 300 26 15 $muted | Out-Null
}

$presentation = $null
$powerpoint = $null
try {
  $powerpoint = New-Object -ComObject PowerPoint.Application
  $powerpoint.DisplayAlerts = 1
  $presentation = $powerpoint.Presentations.Open($sourcePath, $true, $false, $false)
  if ($presentation.Slides.Count -ne 77) { throw "Expected 77 slides, found $($presentation.Slides.Count)" }
  foreach ($slide in $presentation.Slides) {
    $number = $slide.SlideIndex
    Write-Host "Styling slide $number"
    Remove-BrandText $slide.Master.Shapes
    Remove-BrandText $slide.CustomLayout.Shapes
    Remove-BrandText $slide.Shapes
    if ($number -eq 1 -or $number -eq 77) { Remove-Pictures $slide.CustomLayout.Shapes }
    $slide.DisplayMasterShapes = $false
    $slide.FollowMasterBackground = $false
    $slide.Background.Fill.Solid()
    $slide.Background.Fill.ForeColor.RGB = $background
    if ($number -eq 1) {
      Clear-Slide $slide
      Add-Cover $slide
    } elseif ($number -eq 2) {
      Clear-Slide $slide
      Add-Agenda $slide
    } elseif ($number -eq 3) {
      Clear-Slide $slide
      Add-Section $slide
    } elseif ($number -eq 77) {
      Clear-Slide $slide
      Add-Closing $slide
    } else {
      Set-AccentText $slide.Shapes
    }
    Add-Footer $slide $number
  }
  Write-Host "Saving presentation"
  $presentation.SaveAs($outputPath, 24)
  foreach ($slide in $presentation.Slides) {
    $number = $slide.SlideIndex
    $png = Join-Path $tempPath ('slide-{0:D3}.png' -f $number)
    $webp = Join-Path $imagePath ('slide-{0:D3}.webp' -f $number)
    $slide.Export($png, 'PNG', 1920, 1080)
    & ffmpeg -hide_banner -loglevel error -y -i $png -c:v libwebp -quality 82 $webp
    if ($LASTEXITCODE -ne 0) { throw "Failed to convert slide $number" }
    Write-Host "Exported $number / 77"
  }
  Write-Host "Saved: $outputPath"
} finally {
  if ($null -ne $presentation) { $presentation.Close() }
  if ($null -ne $powerpoint) { $powerpoint.Quit() }
  if ($null -ne $presentation) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($presentation) }
  if ($null -ne $powerpoint) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($powerpoint) }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

Add-Type -AssemblyName WindowsBase
$package = [System.IO.Packaging.Package]::Open($outputPath, 'Open', 'ReadWrite')
try {
  $package.PackageProperties.Title = $title
  $package.PackageProperties.Subject = '热门案例复刻经验分享'
  $package.PackageProperties.Keywords = '48h,AI,game development,Kimi'
  $package.PackageProperties.Description = '48h 主题新版，保留热门案例与演示视频。'
} finally {
  $package.Close()
}
