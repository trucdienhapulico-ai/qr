# Claude Worker Script for MAS
# Fixed by Antigravity

Write-Host "--- Claude AI Worker Started (Polling brain/tasks_queue) ---" -ForegroundColor Cyan

if (!(Test-Path "brain/tasks_done")) { New-Item -ItemType Directory "brain/tasks_done" }

while ($true) {
    $tasks = Get-ChildItem "brain/tasks_queue/*.txt"
    
    if ($tasks.Count -gt 0) {
        foreach ($task in $tasks) {
            $taskName = $task.BaseName
            $workingName = "$taskName.working"
            $workingPath = Join-Path $task.Directory.FullName $workingName
            
            # Đổi tên file để đánh dấu đang xử lý
            Rename-Item -Path $task.FullName -NewName $workingName -ErrorAction SilentlyContinue
            
            if (Test-Path $workingPath) {
                Write-Host "[WORKING] Starting task: $taskName" -ForegroundColor Yellow
                $prompt = Get-Content $workingPath -Raw
                
                Write-Host "[EXEC] Calling Claude Code..." -ForegroundColor Gray
                # Thực thi lệnh Claude Code
                claude -p "$prompt"
                
                # Di chuyển sang thư mục hoàn tất
                $donePath = Join-Path "brain/tasks_done" "$taskName.done.txt"
                if (Test-Path $donePath) { Remove-Item $donePath }
                Move-Item $workingPath $donePath
                
                # Đồng bộ Git
                Write-Host "[GIT] Syncing results..." -ForegroundColor Blue
                git add .
                git commit -m "worker: completed task $taskName"
                git push origin master
                
                # Thông báo âm thanh
                Write-Host "[SUCCESS] Task $taskName finished!" -ForegroundColor Green
                [console]::beep(1000, 200)
                [console]::beep(1500, 300)
            }
        }
    }
    Start-Sleep -Seconds 10
}
