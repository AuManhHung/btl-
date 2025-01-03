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
const sinhviens = readSinhviensFromJson("dataStudent.json");

function listSinhviens() {
    sinhviens.forEach(sinhvien => {
        console.log(`${sinhvien.mssv} - ${sinhvien.name}`);
    });
}

// Chức năng 1: Tìm sinh viên theo MSSV
function findSinhvien(mssv) {
    const sinhvien = sinhviens.find(sinhvien => sinhvien.mssv === mssv);
    if (sinhvien) {
        console.log(`${sinhvien.mssv} "${sinhvien.name}" ${sinhvien.cpa} ${sinhvien.canhcao}`);
        return sinhvien;
    } else {
        console.log("undefined");
        return undefined;
    }
}

// Chức năng 2: Cập nhật CPA của sinh viên
function modifyCpa(mssv, newCpa) {
    const sinhvien = findSinhvien(mssv);
    if (sinhvien) {
        sinhvien.updateCpa(newCpa);
        console.log(`Updated CPA of ${sinhvien.name} to ${sinhvien.cpa}`);
    } else {
        console.log("Sinh viên không tìm thấy.");
    }
}

// Chức năng 3: Tìm sinh viên có CPA cao nhất
function findTop(n) {
    const sortedSinhviens = [...sinhviens].sort((a, b) => b.cpa - a.cpa);
    sortedSinhviens.slice(0, n).forEach(sinhvien => {
        console.log(sinhvien.mssv);
    });
}

// Chức năng 4: Tìm sinh viên có CPA thấp nhất
function findBottom(n) {
    const sortedSinhviens = [...sinhviens].sort((a, b) => a.cpa - b.cpa);
    sortedSinhviens.slice(0, n).forEach(sinhvien => {
        console.log(sinhvien.mssv);
    });
}

// Chức năng 5: Tìm sinh viên bị cảnh cáo
function findWarningSinhviens() {
    sinhviens
        .filter(sinhvien => sinhvien.canhcao > 0)
        .forEach(sinhvien => {
            console.log(`${sinhvien.mssv} "${sinhvien.name}" - Mức cảnh cáo: ${sinhvien.canhcao}`);
        });
}

// Chức năng 6: Đếm số sinh viên có CPA trong khoảng [a, b]
function countSinhviensInRange(a, b) {
    const count = sinhviens.filter(sinhvien => sinhvien.cpa >= a && sinhvien.cpa <= b).length;
    console.log(`Số sinh viên có CPA trong khoảng [${a}, ${b}]: ${count}`);
}

// Chức năng 7: Đếm số sinh viên bị đình chỉ học
function countSuspendedSinhviens() {
    const suspended = sinhviens.filter(sinhvien => sinhvien.canhcao === 3);
    console.log(`Số sinh viên bị đình chỉ học: ${suspended.length}`);
    return suspended.length;
}

// Chức năng 8: Đếm số sinh viên bị cảnh cáo
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
            7. cnt <a> <b>  // Ví dụ: cnt 2.5 3.5
            8. suspended
            9. exit
            `);
    });
}

main();
