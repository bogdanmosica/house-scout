const ONBOARDING_KEY = 'hs_onboarded'

export function isOnboarded(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_KEY) === '1'
}

export function markOnboarded(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ONBOARDING_KEY, '1')
}
