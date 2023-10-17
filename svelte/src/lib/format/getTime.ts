import { Duration, type DurationUnit } from 'luxon';

const getDuration = (unit: DurationUnit, amount: number) => {
  return Duration.fromObject({
    [unit]: amount,
  });
}

export const durationString = (milliseconds: number, format: 'short' | 'long' ="short") => {
  const duration = Duration.fromMillis(milliseconds);

  const shifted = duration.shiftTo("hours","minutes","seconds");

  if (format === 'short') {
    return shifted.toHuman()
  }

  return duration.toFormat('hh:mm');

}

export default getDuration;
