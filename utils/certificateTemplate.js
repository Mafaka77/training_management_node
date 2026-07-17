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
    const landscapeBgBase64 = getBase64Image('frontend/src/assets/landsape.png');
    const nationalEmblemBase64 = getBase64Image('frontend/src/assets/National-Emblem.png');
    const portraitBgBase64 = getBase64Image('frontend/src/assets/portrait.png');

    const contentPortrait = `
        <div class="relative z-20 w-full h-full flex flex-col items-center justify-start text-center bg-[#fefefe] overflow-hidden" style="font-family: ${baseFont}">
            
            <!-- Background Image -->
            <div class="absolute inset-0 z-0 pointer-events-none">
                <img src="${portraitBgBase64}" class="w-full h-full object-cover" />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 w-full px-16 pt-20 pb-[180px] flex flex-col h-full items-center justify-between">
                
                <!-- Top Row: QR Code, National Emblem, ATI Logo -->
                <div class="w-full flex justify-between items-start mb-6">
                    <!-- Left: QR Code -->
                    <div class="flex flex-col items-center">
                        <div class="bg-white p-1">
                            <img src="${qrCodeDataUrl}" alt="QR" class="w-14 h-14" />
                        </div>
                    </div>
                    
                    <!-- Center: National Emblem -->
                    <div class="flex flex-col items-center pt-2">
                        <img src="${nationalEmblemBase64}" class="w-16 h-16 object-contain drop-shadow-sm mix-blend-multiply" />
                    </div>

                    <!-- Right: ATI Logo -->
                    <div class="flex flex-col items-center">
                        <img src="${atiLogoBase64}" class="w-16 h-16 object-contain drop-shadow-sm" />
                    </div>
                </div>

                <!-- Header -->
                <div class="flex flex-col items-center w-full">
                    <h1 class="text-[64px] font-bold tracking-[0.1em] text-[#7a141c] uppercase leading-none mt-4" style="font-family: 'Times New Roman', serif;">Certificate</h1>
                    <h2 class="text-[20px] font-bold tracking-[0.2em] text-[#7a141c] uppercase mt-2">Of Completion</h2>
                </div>

                <!-- Text block -->
                <div class="flex flex-col items-center w-full mt-8">
                    <p class="text-[14px] text-[#333] tracking-[0.15em] uppercase font-medium mb-6">
                        This certificate is proudly presented to
                    </p>
                    
                    <!-- Trainee Name -->
                    <h2 class="text-[64px] text-[#cca352] mb-1 px-8 leading-none" style="font-family: 'Great Vibes', cursive; text-shadow: 1px 1px 2px rgba(0,0,0,0.05);">
                        ${trainee?.full_name || 'Trainee Name'}
                    </h2>
                    
                    <!-- Line below name -->
                    <div class="w-full max-w-[80%] h-[1px] bg-[#cca352] mb-6"></div>

                    <!-- Designation -->
                    <p class="text-[15px] font-bold text-[#7a141c] mb-4 uppercase tracking-wider">
                        ${trainee?.designation || 'Designation'}
                    </p>
                    <p class="text-[15px] font-bold text-[#7a141c] mb-4 uppercase tracking-wider">
                        ${trainee?.department || 'Department'}
                    </p>
                    <!-- Body Text -->
                    <p class="text-[16px] text-gray-800 leading-relaxed max-w-lg text-center px-4 font-medium">
                        For successfully completing the mandatory training program on <br/>
                        <span class="font-bold text-[20px] text-[#2b847f] leading-loose block mt-3">"${program?.t_name || 'Program Name'}"</span>
                    </p>
                    <p class="text-[14px] text-gray-700 mt-5 font-medium">
                        Conducted from ${formatWithOrdinal(program?.t_start_date)} to ${formatWithOrdinal(program?.t_end_date)}
                    </p>
                </div>

                <!-- Footer (Signatures, Seal) -->
                <div class="w-full flex justify-between items-end px-4 mt-auto mb-2">
                    
                    <!-- Left Signature -->
                    <div class="flex flex-col items-center w-[30%]">
                        ${tDirectorSig ? `<img src="${tDirectorSig}" class="w-36 h-16 object-contain relative z-50 mb-1" />` : '<div class="h-16 mb-1"></div>'}
                        <div class="w-full border-t-[1.5px] border-[#cca352] pt-2 text-center">
                            <p class="font-bold text-[10px] text-black tracking-widest uppercase">${program?.t_director?.full_name || 'Course Director Name'}</p>
                            ${program?.t_director?.designation ? `<p class="font-bold text-[8px] text-gray-700 uppercase tracking-widest mt-0.5">${program?.t_director?.designation}</p>` : ''}
                            <p class="text-[8px] font-bold text-[#7a141c] mt-1 uppercase tracking-wider">Course Director</p>
                        </div>
                    </div>

                    <!-- Right Signature -->
                    <div class="flex flex-col items-center w-[30%]">
                        ${directorSig ? `<img src="${directorSig}" class="w-36 h-16 object-contain relative z-50 mb-1" />` : '<div class="h-16 mb-1"></div>'}
                        <div class="w-full border-t-[1.5px] border-[#cca352] pt-2 text-center">
                            <p class="font-bold text-[10px] text-black tracking-widest uppercase">${director?.full_name || 'Director Name'}</p>
                            <p class="text-[8px] font-bold text-[#7a141c] mt-1 uppercase tracking-wider">Director, ATI</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    `;

    const contentLandscape = `
        <div class="relative z-20 w-full h-full flex flex-col items-center justify-start text-center bg-[#fefefe] overflow-hidden" style="font-family: ${baseFont}">
            
            <!-- Background Image -->
            <div class="absolute inset-0 z-0 pointer-events-none">
                <img src="${landscapeBgBase64}" class="w-full h-full object-cover" />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 w-full px-28 pt-12 pb-[70px] flex flex-col h-full items-center justify-between">
                
                <!-- Top Row: ATI Logo, National Emblem, QR Code -->
                <div class="w-full flex justify-between items-start mb-2">
                    <!-- Left: ATI Logo -->
                    <div class="flex flex-col items-center">
                        <img src="${atiLogoBase64}" class="w-16 h-16 object-contain drop-shadow-sm" />
                    </div>
                    
                    <!-- Center: National Emblem -->
                    <div class="flex flex-col items-center pt-2">
                        <img src="${nationalEmblemBase64}" class="w-16 h-16 object-contain drop-shadow-sm mix-blend-multiply" />
                    </div>

                    <!-- Right: QR Code -->
                    <div class="flex flex-col items-center">
                        <div class="bg-white p-1 ">
                            <img src="${qrCodeDataUrl}" alt="QR" class="w-14 h-14" />
                        </div>
                    </div>
                </div>

                <!-- Header -->
                <div class="flex flex-col items-center w-full">
                    <h1 class="text-[52px] font-bold tracking-[0.1em] text-[#7a141c] uppercase leading-none" style="font-family: 'Times New Roman', serif;">Certificate</h1>
                    <h2 class="text-[20px] font-bold tracking-[0.2em] text-[#7a141c] uppercase mt-2">Of Participation</h2>
                </div>

                <!-- Text block -->
                <div class="flex flex-col items-center w-full mt-4">
                    <p class="text-[12px] text-[#333] tracking-[0.15em] uppercase font-medium mb-3">
                        This certificate is presented to
                    </p>
                    
                    <!-- Trainee Name -->
                    <h2 class="text-[56px] text-[#cca352] mb-1 px-12 leading-none" style="font-family: 'Great Vibes', cursive; text-shadow: 1px 1px 2px rgba(0,0,0,0.05);">
                        ${trainee?.full_name || 'Trainee Name'}
                    </h2>
                    
                    <!-- Line below name -->
                    <div class="w-full max-w-2xl h-[1px] bg-[#cca352] mb-4"></div>

                    <!-- Designation -->
                    <p class="text-[13px] font-bold text-[#7a141c] mb-2 uppercase tracking-wider">
                        ${trainee?.designation || 'Designation'}
                    </p>
                    <p class="text-[13px] font-bold text-[#7a141c] mb-2 uppercase tracking-wider">
                        ${trainee?.department || 'Department'}
                    </p>

                    <!-- Body Text -->
                    <p class="text-[15px] text-gray-800 leading-relaxed max-w-3xl text-center px-8 font-medium">
                        Awarded to recognize achievement for successfully completing the training program on <br/>
                        <span class="font-bold">"${program?.t_name || 'Program Name'}"</span>
                    </p>
                    <p class="text-[13px] text-gray-700 mt-1 font-medium">
                        Conducted from ${formatWithOrdinal(program?.t_start_date)} to ${formatWithOrdinal(program?.t_end_date)}
                    </p>
                </div>

                <!-- Footer (Signatures, Seal) -->
                <div class="w-full flex justify-between items-end px-12 mt-auto mb-6">
                    
                    <!-- Left Signature -->
                    <div class="flex flex-col items-center w-48">
                        ${tDirectorSig ? `<img src="${tDirectorSig}" class="w-40 h-20 object-contain relative z-50 mb-1" />` : '<div class="h-20 mb-1"></div>'}
                        <div class="w-full border-t-[1.5px] border-[#cca352] pt-2 text-center">
                            <p class="font-bold text-[11px] text-black tracking-widest uppercase">${program?.t_director?.full_name || 'Course Director Name'}</p>
                            ${program?.t_director?.designation ? `<p class="font-bold text-[9px] text-gray-700 uppercase tracking-widest mt-0.5">${program?.t_director?.designation}</p>` : ''}
                            <p class="text-[9px] font-bold text-[#7a141c] mt-1 uppercase tracking-wider">Course Director</p>
                        </div>
                    </div>

                    <!-- Center Seal -->
                    <div class="flex flex-col items-center">
                        <img src="${sealBase64}" class="w-20 h-20 object-contain drop-shadow-md relative z-50" />
                    </div>

                    <!-- Right Signature -->
                    <div class="flex flex-col items-center w-48">
                        ${directorSig ? `<img src="${directorSig}" class="w-40 h-20 object-contain relative z-50 mb-1" />` : '<div class="h-20 mb-1"></div>'}
                        <div class="w-full border-t-[1.5px] border-[#cca352] pt-2 text-center">
                            <p class="font-bold text-[11px] text-black tracking-widest uppercase">${director?.full_name || 'Director Name'}</p>
                            <p class="text-[9px] font-bold text-[#7a141c] mt-1 uppercase tracking-wider">Director, ATI</p>
                        </div>
                    </div>
                    
                </div>
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
