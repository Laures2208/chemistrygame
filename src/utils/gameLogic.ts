import { ChemicalElement } from '../data/elements';

/**
 * Hàm hỗ trợ: Suy ra Chu kỳ và Nhóm chuẩn IUPAC dựa vào Số hiệu nguyên tử (Z)
 */
export function getElementPlacement(Z: number) {
  let period = 1, group = 1;
  if (Z <= 2) {
    period = 1;
    group = Z === 1 ? 1 : 18;
  } else if (Z <= 10) {
    period = 2;
    group = Z <= 4 ? Z - 2 : Z + 8;
  } else if (Z <= 18) {
    period = 3;
    group = Z <= 12 ? Z - 10 : Z;
  } else if (Z <= 36) {
    period = 4;
    group = Z - 18;
  } else if (Z <= 54) {
    period = 5;
    group = Z - 36;
  } else if (Z <= 86) {
    period = 6;
    if (Z >= 57 && Z <= 71) group = 3; 
    else if (Z <= 56) group = Z - 54;
    else group = Z - 68;
  } else {
    period = 7;
    if (Z >= 89 && Z <= 103) group = 3;
    else if (Z <= 88) group = Z - 86;
    else group = Z - 100;
  }
  return { period, group };
}

/**
 * Hàm Game Logic: Kiểm tra đáp án game Đoán số thứ tự
 */
export function checkGuessAtomicNumber(inputZ: number, targetElement: ChemicalElement, timeElapsed: number = 0, maxTime: number = 15) {
  const targetZ = targetElement.atomic_number;
  
  if (inputZ === targetZ) {
    const timeLeft = Math.max(0, maxTime - timeElapsed);
    const speedBonus = Math.floor(timeLeft * 15);
    const totalScore = 100 + speedBonus;
    
    return {
      status: 'success' as const,
      effect: 'NEON_GLOW_SUCCESS',
      scoreAdded: totalScore,
      message: `Tọa độ Z=${targetZ} Khớp! Đồng bộ ở ${timeElapsed.toFixed(1)}s (+${totalScore} DATA)`
    };
  } else {
    const placement = getElementPlacement(targetZ);
    const direction = inputZ > targetZ 
      ? 'THẤP HƠN' 
      : 'CAO HƠN';
      
    const hint = `ERR: Z thực tế ${direction} ${inputZ}. Tọa độ rò rỉ: CHU KỲ ${placement.period} - NHÓM ${placement.group}.`;

    return {
      status: 'incorrect' as const,
      effect: 'SHAKE_ERROR',
      scoreAdded: 0,
      message: hint
    };
  }
}
