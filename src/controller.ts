type Handler = () => void

interface ControllerHandlers {
  onJumpBoth: Handler
  onJumpA: Handler
  onJumpB: Handler
  onReset: Handler
}

export function initializeController({
  onJumpBoth,
  onJumpA,
  onJumpB,
  onReset,
}: ControllerHandlers): () => void {
  const jumpBothButton = document.getElementById('jump-btn') as HTMLButtonElement | null
  const jumpAButton = document.getElementById('jump-btn-a') as HTMLButtonElement | null
  const jumpBButton = document.getElementById('jump-btn-b') as HTMLButtonElement | null
  const resetButton = document.getElementById('reset-btn') as HTMLButtonElement | null

  if (!jumpBothButton || !jumpAButton || !jumpBButton || !resetButton) {
    throw new Error('コントロールボタンが見つかりません')
  }

  jumpBothButton.addEventListener('click', onJumpBoth)
  jumpAButton.addEventListener('click', onJumpA)
  jumpBButton.addEventListener('click', onJumpB)
  resetButton.addEventListener('click', onReset)

  return () => {
    jumpBothButton.removeEventListener('click', onJumpBoth)
    jumpAButton.removeEventListener('click', onJumpA)
    jumpBButton.removeEventListener('click', onJumpB)
    resetButton.removeEventListener('click', onReset)
  }
}

