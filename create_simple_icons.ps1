Add-Type -AssemblyName System.Drawing

# 创建简单的语法练习图标（房子）
function Create-HomeIcon {
    param([string]$filename, [bool]$isActive = $false)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 选择颜色
    if ($isActive) {
        $color = [System.Drawing.Color]::FromArgb(255, 102, 126, 234)  # 主题色
    } else {
        $color = [System.Drawing.Color]::FromArgb(255, 136, 136, 136)  # 灰色
    }
    
    $brush = New-Object System.Drawing.SolidBrush($color)
    $pen = New-Object System.Drawing.Pen($color, 2)
    
    # 绘制房子主体
    $graphics.FillRectangle($brush, 16, 20, 16, 16)
    
    # 绘制屋顶
    $points = @(
        [System.Drawing.Point]::new(12, 20),
        [System.Drawing.Point]::new(24, 12),
        [System.Drawing.Point]::new(36, 20)
    )
    $graphics.FillPolygon($brush, $points)
    
    # 绘制门
    $graphics.FillRectangle([System.Drawing.Brushes]::White, 20, 28, 8, 8)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建简单的书写规范图标（文档）
function Create-DocumentIcon {
    param([string]$filename, [bool]$isActive = $false)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 选择颜色
    if ($isActive) {
        $color = [System.Drawing.Color]::FromArgb(255, 102, 126, 234)  # 主题色
    } else {
        $color = [System.Drawing.Color]::FromArgb(255, 136, 136, 136)  # 灰色
    }
    
    $brush = New-Object System.Drawing.SolidBrush($color)
    $pen = New-Object System.Drawing.Pen($color, 2)
    
    # 绘制文档主体
    $graphics.FillRectangle($brush, 12, 8, 24, 32)
    
    # 绘制文档折角
    $points = @(
        [System.Drawing.Point]::new(28, 8),
        [System.Drawing.Point]::new(36, 8),
        [System.Drawing.Point]::new(28, 16)
    )
    $graphics.FillPolygon([System.Drawing.Brushes]::White, $points)
    
    # 绘制文本线
    $pen.Width = 1
    $graphics.DrawLine($pen, 16, 20, 32, 20)
    $graphics.DrawLine($pen, 16, 24, 32, 24)
    $graphics.DrawLine($pen, 16, 28, 32, 28)
    $graphics.DrawLine($pen, 16, 32, 24, 32)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建错题练习图标（X标记）
function Create-XIcon {
    param([string]$filename, [bool]$isActive = $false)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 选择颜色
    if ($isActive) {
        $color = [System.Drawing.Color]::FromArgb(255, 102, 126, 234)  # 主题色
    } else {
        $color = [System.Drawing.Color]::FromArgb(255, 136, 136, 136)  # 灰色
    }
    
    $brush = New-Object System.Drawing.SolidBrush($color)
    $pen = New-Object System.Drawing.Pen($color, 4)
    
    # 绘制圆形背景
    $graphics.FillEllipse($brush, 8, 8, 32, 32)
    
    # 绘制X标记（白色）
    $pen.Color = [System.Drawing.Color]::White
    $pen.Width = 3
    $graphics.DrawLine($pen, 16, 16, 32, 32)
    $graphics.DrawLine($pen, 32, 16, 16, 32)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 确保目录存在
$iconDir = "miniprogram\images\icons"
if (!(Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir -Force
}

Write-Host "开始创建简单图标..."

# 创建语法练习图标
Create-HomeIcon "$iconDir\home.png" $false
Create-HomeIcon "$iconDir\home-active.png" $true

# 创建书写规范图标
Create-DocumentIcon "$iconDir\business.png" $false
Create-DocumentIcon "$iconDir\business-active.png" $true

# 创建错题练习图标
Create-XIcon "$iconDir\goods.png" $false
Create-XIcon "$iconDir\goods-active.png" $true

Write-Host "所有图标创建完成！"
Write-Host "图标位置: $iconDir"
