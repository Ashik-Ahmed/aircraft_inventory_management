const { formatDate } = require('./dateFunctionality');
// const RobotoBase64 = require('./Roboto-Regular');
const DejaVuSans = require('./DejaVu-Sans');

exports.exportStockReport = async (stockDetailsReport) => {

    const exportColumns = [
        { title: 'Ser. No.', dataKey: 'serial' },
        ...stockDetailsReport?.selectedColumns?.map(col => ({ title: col.header, dataKey: col.field }))]

    let customizedStockReport = stockDetailsReport?.stockReport?.map((stock, index) => {
        const customizedlatestExpiry = stock?.latestExpiry ? formatDate(stock?.latestExpiry) : '--';
        const customizedReceived = stock?.stockHistory?.filter((history) => history?.actionStatus == 'Received')
            .map((stock) => `${stock?.quantity}X${stock?.issueDate ? formatDate(stock?.issueDate) : '--'}`)
            .join('\n');
        const customizedExpenditure = stock?.stockHistory?.filter((history) => history?.actionStatus == 'Expenditure')
            .map((stock) => `${stock?.quantity}X${stock?.issueDate ? formatDate(stock?.issueDate) : '--'}`)
            .join('\n');
        return { serial: index + 1, ...stock, latestExpiry: customizedlatestExpiry, received: customizedReceived, expenditure: customizedExpenditure }
    })


    stockDetailsReport.stockReport = customizedStockReport;
    // console.log("customizedReportData", stockDetailsReport);


    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {

                const tempDoc = new jsPDF.default(0, 2);
                let totalHeadingWidth = 0;
                exportColumns.forEach(column => {
                    totalHeadingWidth += tempDoc.getTextWidth(column.title);
                });

                // Determine the orientation based on the total width of headings
                const pageWidth = tempDoc.internal.pageSize.width || tempDoc.internal.pageSize.getWidth();
                const orientation = totalHeadingWidth > (pageWidth - 80) ? 'landscape' : 'portrait';

                // Create the actual document with the determined orientation
                const doc = new jsPDF.default(orientation, 'pt');

                // Assuming DejaVuSans is the Base64-encoded string of the font file                 
                doc.addFileToVFS('DejaVuSans.ttf', DejaVuSans);
                doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
                doc.setFont('DejaVuSans');

                // Now calculate the actual pageWidth based on the orientation
                const actualPageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


                if (stockDetailsReport) {
                    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                    // Helper function to centralize text
                    const centerText = (text, y) => {
                        const textWidth = doc.getTextWidth(text);
                        const x = (pageWidth - textWidth) / 2;
                        doc.text(text, x, y);

                        // Add an underline by drawing a line directly beneath the text
                        const fontSize = doc.internal.getFontSize();
                        const textHeight = fontSize * 0.352777778; // Convert points to mm
                        doc.setDrawColor(0, 0, 0); // Set the line color to black
                        doc.setLineWidth(0.5); // Set the line width
                        doc.line(x, y + 1.5, x + textWidth, y + 1.5); // Draw the line

                    };

                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    centerText(`${stockDetailsReport?.heading}`, 22);
                    doc.setFontSize(12);
                    centerText(`${stockDetailsReport?.reportName}`, 38);
                    centerText(`${stockDetailsReport?.optional1}`, 53);
                    centerText(`${stockDetailsReport?.optional2}`, 67);
                }

                doc.autoTable(exportColumns, stockDetailsReport?.stockReport, {
                    startY: 85,
                    styles: {
                        // font: 'Roboto',
                        font: 'DejaVuSans',
                        lineWidth: 0.01, // Width of the line for the borders
                        lineColor: [200, 200, 200], // Color of the line for the borders, [0, 0, 0] is black
                    },
                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    }
                });


                doc.save(`Stock-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
            })
        })

    }
    exportToPDF()
}



exports.exportStockHistory = async (stock, availableQuantity, stockHistoryData) => {
    const exportColumns = [
        { title: 'Ser. No.', dataKey: 'serial' },
        ...stockHistoryData?.selectedColumns?.map(col => ({ title: col.header, dataKey: col.field }))]

    let customizedStockHistory = stockHistoryData?.stockHistory?.map((stock, index) => {
        const customizedIssueDate = stock?.issueDate ? formatDate(stock?.issueDate) : '--';
        const customizedAircraftUnit = `${stock?.aircraftUnit?.aircraft?.aircraftName ? stock?.aircraftUnit?.aircraft?.aircraftName : '--'} \n ${stock?.aircraftUnit?.regNo ? 'Reg: ' + stock?.aircraftUnit?.regNo : '--'} ${stock?.aircraftUnit?.serialNo ? 'Serial: ' + stock?.aircraftUnit?.serialNo : '--'}`;
        const customizedExpiredDate = stock?.expiryDate ? formatDate(stock?.expiryDate) : '--';


        return { serial: index + 1, ...stock, issueDate: customizedIssueDate, aircraftUnit: customizedAircraftUnit, expiryDate: customizedExpiredDate }
    })

    stockHistoryData.stockHistory = customizedStockHistory;

    const exportToPDF = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {

                const tempDoc = new jsPDF.default(0, 2);
                let totalHeadingWidth = 0;
                exportColumns.forEach(column => {
                    totalHeadingWidth += tempDoc.getTextWidth(column.title);
                });

                // Determine the orientation based on the total width of headings
                const pageWidth = tempDoc.internal.pageSize.width || tempDoc.internal.pageSize.getWidth();
                const orientation = totalHeadingWidth > (pageWidth - 80) ? 'landscape' : 'portrait';

                // Create the actual document with the determined orientation
                const doc = new jsPDF.default(orientation, 'pt');

                // Assuming DejaVuSans is the Base64-encoded string of the font file                 
                doc.addFileToVFS('DejaVuSans.ttf', DejaVuSans);
                doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
                doc.setFont('DejaVuSans');

                // Now calculate the actual pageWidth based on the orientation
                const actualPageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

                if (stockHistoryData) {
                    const centerText = (text, y) => {
                        const textWidth = doc.getTextWidth(text);
                        const x = (doc.internal.pageSize.width - textWidth) / 2;
                        doc.text(text, x, y);

                        // Add an underline by drawing a line directly beneath the text
                        const fontSize = doc.internal.getFontSize();
                        const textHeight = fontSize * 0.352777778; // Convert points to mm
                        doc.setDrawColor(0, 0, 0); // Set the line color to black
                        doc.setLineWidth(0.5); // Set the line width
                        doc.line(x, y + 1.5, x + textWidth, y + 1.5); // Draw the line
                    };

                    // Header
                    doc.setFontSize(15);
                    doc.setTextColor(10);
                    centerText(`${stockHistoryData?.heading}`, 22);
                    doc.setFontSize(12);
                    centerText(`${stockHistoryData?.reportName}`, 38);
                    centerText(`${stockHistoryData?.optional1}`, 53);
                    centerText(`${stockHistoryData?.optional2}`, 67);


                    doc.setFontSize(15);

                    doc.text('Stock Details:', 50, 90)
                    // Add an underline by drawing a line directly beneath the text
                    const fontSize = doc.internal.getFontSize();
                    doc.setDrawColor(0, 0, 0); // Set the line color to black
                    doc.setLineWidth(0.5); // Set the line width
                    doc.line(50, 90 + 1.5, 50 + doc.getTextWidth('Stock Details'), 90 + 1.5); // Draw the line

                    doc.setFontSize(12);
                    doc.text(`Card No.: ${stock?.cardNo || '--'}`, 50, 149)
                    doc.text(`Part No.: ${stock?.stockNo || '--'}`, 50, 162)
                    doc.text(`Nomenclature: ${stock?.nomenclature || '--'}`, 50, 110)
                    doc.text(`Aircraft: ${stock?.aircraftId?.aircraftName || '--'}`, 50, 123)
                    doc.text(`Available Qty.: ${availableQuantity || '--'} ${(availableQuantity < stock?.minimumQuantity) && '(Low Stock)'}`, 50, 136)
                    doc.text(`Unit: ${stock?.unit || '--'}`, 50, 175)
                    doc.text(`Issued At: ${stock?.issuedAt ? formatDate(stock?.issuedAt) : '--'}`, 50, 188)
                    doc.text(`Location: ${stock?.location || '--'}`, 50, 201)
                }

                doc.autoTable(exportColumns, stockHistoryData?.stockHistory, {
                    startY: 220,
                    styles: {
                        // font: 'Roboto',
                        font: 'DejaVuSans',
                        lineWidth: 0.01, // Width of the line for the borders
                        lineColor: [200, 200, 200], // Color of the line for the borders, [0, 0, 0] is black
                    },
                    didParseCell: function (data) {
                        // Check if the cell is in the aircraftUnit column
                        if (data.column.dataKey === 'aircraftUnit' && data.cell.section === 'body') {
                            const customizedAircraftUnit = data.cell.raw.split('\n');
                            const mainText = customizedAircraftUnit[0];

                            data.cell.text = [mainText]; // Set the main text to be displayed normally

                            // Add the additional text with custom styling in the willDrawCell hook
                            data.cell.willDrawCell = (cellData) => {
                                const x = cellData.cell.x;
                                const y = cellData.cell.y;
                                const textOptions = { maxWidth: cellData.cell.width };

                                // Draw the main text
                                doc.setFontStyle('normal');
                                doc.text(mainText, x, y, textOptions);

                                // Draw the additional text in smaller, italic font below the main text
                                const fontSize = 8; // Smaller font size
                                const lineHeight = doc.getLineHeight(mainText) / doc.internal.scaleFactor;
                                const newY = y + lineHeight + 2; // 2 is a small padding

                                doc.setFontSize(fontSize);
                                doc.setFontStyle('italic');
                                doc.text(additionalText, x, newY, textOptions);
                            }
                        }
                    },
                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);

                    }
                });
                doc.save(`Stock-History-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
            })
        })

    }
    exportToPDF()
}
