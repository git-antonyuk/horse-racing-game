import { formatRaceTime } from './formatTime'

describe('formatRaceTime', () => {
  it('formats zero', () => {
    expect(formatRaceTime(0)).toBe('00:00.0')
  })

  it('formats milliseconds under one second', () => {
    expect(formatRaceTime(500)).toBe('00:00.5')
  })

  it('formats whole seconds', () => {
    expect(formatRaceTime(3000)).toBe('00:03.0')
  })

  it('formats seconds with tenths', () => {
    expect(formatRaceTime(3700)).toBe('00:03.7')
  })

  it('truncates sub-tenth precision', () => {
    expect(formatRaceTime(3789)).toBe('00:03.7')
  })

  it('formats over one minute', () => {
    expect(formatRaceTime(65400)).toBe('01:05.4')
  })

  it('pads minutes and seconds', () => {
    expect(formatRaceTime(5200)).toBe('00:05.2')
  })
})
