Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "Live Clock"
$form.FormBorderStyle = 'None'
$form.TopMost = $true
$form.StartPosition = 'Manual'
$form.Location = New-Object System.Drawing.Point(40, 40)
$form.BackColor = [System.Drawing.Color]::Black
$form.Opacity = 0.85
$form.Size = New-Object System.Drawing.Size(290, 90)

$label = New-Object System.Windows.Forms.Label
$label.ForeColor = [System.Drawing.Color]::Lime
$label.BackColor = [System.Drawing.Color]::Transparent
$label.Font = New-Object System.Drawing.Font("Consolas", 22, [System.Drawing.FontStyle]::Bold)
$label.TextAlign = 'MiddleCenter'
$label.Dock = 'Fill'
$form.Controls.Add($label)

# Drag the window by clicking anywhere on it (it has no title bar)
$dragging = $false
$dragStart = New-Object System.Drawing.Point(0, 0)

$mouseDown = {
    $dragging = $true
    $script:dragStart = [System.Windows.Forms.Cursor]::Position
    $script:formStart = $form.Location
}
$mouseMove = {
    if ($script:dragging) {
        $pos = [System.Windows.Forms.Cursor]::Position
        $dx = $pos.X - $script:dragStart.X
        $dy = $pos.Y - $script:dragStart.Y
        $form.Location = New-Object System.Drawing.Point(($script:formStart.X + $dx), ($script:formStart.Y + $dy))
    }
}
$mouseUp = { $script:dragging = $false }

$form.Add_MouseDown($mouseDown)
$form.Add_MouseMove($mouseMove)
$form.Add_MouseUp($mouseUp)
$label.Add_MouseDown($mouseDown)
$label.Add_MouseMove($mouseMove)
$label.Add_MouseUp($mouseUp)

# Double-click to close
$closeHandler = { $form.Close() }
$form.Add_MouseDoubleClick($closeHandler)
$label.Add_MouseDoubleClick($closeHandler)

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 250
$timer.Add_Tick({
    $label.Text = (Get-Date -Format "hh:mm:ss tt`ndddd, dd MMM")
})
$timer.Start()

$form.Add_Shown({ $label.Text = (Get-Date -Format "hh:mm:ss tt`ndddd, dd MMM") })
[System.Windows.Forms.Application]::Run($form)
