Add-Type -AssemblyName System.Drawing

# 创建语法练习图标（书本）
function New-GrammarIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用灰色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 136, 136, 136))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 136, 136, 136), 2)
    
    # 绘制书本
    $graphics.FillRectangle($brush, 10, 14, 28, 20)
    $graphics.DrawRectangle($pen, 10, 14, 28, 20)
    
    # 绘制书页线
    $pen.Width = 1
    $graphics.DrawLine($pen, 14, 22, 34, 22)
    $graphics.DrawLine($pen, 14, 26, 34, 26)
    $graphics.DrawLine($pen, 14, 30, 34, 30)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建激活状态的语法练习图标
function New-ActiveGrammarIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用主题色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 102, 126, 234))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 102, 126, 234), 2)
    
    # 绘制书本
    $graphics.FillRectangle($brush, 10, 14, 28, 20)
    $graphics.DrawRectangle($pen, 10, 14, 28, 20)
    
    # 绘制书页线
    $pen.Width = 1
    $graphics.DrawLine($pen, 14, 22, 34, 22)
    $graphics.DrawLine($pen, 14, 26, 34, 26)
    $graphics.DrawLine($pen, 14, 30, 34, 30)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建书写规范图标（笔）
function New-WritingIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用灰色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 136, 136, 136))
    
    # 绘制笔身
    $graphics.FillRectangle($brush, 22, 10, 4, 28)
    
    # 绘制笔头
    $points = @(
        [System.Drawing.Point]::new(20, 10),
        [System.Drawing.Point]::new(28, 10),
        [System.Drawing.Point]::new(24, 6)
    )
    $graphics.FillPolygon($brush, $points)
    
    # 绘制笔尖
    $points = @(
        [System.Drawing.Point]::new(22, 38),
        [System.Drawing.Point]::new(26, 38),
        [System.Drawing.Point]::new(24, 42)
    )
    $graphics.FillPolygon($brush, $points)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建激活状态的书写规范图标
function New-ActiveWritingIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用主题色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 102, 126, 234))
    
    # 绘制笔身
    $graphics.FillRectangle($brush, 22, 10, 4, 28)
    
    # 绘制笔头
    $points = @(
        [System.Drawing.Point]::new(20, 10),
        [System.Drawing.Point]::new(28, 10),
        [System.Drawing.Point]::new(24, 6)
    )
    $graphics.FillPolygon($brush, $points)
    
    # 绘制笔尖
    $points = @(
        [System.Drawing.Point]::new(22, 38),
        [System.Drawing.Point]::new(26, 38),
        [System.Drawing.Point]::new(24, 42)
    )
    $graphics.FillPolygon($brush, $points)
    
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# 创建错题练习图标（X标记）
function New-WrongIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用灰色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 136, 136, 136))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 136, 136, 136), 4)
    
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

# 创建激活状态的错题练习图标
function New-ActiveWrongIcon {
    param([string]$filename)
    
    $bitmap = New-Object System.Drawing.Bitmap(48, 48)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # 使用主题色
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 102, 126, 234))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 102, 126, 234), 4)
    
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

Write-Host "开始创建图标..."

# 创建语法练习图标
New-GrammarIcon "$iconDir\home.png"
New-ActiveGrammarIcon "$iconDir\home-active.png"

# 创建书写规范图标
New-WritingIcon "$iconDir\business.png"
New-ActiveWritingIcon "$iconDir\business-active.png"

# 创建错题练习图标
New-WrongIcon "$iconDir\goods.png"
New-ActiveWrongIcon "$iconDir\goods-active.png"

Write-Host "所有图标创建完成！"
Write-Host "图标位置: $iconDir"

