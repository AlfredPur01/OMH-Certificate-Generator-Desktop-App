"use client"

declare global {
  interface Window {
    jsPDF: any
  }
}

export async function loadJsPDF() {
  if (!window.jsPDF) {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    document.head.appendChild(script)

    await new Promise((resolve) => {
      script.onload = resolve
    })
  }
}

export async function generateCertificatePDF(images: string[], filename: string) {
  try {
    // Load jsPDF dynamically
    await loadJsPDF()

    const { jsPDF } = window.jsPDF

    // Create new PDF document in landscape mode for certificates
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = 297 // A4 landscape width in mm
    const pageHeight = 210 // A4 landscape height in mm

    for (let i = 0; i < images.length; i++) {
      if (i > 0) {
        pdf.addPage()
      }

      // Calculate image dimensions to fit page while maintaining aspect ratio
      const imgWidth = 280
      const imgHeight = 200
      const x = (pageWidth - imgWidth) / 2 // Center horizontally
      const y = (pageHeight - imgHeight) / 2 // Center vertically

      // Add image to PDF
      pdf.addImage(images[i], "PNG", x, y, imgWidth, imgHeight, undefined, "FAST")

      // Add page number
      pdf.setFontSize(10)
      pdf.setTextColor(128, 128, 128)
      pdf.text(`Page ${i + 1} of ${images.length}`, pageWidth - 30, pageHeight - 10)
    }

    // Add metadata
    pdf.setProperties({
      title: filename.replace(".pdf", ""),
      subject: "Generated Certificates/ID Cards",
      author: "Certificate Generator App",
      creator: "Certificate Generator",
      producer: "jsPDF",
    })

    // Download the PDF
    pdf.save(filename)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

export async function printCertificates(images: string[]) {
  try {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) {
      throw new Error("Could not open print window. Please allow popups.")
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Certificates</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: Arial, sans-serif;
              background: white;
            }
            
            .certificate-page { 
              page-break-after: always; 
              page-break-inside: avoid;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            
            .certificate-page:last-child { 
              page-break-after: avoid; 
            }
            
            .certificate-image { 
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              border: 1px solid #ddd;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              object-fit: contain;
            }
            
            .page-info {
              position: fixed;
              bottom: 10px;
              right: 10px;
              font-size: 12px;
              color: #666;
              background: white;
              padding: 5px 10px;
              border-radius: 3px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .certificate-page { 
                margin: 0; 
                padding: 0;
                width: 100%;
                height: 100vh;
              }
              
              .page-info {
                display: none;
              }
              
              @page {
                margin: 0;
                size: landscape;
              }
            }
            
            @media screen {
              .no-print {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
                background: #007bff;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              }
              
              .no-print:hover {
                background: #0056b3;
              }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()">🖨️ Print Now</button>
    `

    images.forEach((image, index) => {
      htmlContent += `
        <div class="certificate-page">
          <img src="${image}" alt="Certificate ${index + 1}" class="certificate-image" />
          <div class="page-info">Page ${index + 1} of ${images.length}</div>
        </div>
      `
    })

    htmlContent += `
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for images to load, then focus and print
    let imagesLoaded = 0
    const totalImages = images.length

    const checkImagesLoaded = () => {
      const imgs = printWindow.document.querySelectorAll("img")
      imgs.forEach((img) => {
        if (img.complete) {
          imagesLoaded++
        } else {
          img.onload = () => {
            imagesLoaded++
            if (imagesLoaded === totalImages) {
              setTimeout(() => {
                printWindow.focus()
                printWindow.print()
              }, 500)
            }
          }
        }
      })

      if (imagesLoaded === totalImages) {
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 500)
      }
    }

    // Check if images are already loaded or wait for them
    setTimeout(checkImagesLoaded, 100)

    // Fallback: print after 3 seconds regardless
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 3000)

    return true
  } catch (error) {
    console.error("Error printing certificates:", error)
    throw new Error("Failed to print certificates")
  }
}

// Helper function to convert images to PDF blob for Electron
export async function generatePDFBlob(images: string[]): Promise<Blob> {
  await loadJsPDF()

  const { jsPDF } = window.jsPDF
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 297
  const pageHeight = 210

  for (let i = 0; i < images.length; i++) {
    if (i > 0) {
      pdf.addPage()
    }

    const imgWidth = 280
    const imgHeight = 200
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    pdf.addImage(images[i], "PNG", x, y, imgWidth, imgHeight, undefined, "FAST")
  }

  const pdfBlob = pdf.output("blob")
  return pdfBlob
}
