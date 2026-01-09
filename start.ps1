# Electro E-Commerce Store - Quick Start Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Electro E-Commerce Store" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/electro-ecommerce').then(() => { console.log('OK'); process.exit(0); }).catch(() => { process.exit(1); });" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB is NOT running" -ForegroundColor Red
        Write-Host "`nPlease start MongoDB first:" -ForegroundColor Yellow
        Write-Host "  1. Run: mongod" -ForegroundColor White
        Write-Host "  2. Or use MongoDB Atlas and update backend/.env`n" -ForegroundColor White
        $startMongo = Read-Host "Do you want to continue anyway? (y/n)"
        if ($startMongo -ne 'y') {
            exit
        }
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

# Start Backend
Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server - http://localhost:5000' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server - http://localhost:5173' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n✅ Servers are starting!" -ForegroundColor Green
Write-Host "`nBackend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Wait for servers to fully start (check the windows)" -ForegroundColor White
Write-Host "  2. Seed database: cd backend && npm run seed" -ForegroundColor White
Write-Host "  3. Open browser: http://localhost:5173" -ForegroundColor White

Write-Host "`n🔑 Demo Credentials:" -ForegroundColor Yellow
Write-Host "  Admin: admin@electro.com / admin123" -ForegroundColor White
Write-Host "  User:  user@electro.com / user123`n" -ForegroundColor White

