const fs = require('fs');
const path = require('path');

const formatWithOrdinal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${getOrdinal(day)} ${month}, ${year}`;
};

const getBase64Image = (imagePath) => {
    try {
        const fullPath = path.join(process.cwd(), imagePath);
        if (!fs.existsSync(fullPath)) return '';
        const ext = path.extname(fullPath).substring(1);
        const data = fs.readFileSync(fullPath, 'base64');
        return `data:image/${ext};base64,${data}`;
    } catch (e) {
        console.error("Error reading image:", e);
        return '';
    }
};

exports.generateCertificateHtml = (trainee, program, director, qrCodeDataUrl, options) => {
    const {
        baseFont = "'Times New Roman', serif",
        cursiveFont = "'Satisfy', cursive",
        themeColor = "#2563eb",
        templateStyle = "Standard"
    } = options;

    const isPortrait = templateStyle === 'Mandatory';
    const widthFormat = isPortrait ? '210mm' : '297mm';
    const heightFormat = isPortrait ? '297mm' : '210mm';

    // Image mappings
    const atiLogoBase64 = getBase64Image('frontend/src/assets/ati_logo_1.png');
    const sealBase64 = getBase64Image('frontend/src/assets/seal.png');
    const tDirectorSig = program?.t_director?.signature ? getBase64Image(program.t_director.signature) : '';
    const directorSig = director?.signature ? getBase64Image(director.signature) : '';

    const contentPortrait = `
        <div class="relative w-full h-full bg-white overflow-hidden" style="font-family: ${baseFont}">
            
            <!-- Inner Gold Border -->
            <div class="absolute inset-[15mm] border-[2px] border-[#E4B535] z-10 pointer-events-none"></div>

            <!-- Top Right Accents -->
            <div class="absolute top-0 right-0 w-0 h-0 border-t-[200px] border-l-[500px] border-t-[#E4B535] border-l-transparent z-20 pointer-events-none"></div>
            <div class="absolute top-0 right-0 w-0 h-0 border-t-[170px] border-l-[460px] border-t-[#2B3356] border-l-transparent z-20 pointer-events-none"></div>

            <!-- Bottom Left Accents -->
            <div class="absolute bottom-0 left-0 w-0 h-0 border-b-[180px] border-r-[400px] border-b-[#E4B535] border-r-transparent z-20 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-0 h-0 border-b-[150px] border-r-[360px] border-b-[#2B3356] border-r-transparent z-20 pointer-events-none"></div>

            <!-- White Logo Box in Top Right (replacing the T logo) -->
            <div class="absolute top-[18mm] right-[18mm] w-14 h-14 bg-white rounded-lg z-30 flex items-center justify-center shadow-md">
                <img src="${atiLogoBase64}" alt="ATI Logo" class="w-10 h-10 object-contain mix-blend-multiply" />
            </div>

            <!-- Main Content Container -->
            <div class="relative z-30 w-full h-full flex flex-col items-center justify-center pt-[45mm] pb-[35mm] px-[35mm] text-center">
                
                <div class="mb-6 flex flex-col items-center">
                    <h2 class="text-base font-bold uppercase tracking-[0.2em] text-gray-800">Administrative Training Institute</h2>
                    <p class="text-[10px] font-semibold tracking-[0.3em] mt-1 text-gray-500">GOVERNMENT OF MIZORAM</p>
                </div>
                
                <div class="mb-8">
                    <h1 class="text-6xl font-serif font-bold text-black tracking-widest uppercase">Certificate</h1>
                    <h2 class="text-2xl font-light text-gray-600 tracking-[0.4em] uppercase mt-2">Of Completion</h2>
                </div>

                <p class="text-lg text-gray-800 mb-5 font-medium">This is proudly presented to</p>

                <div class="w-full max-w-md border-b border-black pb-2 mb-5 mx-auto text-center">
                    <h2 class="text-6xl" style="color: #2B3356; font-family: ${cursiveFont}">
                        ${trainee?.full_name || 'Trainee Name'}
                    </h2>
                </div>

                <p class="text-base font-semibold text-gray-700 mb-8 uppercase tracking-wide">
                    ${trainee?.designation || 'Designation'}, ${trainee?.department || 'Department'}
                </p>

                <p class="text-base text-gray-800 mb-2 max-w-sm leading-relaxed">
                    For successfully completing the mandatory training program on
                </p>
                
                <h3 class="text-2xl font-bold text-[#2B3356] mb-4 max-w-md mx-auto">
                    "${program?.t_name || 'Program Name'}"
                </h3>

                <p class="text-sm text-gray-700 mb-auto">
                    Conducted from <span class="font-bold text-gray-900">${formatWithOrdinal(program?.t_start_date)}</span> to <span class="font-bold text-gray-900">${formatWithOrdinal(program?.t_end_date)}</span>
                </p>

                <!-- Signatures Area -->
                <div class="flex justify-between items-end w-full mt-10 px-2">
                    <div class="flex flex-col items-center w-[30%]">
                        ${tDirectorSig ? `<img src="${tDirectorSig}" class="w-24 h-12 object-contain mix-blend-multiply mb-1" />` : '<div class="h-12 mb-1"></div>'}
                        <div class="w-full border-t border-black pt-1">
                            <p class="font-bold text-[11px] uppercase text-black tracking-wider whitespace-nowrap">${program?.t_director?.full_name || 'Course Director Name'}</p>
                            <p class="text-[9px] text-gray-600 uppercase mt-0.5 tracking-widest">Course Director</p>
                        </div>
                    </div>
                    <div class="flex justify-center w-[30%] pb-1">
                        <img src="${sealBase64}" class="w-24 h-24 object-contain opacity-90 drop-shadow-sm mix-blend-multiply" />
                    </div>
                    <div class="flex flex-col items-center w-[30%]">
                        ${directorSig ? `<img src="${directorSig}" class="w-24 h-12 object-contain mix-blend-multiply mb-1" />` : '<div class="h-12 mb-1"></div>'}
                        <div class="w-full border-t border-black pt-1">
                            <p class="font-bold text-[11px] uppercase text-black tracking-wider whitespace-nowrap">${director?.full_name || 'Director Name'}</p>
                            <p class="text-[9px] text-gray-600 uppercase mt-0.5 tracking-widest">${director?.designation || 'Director, ATI'}</p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- QR Code -->
            <div class="absolute bottom-[20mm] right-[20mm] w-16 h-16 z-30">
                <img src="${qrCodeDataUrl}" alt="QR Verification" class="w-full h-full mix-blend-multiply" />
            </div>
            
        </div>
    `;

    const contentLandscape = `
        <div class="relative z-20 w-full h-full flex flex-col items-center justify-center text-center bg-[#FAFBFF] overflow-hidden" style="font-family: ${baseFont}">
            
            <!-- Geometric Background Shapes -->
            <div class="absolute inset-0 z-0 pointer-events-none">
                <!-- Top left pale triangle -->
                <div class="absolute top-0 left-0 w-0 h-0 border-t-[250px] border-r-[100px] border-t-[#E6EAF5] border-r-transparent"></div>
                <!-- Top right pale triangle -->
                <div class="absolute top-0 right-0 w-0 h-0 border-t-[450px] border-l-[180px] border-t-[#DCE1F2] border-l-transparent"></div>
                <!-- Bottom left accent 1 (pale) -->
                <div class="absolute bottom-0 left-0 w-0 h-0 border-b-[600px] border-r-[180px] border-b-[#E6EAF5] border-r-transparent"></div>
                <!-- Bottom left accent 2 (purple) -->
                <div class="absolute bottom-0 left-0 w-0 h-0 border-b-[450px] border-r-[120px] border-b-[#848CB8] border-r-transparent"></div>
                <!-- Bottom strip (purple) -->
                <div class="absolute bottom-[-120px] left-[-100px] w-[150%] h-[160px] bg-[#848CB8] transform rotate-[-3deg]"></div>
            </div>

            <!-- Content Container -->
            <div class="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl px-12 pt-8 pb-12">
                
                <div class="flex items-center gap-4 mb-8">
                    <img src="${atiLogoBase64}" alt="ATI Logo" class="w-12 h-12 drop-shadow-sm mix-blend-multiply">
                    <h2 class="text-2xl font-bold text-black tracking-wide">Administrative Training Institute</h2>
                </div>
                
                <h1 class="text-5xl uppercase tracking-[0.15em] font-serif mb-8" style="color: #7A83B4;">Certificate of Participation</h1>
                <p class="text-lg text-gray-600 mb-6 font-medium tracking-widest uppercase">This certifies that</p>
                
                <h2 class="text-5xl font-black text-black mb-4">
                    ${trainee?.full_name || 'Trainee Name'}
                </h2>
                
                <p class="text-base font-semibold text-gray-700 mb-6">
                    ${trainee?.designation || 'Designation'}, ${trainee?.department || 'Department'}
                </p>
                
                <p class="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-2">
                    has actively participated in the training program entitled
                </p>
                <h3 class="text-2xl font-bold text-[#848CB8] mb-4">
                    "${program?.t_name || 'Program Name'}"
                </h3>
                <p class="text-sm font-medium text-gray-600 mb-10">
                    Held from <span class="font-bold text-gray-800">${formatWithOrdinal(program?.t_start_date)}</span> to <span class="font-bold text-gray-800">${formatWithOrdinal(program?.t_end_date)}</span> at ATI Aizawl.
                </p>

                <div class="w-full flex justify-between items-end mt-4 px-16">
                    <div class="flex flex-col items-center">
                        ${tDirectorSig ? `<img src="${tDirectorSig}" class="w-32 h-12 object-contain mix-blend-multiply mb-1" />` : '<div class="h-12 mb-1"></div>'}
                        <div class="w-56 border-t border-gray-500 pt-2">
                            <p class="font-bold text-xs text-black uppercase tracking-wider">${program?.t_director?.full_name || 'Course Director Name'}</p>
                            <p class="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Course Director</p>
                        </div>
                    </div>

                    <div class="flex justify-center pb-2">
                        <img src="${sealBase64}" class="w-24 h-24 object-contain mix-blend-multiply opacity-80 drop-shadow-sm" />
                    </div>

                    <div class="flex flex-col items-center">
                        ${directorSig ? `<img src="${directorSig}" class="w-32 h-12 object-contain mix-blend-multiply mb-1" />` : '<div class="h-12 mb-1"></div>'}
                        <div class="w-56 border-t border-gray-500 pt-2">
                            <p class="font-bold text-xs text-black uppercase tracking-wider">${director?.full_name || 'Director Name'}</p>
                            <p class="text-[10px] text-gray-600 uppercase tracking-widest mt-1">${director?.designation || 'Director, ATI'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- QR Code -->
            <div class="absolute top-[20mm] right-[25mm] w-20 h-20 z-30">
                <img src="${qrCodeDataUrl}" alt="QR Verification" class="w-full h-full mix-blend-multiply" />
            </div>
        </div>
    `;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Satisfy&family=Great+Vibes&family=Playfair+Display&family=Montserrat&display=swap" rel="stylesheet">
            <style>
                @page { size: ${isPortrait ? 'A4 portrait' : 'A4 landscape'}; margin: 0; }
                body { 
                    margin: 0; 
                    padding: 0; 
                    width: ${widthFormat}; 
                    height: ${heightFormat}; 
                    overflow: hidden; 
                    box-sizing: border-box; 
                    background-color: #ffffff;
                }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            </style>
        </head>
        <body>
            <div style="background-color: #ffffff; color: #1f2937; width: 100%; height: 100%; position: relative; overflow: hidden;">
                <!-- BACKGROUND & BORDER SYSTEM -->
                <div class="absolute inset-0 z-0 bg-[#fdfdfd]"></div>
                <!-- Modern Geometry Background Layers -->
                <div class="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none" style="background-color: ${themeColor}"></div>
                <div class="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none" style="background-color: ${themeColor}"></div>
                
            

                ${isPortrait ? contentPortrait : contentLandscape}
            </div>
        </body>
        </html>
    `;
};
