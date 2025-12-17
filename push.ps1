Write-Host "GitHub'a gönderim başlıyor..."
git add .
Write-Host "Commit oluşturuluyor..."
git commit -m "Otomatik güncelleme - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "GitHub'a push yapılıyor..."
git push origin main
Write-Host "Gönderim tamamlandı!"