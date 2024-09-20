const container = document.getElementsByClassName("container");
const textBox = document.getElementById("text");
const generateBtn = document.getElementById("Generate");
const QRSection = document.getElementById("qrCodeSection");
let QRImage = document.getElementsByClassName("QRImg");
const downloadBtn = document.getElementById("Download");
const link = document.getElementById("link");
const pngformat = document.getElementById("png");
const jpegformat = document.getElementById("jpeg");
const svgformat = document.getElementById("svg");
const select = document.getElementById("Select");
const fileFormat = document.getElementById("fileTypes");
const Types = document.getElementsByClassName("Types");
let QRText;
let QRType;
QRShow();
fileChange();

async function QRGeneration(QRText) {
    let response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?&data=${encodeURIComponent(QRText)}&format=svg&ecc=H&charset-source=UTF-8`);
    let QRCode = response.url;
    QRAdd(QRCode);
}

async function QRFileTypeGeneration(QRText , QRType) {
    let response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?&data=${encodeURIComponent(QRText)}&format=${QRType}&ecc=H&charset-source=UTF-8`);
    let QRdownload = await response.blob();
    let QRImage = window.URL.createObjectURL(QRdownload);
    Download(QRImage);
}

function QRShow() {
    textBox.addEventListener("input", () => {
        QRText = textBox.value;
        if (QRText != "") {
            ["click","keypress"].forEach((event)=>{
                generateBtn.removeEventListener(event , QRGenerationEvent);
                generateBtn.addEventListener(event , QRGenerationEvent);
            })
        }
        else {
            container[0].classList.remove("displayOpen");
            QRSection.classList.add("hide");
            QRSection.classList.remove("show");
            imageRemove();
        }
    })
}

function QRGenerationEvent() {
    if(downloadBtn.childElementCount == 1){
        downloadBtn.firstElementChild.remove();
    }
    generateBtn.innerText = "Generating QR Code...";
    let start = performance.now();
    QRGeneration(QRText);
    let end = performance.now();
    let responseTime = end - start;
    setTimeout(() => {
        generateBtn.innerText = "Generate QR Code";
        container[0].classList.add("displayOpen");
        QRSection.classList.remove("hide");
        QRSection.classList.add("show");
    }, (responseTime + 500))
}

function QRAdd(QRCode) {
    imageRemove();
    let Image = `<img class="QRImg" src="${QRCode}" alt="QR-Code">`;
    QRSection.insertAdjacentHTML("afterbegin", Image);
    QRImage = document.getElementsByClassName("QRImg");
}

function imageRemove() {
    Array.from(QRImage).forEach((img) => {
        img.remove();
    })
}

function Download(QRImage) {
    let link = document.createElement('a');
    downloadBtn.appendChild(link);
    link.href = QRImage;
    link.download = "QR-Code";
}

function fileChange(){
    select.addEventListener("click" , ()=>{
        fileFormat.classList.toggle("hide");
        fileFormat.classList.toggle("show");
        Array.from(Types).forEach((e)=>{
            e.addEventListener("click" , ()=>{
                select.innerText = e.innerText;
                QRType = e.innerText.toLowerCase();
                QRFileTypeGeneration(QRText , QRType);
            })
        })
    })
}
