import iupacDataGrid from './periodic_table_grid.json';

export interface ChemicalElement {
  symbol: string;
  name: string;
  atomic_number: number;
  fun_fact: string;
  category: 'alkali metal' | 'alkaline earth metal' | 'transition metal' | 'post-transition metal' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble gas' | 'lanthanide' | 'actinide' | 'unknown';
  atomic_mass: number;
  xpos: number;
  ypos: number;
  period: number;
}

const groupToCategoryMap: Record<string, ChemicalElement['category']> = {
  "Phi kim": "nonmetal",
  "Khí hiếm": "noble gas",
  "Kim loại kiềm": "alkali metal",
  "Kim loại kiềm thổ": "alkaline earth metal",
  "Á kim": "metalloid",
  "Halogen": "halogen",
  "Kim loại sau chuyển tiếp": "post-transition metal",
  "Kim loại chuyển tiếp": "transition metal",
  "Họ Lanthanide": "lanthanide",
  "Họ Actinide": "actinide",
  "Chưa rõ tính chất": "unknown"
};

// Fun fact mapping for well-known elements, fallback to default otherwise
const specialFacts: Record<number, string> = {
  1: "Nguyên tố phổ biến nhất trong vũ trụ, chiếm khoảng 75% khối lượng vũ trụ visible.",
  2: "Khí nhẹ thứ hai, làm thay đổi giọng nói của bạn khi hít phải.",
  3: "Kim loại nhẹ nhất, là thành phần chính trong pin điện thoại và xe điện.",
  4: "Kim loại quý hiếm được dùng trong ngành hàng không vũ trụ vì nó rất nhẹ và cứng.",
  6: "Cơ sở của mọi sự sống trên Trái Đất, có thể là than chì mềm hoặc kim cương siêu cứng.",
  7: "Chiếm tới 78% bầu khí quyển của Trái Đất.",
  8: "Nguyên tố thiết yếu cho sự sống, duy trì hô hấp và sự cháy.",
  9: "Phi kim hoạt động mạnh nhất, hợp chất của nó giúp ngăn ngừa sâu răng.",
  11: "Kim loại mềm có thể cắt bằng dao, kết hợp với Clo tạo thành muối ăn.",
  13: "Kim loại phổ biến nhất trong vỏ Trái Đất, có thể tái chế vô hạn lần.",
  14: "Thành phần chính của cát, cực kỳ quan trọng để chế tạo chip máy tính.",
  20: "Khoáng chất quan trọng nhất giúp xương và răng chắc khỏe.",
  26: "Tạo nên phần lõi của Trái Đất và cũng làm cho máu của chúng ta có màu đỏ.",
  29: "Kim loại dẫn điện rất tốt và có màu đỏ cam đặc trưng, dùng làm lõi dây điện.",
  47: "Kim loại dẫn điện và dẫn nhiệt tốt nhất trong tất cả các nguyên tố.",
  79: "Kim loại cực kỳ dẻo, 1 gram vàng nguyên chất có thể kéo thành dây dài 2 km.",
  80: "Kim loại duy nhất ở dạng lỏng ở nhiệt độ phòng.",
  92: "Nguyên tố phóng xạ tự nhiên nặng nhất, dùng để sản xuất năng lượng hạt nhân."
};

// Map raw JSON to Array needed for app
export const elementsList: ChemicalElement[] = iupacDataGrid.map(e => ({
  symbol: e.symbol,
  name: e.name,
  atomic_number: e.z,
  // Approximate mass fallback since it wasn't requested in JSON
  atomic_mass: e.z * 2 > 300 ? 294 : e.z * 2.1, 
  fun_fact: specialFacts[e.z] || `Thuộc nhóm: ${e.group}. Cấu trúc nguyên tử mang số hiệu Z=${e.z}.`,
  category: groupToCategoryMap[e.group] || 'unknown',
  xpos: e.xpos,
  ypos: e.ypos,
  period: e.period
}));
