Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$petSize = 72

function New-RoundedRegion([int]$w, [int]$h, [int]$radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($w - $d, 0, $d, $d, 270, 90)
    $path.AddArc($w - $d, $h - $d, $d, $d, 0, 90)
    $path.AddArc(0, $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return New-Object System.Drawing.Region($path)
}

# ---------- Pet window ----------
$pet = New-Object System.Windows.Forms.Form
$pet.FormBorderStyle = 'None'
$pet.TopMost = $true
$pet.ShowInTaskbar = $false
$pet.StartPosition = 'Manual'
$pet.Size = New-Object System.Drawing.Size($petSize, $petSize)
$pet.BackColor = [System.Drawing.Color]::Magenta
$pet.TransparencyKey = [System.Drawing.Color]::Magenta

$petLabel = New-Object System.Windows.Forms.Label
$petLabel.Dock = 'Fill'
$petLabel.TextAlign = 'MiddleCenter'
$petLabel.Font = New-Object System.Drawing.Font("Segoe UI Emoji", 40)
$petLabel.BackColor = [System.Drawing.Color]::Magenta
$petLabel.Text = [char]::ConvertFromUtf32(0x1F431) # 🐱
$pet.Controls.Add($petLabel)

$POSE_WALK = @([char]::ConvertFromUtf32(0x1F431), [char]::ConvertFromUtf32(0x1F63A))   # 🐱 😺
$POSE_IDLE = [char]::ConvertFromUtf32(0x1F63D)   # 😽
$POSE_SLEEP = [char]::ConvertFromUtf32(0x1F634)  # 😴
$POSE_LOVE = [char]::ConvertFromUtf32(0x1F970)   # 🥰

# ---------- Cute rounded speech bubble ----------
$bubble = New-Object System.Windows.Forms.Form
$bubble.FormBorderStyle = 'None'
$bubble.TopMost = $true
$bubble.ShowInTaskbar = $false
$bubble.StartPosition = 'Manual'
$bubble.Size = New-Object System.Drawing.Size(158, 40)
$bubble.BackColor = [System.Drawing.Color]::FromArgb(255, 240, 246)
$bubble.Region = New-RoundedRegion $bubble.Width $bubble.Height 16
$bubble.Visible = $false

$bubbleLabel = New-Object System.Windows.Forms.Label
$bubbleLabel.Dock = 'Fill'
$bubbleLabel.TextAlign = 'MiddleCenter'
$bubbleLabel.Font = New-Object System.Drawing.Font("Comic Sans MS", 10, [System.Drawing.FontStyle]::Bold)
$bubbleLabel.ForeColor = [System.Drawing.Color]::FromArgb(150, 60, 110)
$bubbleLabel.BackColor = [System.Drawing.Color]::FromArgb(255, 240, 246)
$bubble.Controls.Add($bubbleLabel)

function Show-Bubble([string]$text, [int]$ms = 1800) {
    $bubbleLabel.Text = $text
    $script:bubbleUntil = (Get-Date).AddMilliseconds($ms)
    $bubble.Visible = $true
}

# ---------- State ----------
$startX = Get-Random -Minimum 0 -Maximum ([Math]::Max(1, $screen.Width - $petSize))
$baseY = $screen.Height - $petSize
$pet.Location = New-Object System.Drawing.Point($startX, $baseY)
$script:dir = 1
$script:speed = 2.0
$script:idleUntil = [DateTime]::MinValue
$script:sleeping = $false
$script:bubbleUntil = [DateTime]::MinValue
$script:walkTick = 0
$script:blinkAt = (Get-Date).AddSeconds((Get-Random -Minimum 2 -Maximum 6))
$script:blinking = $false
$script:blinkEndsAt = [DateTime]::MinValue
$script:loveUntil = [DateTime]::MinValue

function Move-BubbleToPet {
    $bubble.Location = New-Object System.Drawing.Point(
        ($pet.Location.X + $petSize / 2 - $bubble.Width / 2),
        ($pet.Location.Y - $bubble.Height - 2))
}

# ---------- Main animation tick ----------
$walkTimer = New-Object System.Windows.Forms.Timer
$walkTimer.Interval = 40
$walkTimer.Add_Tick({
    $now = Get-Date

    if ($now -lt $script:loveUntil) {
        $petLabel.Text = $POSE_LOVE
    }
    elseif ($now -lt $script:idleUntil) {
        if (-not $script:sleeping -and $now -gt $script:idleUntil.AddSeconds(-1.5)) {
            $script:sleeping = $true
            Show-Bubble "zzz..." 999999
        }
        $petLabel.Text = $POSE_SLEEP
        $pet.Location = New-Object System.Drawing.Point($pet.Location.X, $baseY)
    }
    else {
        if ($script:sleeping) { $script:sleeping = $false; $bubble.Visible = $false }

        $script:walkTick += 1
        $x = $pet.Location.X + [int]($script:dir * $script:speed)
        $maxX = $screen.Width - $petSize
        if ($x -le 0) { $x = 0; $script:dir = 1 }
        elseif ($x -ge $maxX) { $x = $maxX; $script:dir = -1 }

        # gentle bob while walking
        $bob = [int]([Math]::Sin($script:walkTick / 5.0) * 4)
        $pet.Location = New-Object System.Drawing.Point($x, ($baseY + $bob))

        if (-not $script:blinking -and $now -ge $script:blinkAt) {
            $script:blinking = $true
            $script:blinkEndsAt = $now.AddMilliseconds(180)
            $petLabel.Text = $POSE_WALK[1]
        } elseif ($script:blinking -and $now -ge $script:blinkEndsAt) {
            $script:blinking = $false
            $script:blinkAt = $now.AddSeconds((Get-Random -Minimum 2 -Maximum 6))
            $petLabel.Text = $POSE_WALK[0]
        } elseif (-not $script:blinking) {
            $petLabel.Text = $POSE_WALK[0]
        }

        if ((Get-Random -Minimum 0 -Maximum 260) -eq 0) {
            $script:idleUntil = $now.AddSeconds((Get-Random -Minimum 3 -Maximum 7))
        }
    }

    if ($bubble.Visible) {
        Move-BubbleToPet
        if ($now -gt $script:bubbleUntil) { $bubble.Visible = $false }
    }
})
$walkTimer.Start()

# ---------- CPU watcher ----------
$script:lastCpu = 0
$cpuTimer = New-Object System.Windows.Forms.Timer
$cpuTimer.Interval = 2500
$cpuTimer.Add_Tick({
    try {
        $load = (Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime
    } catch { $load = $null }
    if ($null -ne $load) {
        if ($load -ge 70 -and $script:lastCpu -lt 70) {
            Show-Bubble "nom nom! yummy CPU~" 2200
        } elseif ($load -ge 40 -and $script:lastCpu -lt 40) {
            Show-Bubble "mmm, tasty CPU" 1500
        }
        $script:lastCpu = $load
    }
})
$cpuTimer.Start()

# ---------- Click = pet it, little heart float-up ----------
function Spawn-Heart {
    $heart = New-Object System.Windows.Forms.Form
    $heart.FormBorderStyle = 'None'
    $heart.TopMost = $true
    $heart.ShowInTaskbar = $false
    $heart.StartPosition = 'Manual'
    $heart.Size = New-Object System.Drawing.Size(28, 28)
    $heart.BackColor = [System.Drawing.Color]::Magenta
    $heart.TransparencyKey = [System.Drawing.Color]::Magenta
    $offsetX = Get-Random -Minimum -10 -Maximum 10
    $heart.Location = New-Object System.Drawing.Point(($pet.Location.X + $petSize / 2 - 14 + $offsetX), ($pet.Location.Y - 10))

    $hl = New-Object System.Windows.Forms.Label
    $hl.Dock = 'Fill'
    $hl.TextAlign = 'MiddleCenter'
    $hl.Font = New-Object System.Drawing.Font("Segoe UI Emoji", 14)
    $hl.BackColor = [System.Drawing.Color]::Magenta
    $hl.Text = [char]::ConvertFromUtf32(0x1F49E) # 💞
    $heart.Controls.Add($hl)
    $heart.Show()

    $steps = 0
    $riseTimer = New-Object System.Windows.Forms.Timer
    $riseTimer.Interval = 40
    $riseTimer.Add_Tick({
        $steps += 1
        $heart.Location = New-Object System.Drawing.Point($heart.Location.X, ($heart.Location.Y - 2))
        $heart.Opacity = [Math]::Max(0, 1 - ($steps / 22.0))
        if ($steps -ge 22) {
            $riseTimer.Stop()
            $heart.Close()
        }
    }.GetNewClosure())
    $riseTimer.Start()
}

$petClick = {
    $lines = @("love it!", "hehe <3", "pet pet~", "purrr~", "so happy!")
    Show-Bubble ($lines | Get-Random) 1400
    $script:loveUntil = (Get-Date).AddMilliseconds(900)
    Spawn-Heart
}
$pet.Add_Click($petClick)
$petLabel.Add_Click($petClick)

$closeHandler = { $bubble.Close(); $pet.Close() }
$pet.Add_MouseDoubleClick($closeHandler)
$petLabel.Add_MouseDoubleClick($closeHandler)

$bubble.Show()
[System.Windows.Forms.Application]::Run($pet)
