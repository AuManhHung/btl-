const readline = require("readline");
const fs = require("fs");

class Sinhvien {
    constructor(mssv, name, cpa) {
        this.mssv = mssv;
        this.name = name;
        this.cpa = parseFloat(cpa); // Chuyển đổi cpa từ chuỗi sang số
        this.canhcao = this.getCanhcao();
    }

    getCanhcao() {
        if (this.cpa <= 0.5) return 3;
        if (this.cpa <= 1.0) return 2;
        if (this.cpa <= 1.5) return 1;
        return 0;
    }

    updateCpa(newCpa) {
        this.cpa = parseFloat(newCpa); // Chuyển đổi cpa từ chuỗi sang số
        this.canhcao = this.getCanhcao();
    }
}

// Hàm để đọc danh sách sinh viên từ file JSON
function readSinhviensFromJson(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData.map(sv => new Sinhvien(sv.mssv, sv.name, sv.cpa));
}

// Đọc danh sách sinh viên từ file JSON
let sinhviens = readSinhviensFromJson("dataStudent.json");

// Sử dụng hash map để lưu trữ sinh viên theo MSSV (Tìm kiếm nhanh O(1))
const sinhvienMap = new Map(sinhviens.map(sv => [sv.mssv, sv]));

// Duy trì danh sách đã sắp xếp theo CPA (giảm thiểu việc sắp xếp lại)
let sortedSinhviens = [...sinhviens].sort((a, b) => b.cpa - a.cpa);

function listSinhviens() {
    sinhviens.forEach(sinhvien => {
        console.log(`${sinhvien.mssv} - ${sinhvien.name}`);
    });
}

// Tìm sinh viên theo MSSV với độ phức tạp O(1)
function findSinhvien(mssv) {
    const sinhvien = sinhvienMap.get(mssv);
    if (sinhvien) {
        console.log(`${sinhvien.mssv} "${sinhvien.name}" ${sinhvien.cpa} ${sinhvien.canhcao}`);
        return sinhvien;
    } else {
        console.log("undefined");
        return undefined;
    }
}

// Cập nhật CPA của sinh viên
function modifyCpa(mssv, newCpa) {
    const sinhvien = findSinhvien(mssv);
    if (sinhvien) {
        sinhvien.updateCpa(newCpa);
        console.log(`Updated CPA of ${sinhvien.name} to ${sinhvien.cpa}`);

        // Cập nhật lại danh sách đã sắp xếp
        sortedSinhviens = [...sinhviens].sort((a, b) => b.cpa - a.cpa);
    } else {
        console.log("Sinh viên không tìm thấy.");
    }
}

// Tìm sinh viên có CPA cao nhất, đã sắp xếp nên chỉ cần lấy đầu danh sách
function findTop(n) {
    sortedSinhviens.slice(0, n).forEach(sinhvien => {
        console.log(sinhvien.mssv);
    });
}

// Tìm sinh viên có CPA thấp nhất, đã sắp xếp nên lấy cuối danh sách
function findBottom(n) {
    sortedSinhviens.slice(-n).forEach(sinhvien => {
        console.log(sinhvien.mssv);
    });
}

// Tìm sinh viên bị cảnh cáo (lọc sinh viên bị cảnh cáo với độ phức tạp O(n))
function findWarningSinhviens() {
    sinhviens
        .filter(sinhvien => sinhvien.canhcao > 0)
        .forEach(sinhvien => {
            console.log(`${sinhvien.mssv} "${sinhvien.name}" - Mức cảnh cáo: ${sinhvien.canhcao}`);
        });
}

// Đếm số sinh viên có CPA trong khoảng [a, b]
function countSinhviensInRange(a, b) {
    const count = sinhviens.filter(sinhvien => sinhvien.cpa >= a && sinhvien.cpa <= b).length;
    console.log(`Số sinh viên có CPA trong khoảng [${a}, ${b}]: ${count}`);
}

// Đếm số sinh viên bị đình chỉ học (cảnh cáo mức 3)
function countSuspendedSinhviens() {
    const suspended = sinhviens.filter(sinhvien => sinhvien.canhcao === 3);
    console.log(`Số sinh viên bị đình chỉ học: ${suspended.length}`);
    return suspended.length;
}

// Khởi tạo giao diện dòng lệnh
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {
    console.log("Quản lý sinh viên - Nhập lệnh:");
    console.log(`Lệnh hỗ trợ:
    1. list
    2. find <mssv> // Ví dụ: find 20190010
    3. modify cpa <mssv> <cpa_mới> // Ví dụ: modify cpa 20190010 3.5
    4. findtop <n> // Ví dụ: findtop 3
    5. findbottom <n> // Ví dụ: findbottom 3
    6. findcanhcao
    7. cnt <a> <b>  // Ví dụ: cnt 2.5 3.5
    8. suspended
    9. exit`);

    rl.on("line", input => {
        const args = input.trim().split(" ");
        const command = args[0];

        switch (command) {
            case "list":
                listSinhviens();
                break;

            case "find":
                if (args.length === 2) {
                    findSinhvien(parseInt(args[1]));
                } else {
                    console.log("Cú pháp không hợp lệ. Ví dụ: find <mssv>");
                }
                break;

            case "modify":
                if (args.length === 4 && args[1] === "cpa") {
                    modifyCpa(parseInt(args[2]), parseFloat(args[3]));
                } else {
                    console.log("Cú pháp không hợp lệ. Ví dụ: modify cpa <mssv> <cpa_mới>");
                }
                break;

            case "findtop":
                if (args.length === 2) {
                    findTop(parseInt(args[1]));
                } else {
                    console.log("Cú pháp không hợp lệ. Ví dụ: findtop <n>");
                }
                break;

            case "findbottom":
                if (args.length === 2) {
                    findBottom(parseInt(args[1]));
                } else {
                    console.log("Cú pháp không hợp lệ. Ví dụ: findbottom <n>");
                }
                break;

            case "findcanhcao":
                findWarningSinhviens();
                break;

            case "cnt":
                if (args.length === 3) {
                    countSinhviensInRange(parseFloat(args[1]), parseFloat(args[2]));
                } else {
                    console.log("Cú pháp không hợp lệ. Ví dụ: cnt <a> <b>");
                }
                break;

            case "suspended":
                countSuspendedSinhviens();
                break;

            case "exit":
                console.log("Chương trình kết thúc.");
                rl.close();
                return;

            default:
                console.log("Lệnh không hợp lệ. Vui lòng thử lại.");
        }
        console.log(`
            Nhập lệnh tiếp theo:
            Lệnh hỗ trợ:
            1. list
            2. find <mssv> // Ví dụ: find 20190010
            3. modify cpa <mssv> <cpa_mới> // Ví dụ: modify cpa 20190010 3.5
            4. findtop <n> // Ví dụ: findtop 3
            5. findbottom <n> // Ví dụ: findbottom 3
            6. findcanhcao

