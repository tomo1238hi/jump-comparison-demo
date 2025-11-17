type Handler = () => void

export function initializeController(onJump: Handler, onReset: Handler): () => void {
  const jumpButton = document.getElementById('jump-btn') as HTMLButtonElement | null
  const resetButton = document.getElementById('reset-btn') as HTMLButtonElement | null

  if (!jumpButton || !resetButton) {
    throw new Error('コントロールボタンが見つかりません')
  }

  jumpButton.addEventListener('click', onJump)
  resetButton.addEventListener('click', onReset)

  return () => {
    jumpButton.removeEventListener('click', onJump)
    resetButton.removeEventListener('click', onReset)
  }
}

