import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class DocumentGenerator {
  static generateBS5839Certificate(jobData: any, customerData: any): Buffer {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('FIRE ALARM CERTIFICATE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('BS5839-1:2017 Fire detection and fire alarm systems for buildings');
    doc.moveDown();

    // System Details
    doc.fontSize(14).text('System Details');
    doc.fontSize(10);
    doc.text(`Installation Address: ${customerData.address}`);
    doc.text(`Customer: ${customerData.companyName || customerData.contactName}`);
    doc.text(`Date of Installation: ${new Date().toLocaleDateString('en-GB')}`);
    doc.moveDown();

    // Equipment List
    doc.fontSize(14).text('Equipment Installed');
    doc.fontSize(10);
    
    if (jobData.equipment) {
      jobData.equipment.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item.description} - Qty: ${item.quantity}`);
      });
    }
    
    doc.moveDown();

    // Engineer Details
    doc.fontSize(14).text('Engineer Details');
    doc.fontSize(10);
    doc.text(`Name: ${jobData.engineerName}`);
    doc.text(`Signature: _________________________`);
    doc.moveDown();

    // Compliance Statement
    doc.fontSize(12).text('This system has been installed in accordance with BS5839-1:2017 and is fully operational.', { align: 'justify' });
    
    doc.end();

    return Buffer.concat(buffers);
  }

  static generateInvoice(invoiceData: any, customerData: any): Buffer {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('FireLink System', { align: 'center' });
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Invoice Details
    doc.fontSize(10);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    doc.text(`Invoice Date: ${new Date(invoiceData.createdAt).toLocaleDateString('en-GB')}`);
    doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString('en-GB')}`);
    doc.moveDown();

    // Customer Details
    doc.text('Bill To:');
    doc.text(customerData.companyName || customerData.contactName);
    doc.text(customerData.address || '');
    doc.text(customerData.postcode || '');
    doc.moveDown();

    // Line Items
    const tableTop = doc.y;
    doc.text('Description', 50, tableTop);
    doc.text('Amount', 400, tableTop, { width: 100, align: 'right' });
    
    doc.moveTo(50, doc.y + 5)
       .lineTo(550, doc.y + 5)
       .stroke();
    
    doc.moveDown();

    doc.text(invoiceData.description || 'Professional Services', 50);
    doc.text(`£${invoiceData.amount.toFixed(2)}`, 400, doc.y - 15, { width: 100, align: 'right' });
    
    doc.moveDown();
    doc.moveTo(50, doc.y + 5)
       .lineTo(550, doc.y + 5)
       .stroke();
    
    doc.moveDown();

    // Totals
    doc.text(`Net: £${invoiceData.amount.toFixed(2)}`, 400, doc.y, { width: 100, align: 'right' });
    doc.text(`VAT (20%): £${invoiceData.vatAmount.toFixed(2)}`, 400, doc.y + 15, { width: 100, align: 'right' });
    doc.text(`Total: £${invoiceData.totalAmount.toFixed(2)}`, 400, doc.y + 30, { width: 100, align: 'right', bold: true });

    // Payment Instructions
    doc.moveDown(2);
    doc.text('Payment Instructions:');
    doc.text('Please make payment to:');
    doc.text('Account Name: FireLink System Ltd');
    doc.text('Sort Code: 12-34-56');
    doc.text('Account Number: 12345678');

    doc.end();

    return Buffer.concat(buffers);
  }

  static generateJobReport(jobData: any): Buffer {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('JOB COMPLETION REPORT', { align: 'center' });
    doc.moveDown();

    // Job Details
    doc.fontSize(12);
    doc.text(`Job Title: ${jobData.title}`);
    doc.text(`Customer: ${jobData.customer.companyName || jobData.customer.contactName}`);
    doc.text(`Job Type: ${jobData.jobType}`);
    doc.text(`Completion Date: ${new Date().toLocaleDateString('en-GB')}`);
    doc.moveDown();

    // Work Summary
    doc.fontSize(14).text('Work Summary');
    doc.fontSize(10);
    doc.text(jobData.description || 'No description provided.');
    doc.moveDown();

    // Materials Used
    if (jobData.materials && jobData.materials.length > 0) {
      doc.fontSize(14).text('Materials Used');
      jobData.materials.forEach((material: any, index: number) => {
        doc.text(`${index + 1}. ${material.name} - Qty: ${material.quantity}`);
      });
      doc.moveDown();
    }

    // Engineer Notes
    if (jobData.notes) {
      doc.fontSize(14).text('Engineer Notes');
      doc.fontSize(10);
      doc.text(jobData.notes);
      doc.moveDown();
    }

    // Signatures
    doc.fontSize(12).text('Engineer Signature: _________________________');
    doc.moveDown();
    doc.text('Customer Signature: _________________________');
    doc.moveDown();
    doc.text('Date: _________________________');

    doc.end();

    return Buffer.concat(buffers);
  }
}
