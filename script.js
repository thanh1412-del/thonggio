// Hàm tính toán áp suất hơi bão hòa (P_sat)
function calculateSaturationVaporPressure(temp) {
    return 6.11 * Math.pow(10, (7.5 * temp) / (temp + 237.3));
}

// Hàm tính toán độ ẩm tuyệt đối dựa trên công thức tính theo đơn vị g/m³
function calculateAbsoluteHumidity(temp, relativeHumidity) {
    const P_sat = calculateSaturationVaporPressure(temp); // Tính P_sat (hPa)
    const e = (relativeHumidity / 100) * P_sat; // Áp suất hơi thực tế (hPa)
    const absoluteHumidity = (216.7 * e) / (temp + 273); // Đơn vị g/m³
    return absoluteHumidity.toFixed(2); // Làm tròn kết quả đến 2 chữ số thập phân
}

// Hàm tính toán nhiệt độ điểm sương (không thay đổi)
function calculateDewPoint(temp, relativeHumidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(relativeHumidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint.toFixed(0);
}

// Hàm kiểm tra điều kiện thông gió
function checkVentilation() {
    const insideTemp = parseFloat(document.getElementById('inside-temperature').value);
    const insideHumidity = parseFloat(document.getElementById('inside-humidity').value);
    const outsideTemp = parseFloat(document.getElementById('outside-temperature').value);
    const outsideHumidity = parseFloat(document.getElementById('outside-humidity').value);
    const weather = document.getElementById('weather').value;

    // Kiểm tra dữ liệu nhập
    if (isNaN(insideTemp) || isNaN(insideHumidity) || isNaN(outsideTemp) || isNaN(outsideHumidity)) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Tính toán độ ẩm tuyệt đối và nhiệt độ điểm sương
    const insideAbsoluteHumidity = calculateAbsoluteHumidity(insideTemp, insideHumidity);
    const outsideAbsoluteHumidity = calculateAbsoluteHumidity(outsideTemp, outsideHumidity);
    const dewPointInside = calculateDewPoint(insideTemp, insideHumidity);
    const dewPointOutside = calculateDewPoint(outsideTemp, outsideHumidity);

    let ventilationConclusion = "Không thông gió";

    // Điều kiện kiểm tra thông gió
    if (outsideTemp >= 10 && outsideTemp <= 35 && // Nhiệt độ ngoài trời trong khoảng 10-35 độ
        insideAbsoluteHumidity > outsideAbsoluteHumidity && // Độ ẩm tuyệt đối trong nhà cao hơn ngoài nhà
        weather !== "rainy" && // Trời không có mưa
        ((outsideTemp > insideTemp && dewPointOutside < insideTemp) || // Nhiệt độ điểm sương ngoài trời thấp hơn trong nhà
        (outsideTemp < insideTemp && outsideTemp > dewPointOutside))) { // Nhiệt độ điểm sương trong nhà thấp hơn ngoài trời
        ventilationConclusion = "Thông gió";
    }

    document.getElementById('inside-absolute-humidity').textContent = `Độ ẩm tuyệt đối trong nhà: ${insideAbsoluteHumidity} g/m³`;
    document.getElementById('outside-absolute-humidity').textContent = `Độ ẩm tuyệt đối ngoài trời: ${outsideAbsoluteHumidity} g/m³`;
    document.getElementById('dew-point').textContent = `Nhiệt độ điểm sương trong nhà: ${dewPointInside} °C`;
    document.getElementById('outside-dew-point').textContent = `Nhiệt độ điểm sương ngoài trời: ${dewPointOutside} °C`;
    document.getElementById('ventilation-result').textContent = `Kết luận: ${ventilationConclusion}`;
}
