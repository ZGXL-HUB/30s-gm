# 创建用户中心图标的PowerShell脚本
# 基于现有的SVG图标创建PNG格式的用户图标

# 设置图标尺寸
$size = 40

# 创建用户图标的SVG内容
$userSvg = @"
<svg width="$size" height="$size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#888888"/>
  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#888888"/>
</svg>
"@

$userActiveSvg = @"
<svg width="$size" height="$size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#667eea"/>
  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#667eea"/>
</svg>
"@

# 保存SVG文件
$userSvg | Out-File -FilePath "user.svg" -Encoding UTF8
$userActiveSvg | Out-File -FilePath "user-active.svg" -Encoding UTF8

Write-Host "✅ 用户图标SVG文件已创建"
Write-Host "📁 文件位置: $(Get-Location)"
Write-Host "📝 请使用在线SVG转PNG工具或图像编辑软件将SVG转换为PNG格式"
Write-Host "📝 需要的文件: user.png 和 user-active.png (40x40像素)"
